#!/usr/bin/env node
import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as NodeServices from "@effect/platform-node/NodeServices";
import { Console, Effect } from "effect";
import { Argument, CliError, Command, Flag } from "effect/cli";
import packageJson from "../package.json" with { type: "json" };
import { defaultDocs, documentation, history, initialize, search } from "./discovery.ts";
import { runOperation } from "./operations.ts";
import { usage } from "./usage.ts";
import { buildRegistry, serveRegistry, validateRegistry } from "./registry-tools.ts";
import { defaultRegistry } from "./registry.ts";

const cwd = Flag.String("cwd").pipe(Flag.withDefault("."));
const registry = Flag.String("registry").pipe(Flag.withDefault(defaultRegistry));
const json = Flag.Boolean("json").pipe(Flag.withDefault(false));

const commands = {
  add: "Install components and track the source you received",
  adopt: "Track an existing shadcn install that matches the current revision",
  check: "Verify tracked files and package declarations offline",
  diff: "Compare the installed baseline with upstream or your local edits",
  status: "Show local changes and available revisions",
  update: "Merge registry changes into tracked source",
} as const;

type Result = Awaited<ReturnType<typeof runOperation>>;

type Report = Extract<Result, readonly unknown[]>[number];

const reportLine = (entry: Report): string[] => {
  if ("diff" in entry) {
    return entry.diff.length === 0 ? [] : [`${entry.target}\n${entry.diff}`];
  }

  const states = [
    ...(entry.removed ? ["removed upstream"] : []),
    ...(entry.updateAvailable ? ["update available"] : []),
  ];

  const files = entry.files.flatMap((file) => {
    const conditions = [
      ...(file.missing ? ["missing"] : []),
      ...(file.conflict ? ["unresolved conflict"] : []),
      ...(file.modified ? ["modified locally"] : []),
    ];

    return conditions.length === 0 ? [] : [`  ${file.target}  ${conditions.join(", ")}`];
  });

  return [`${entry.id}  ${states.length === 0 ? "current" : states.join(", ")}`, ...files];
};

const render = (result: Result, jsonOutput: boolean): string => {
  if (jsonOutput) {
    return JSON.stringify(result, null, 2);
  }

  if (Array.isArray(result)) {
    return result.length === 0 ? "No tracked items." : result.flatMap(reportLine).join("\n");
  }

  if ("steps" in result) {
    return result.steps
      .flatMap(({ step, ok, notes }) => [`${step}: ${ok ? "passed" : "failed"}`, ...notes])
      .join("\n");
  }

  const action = result.dryRun ? "Would track" : "Tracked";
  const change = result.dryRun ? "would change" : "changed";

  const summary =
    result.items.length > 0
      ? `${action} ${result.items.length} items. ${result.files.length} source files ${change}.`
      : "No updates to apply.";

  const dropped = result.dropped.map((file) => `Kept ${file}. The item no longer ships it.`);
  const dependencies = [...result.packages.dependencies, ...result.packages.devDependencies];

  const packages =
    result.dryRun && dependencies.length > 0 ? [`Would install ${dependencies.join(", ")}.`] : [];

  return [summary, ...dropped, ...result.packages.ranges, ...packages].join("\n");
};

const operation = (mode: keyof typeof commands) => {
  const required = mode === "add" || mode === "adopt" || mode === "diff";

  return Command.make(
    mode,
    {
      cwd,
      registry,
      json,
      dryRun: Flag.Boolean("dry-run").pipe(Flag.withDefault(false)),
      local: Flag.Boolean("local").pipe(Flag.withDefault(false)),
      at: Flag.String("at").pipe(Flag.withDefault("")),
      only: Flag.String("only").pipe(Flag.withDefault("")),
      names: Argument.String("item").pipe(Argument.variadic({ min: required ? 1 : 0 })),
    },
    (options) =>
      Effect.gen(function* runCommand() {
        const result = yield* Effect.tryPromise({
          try: async () => await runOperation(mode, options),
          catch: (cause) => new CliError.UserError({ cause }),
        });

        const output = render(result, options.json);

        if (output.length > 0) {
          yield* Console.log(output);
        }

        if ("ok" in result && !result.ok) {
          yield* new CliError.UserError({ cause: new Error("Erbium check failed.") });
        }
      }),
  ).pipe(Command.withDescription(commands[mode]));
};

const query = <A, Args extends readonly unknown[]>(
  work: (...args: Args) => Promise<A>,
  args: Args,
  print: (result: A) => string,
) =>
  Effect.gen(function* runQuery() {
    const result = yield* Effect.tryPromise({
      try: async () => await work(...args),
      catch: (cause) => new CliError.UserError({ cause }),
    });

    yield* Console.log(print(result));
  });

const data = JSON.stringify;

const init = Command.make(
  "init",
  {
    cwd,
    agents: Flag.Boolean("agents").pipe(Flag.withDefault(false)),
    json,
  },
  (options) =>
    query(initialize, [options.cwd, options.agents], (files) =>
      options.json ? data(files) : files.join("\n") || "Erbium is configured.",
    ),
).pipe(Command.withDescription("Configure the Erbium registries in a shadcn project"));

const searchCommand = Command.make(
  "search",
  {
    cwd,
    registry,
    json,
    terms: Argument.String("term").pipe(Argument.variadic()),
  },
  (options) =>
    query(search, [options.cwd, options.registry, options.terms], (items) =>
      options.json
        ? data(items)
        : items
            .map((item) => `${item.id}  ${item.description?.split("\n")[0] ?? ""}`.trimEnd())
            .join("\n"),
    ),
).pipe(Command.withDescription("Find registry items by name and description"));

const docs = Command.make(
  "docs",
  {
    topic: Argument.String("topic").pipe(Argument.withDefault("installation")),
    site: Flag.String("site").pipe(Flag.withDefault(defaultDocs)),
  },
  ({ topic, site }) => query(documentation, [topic, site], (markdown) => markdown),
).pipe(Command.withDescription("Read Erbium documentation as Markdown"));

const historyCommand = Command.make(
  "history",
  {
    cwd,
    registry,
    json,
    item: Argument.String("item"),
  },
  (options) =>
    query(history, [options.cwd, options.registry, options.item], (releases) =>
      options.json
        ? data(releases)
        : releases
            .map(
              ({ revision, commit, date, current }) =>
                `${revision}  ${commit ?? ""}  ${date ?? ""}${current ? "  current" : ""}`,
            )
            .join("\n"),
    ),
).pipe(Command.withDescription("Show published revisions of an item"));

const usageCommand = Command.make(
  "usage",
  {
    cwd,
    registry,
    json,
    offline: Flag.Boolean("offline").pipe(Flag.withDefault(false)),
    repo: Flag.String("repo").pipe(Flag.withDefault("")),
    github: Flag.String("github").pipe(Flag.withDefault("")),
  },
  (options) =>
    query(
      usage,
      [options.cwd, options.registry, options.offline, options.repo, options.github],
      (projects) =>
        options.json
          ? data(projects)
          : projects
              .flatMap(({ project, items }) =>
                items.map(
                  (item) =>
                    `${project}  ${item.id}  ${item.importedBy.length} importing files${item.updateAvailable ? "  update available" : ""}`,
                ),
              )
              .join("\n") || "No tracked projects.",
    ),
).pipe(Command.withDescription("Show tracked items and their imports in a Git repository"));

const registryCommands = Command.make("registry").pipe(
  Command.withDescription("Build, validate, and serve a versioned Erbium registry"),
  Command.withSubcommands([
    Command.make(
      "build",
      {
        cwd,
        input: Argument.String("catalog"),
        examples: Flag.String("examples").pipe(Flag.withDefault("")),
        out: Flag.String("out").pipe(Flag.withDefault("dist/registry")),
      },
      ({ cwd: root, input, examples, out }) =>
        query(
          buildRegistry,
          [root, input, examples, out],
          ({ output, count }) => `Built ${count} items in ${output}.`,
        ),
    ),
    Command.make("validate", { cwd, registry }, (options) =>
      query(
        validateRegistry,
        [options.cwd, options.registry],
        (count) => `Validated ${count} items.`,
      ),
    ),
    Command.make(
      "serve",
      {
        directory: Argument.String("directory").pipe(Argument.withDefault("dist/registry")),
        port: Flag.Int("port").pipe(Flag.withDefault(4178)),
      },
      ({ directory, port }) =>
        Effect.gen(function* serve() {
          yield* Console.log(`Serving registry on http://127.0.0.1:${port}/r/erbium`);
          yield* Effect.tryPromise({
            try: async (signal) => {
              await serveRegistry(directory, port, signal);
            },
            catch: (cause) => new CliError.UserError({ cause }),
          });
        }),
    ),
  ]),
);

const cli = Command.make("erbium").pipe(
  Command.withDescription("Manage source-owned Erbium UI components"),
  Command.withSubcommands([
    init,
    searchCommand,
    docs,
    historyCommand,
    usageCommand,
    registryCommands,
    operation("add"),
    operation("adopt"),
    operation("status"),
    operation("diff"),
    operation("update"),
    operation("check"),
  ]),
);

NodeRuntime.runMain(
  Command.run(cli, { version: packageJson.version }).pipe(Effect.provide(NodeServices.layer)),
);
