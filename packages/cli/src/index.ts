#!/usr/bin/env node
import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as NodeServices from "@effect/platform-node/NodeServices";
import { Console, Effect } from "effect";
import { Argument, CliError, Command, Flag } from "effect/cli";
import packageJson from "../package.json" with { type: "json" };
import {
  defaultDocs,
  documentation,
  history,
  initialize,
  registryDocumentation,
  search,
} from "./discovery.ts";
import { runOperation } from "./operations.ts";
import { usage } from "./usage.ts";
import { buildRegistry, serveRegistry, validateRegistry } from "./registry-tools.ts";
import { hasRegistryConfig } from "./registry-config.ts";

const cwd = Flag.String("cwd").pipe(
  Flag.withDescription("Run from this project directory (default: current directory)"),
  Flag.withDefault("."),
);

const registry = Flag.String("registry").pipe(
  Flag.withDescription("Use this managed registry directory or URL for this command"),
  Flag.withDefault(""),
);

const json = Flag.Boolean("json").pipe(
  Flag.withDescription("Print machine-readable JSON"),
  Flag.withDefault(false),
);

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

  const packages = [];

  if (dependencies.length > 0 && (result.skipInstall || result.dryRun)) {
    const actionLabel = result.skipInstall ? "Install separately:" : "Would install";
    packages.push(`${actionLabel} ${dependencies.join(", ")}.`);
  }

  const conflicts = result.conflicts.map(
    (file) => `${result.dryRun ? "Would write" : "Wrote"} conflict markers in ${file}.`,
  );

  return [summary, ...conflicts, ...dropped, ...result.packages.ranges, ...packages].join("\n");
};

const visibleFlag = <A>(visible: boolean, flag: Flag.Flag<A>) =>
  visible ? flag : Flag.withHidden(flag);

const operation = (mode: keyof typeof commands) => {
  const writes = mode === "add" || mode === "adopt" || mode === "update";
  const installs = mode === "add" || mode === "update";

  const item = Argument.String("item").pipe(
    Argument.withDescription("Erbium item name, such as button or @erbium-examples/button-demo"),
  );

  const common = {
    cwd,
    registry: mode === "check" ? Flag.withHidden(registry) : registry,
    json,
    dryRun: visibleFlag(
      writes,
      Flag.Boolean("dry-run").pipe(
        Flag.withDescription("Plan file and dependency changes without applying them"),
        Flag.withDefault(false),
      ),
    ),
    local: visibleFlag(
      mode === "diff",
      Flag.Boolean("local").pipe(
        Flag.withDescription("Compare the installed baseline with the local files offline"),
        Flag.withDefault(false),
      ),
    ),
    at: visibleFlag(
      mode === "adopt",
      Flag.String("at").pipe(
        Flag.withDescription("Adopt from a published Git commit or unique commit prefix"),
        Flag.withDefault(""),
      ),
    ),
    only: visibleFlag(
      mode === "check",
      Flag.String("only").pipe(
        Flag.withDescription(
          "Run comma-separated checks: config, provenance, dependencies, imports",
        ),
        Flag.withDefault(""),
      ),
    ),
    names:
      mode === "diff"
        ? item.pipe(Argument.map((name) => [name]))
        : item.pipe(Argument.variadic({ min: mode === "add" || mode === "adopt" ? 1 : 0 })),
  };

  const config = installs
    ? {
        ...common,
        skipInstall: Flag.Boolean("skip-install").pipe(
          Flag.withDescription(
            "Track source and report missing packages for separate installation",
          ),
          Flag.withDefault(false),
        ),
        overwrite: Flag.Boolean("overwrite").pipe(
          Flag.withDescription("Replace selected files with registry copies"),
          Flag.withDefault(false),
        ),
        conflictMarkers: Flag.Boolean("conflict-markers").pipe(
          Flag.withDescription("Write overlapping edits with Git conflict markers"),
          Flag.withDefault(false),
        ),
      }
    : common;

  return Command.make(mode, config, (options) =>
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
    registry: registry.pipe(Flag.withDescription("Save a managed registry directory or URL")),
    headers: Flag.String("header").pipe(
      Flag.withDescription(`Save a header template such as 'Authorization: Bearer \${TOKEN}'`),
      Flag.atLeast(0),
    ),
    agents: Flag.Boolean("agents").pipe(
      Flag.withDescription("Write the Erbium skill and add it to AGENTS.md"),
      Flag.withDefault(false),
    ),
    json,
  },
  (options) =>
    query(initialize, [options.cwd, options.agents, options.registry, options.headers], (files) =>
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
    cwd,
    topic: Argument.String("topic").pipe(Argument.withDefault("installation")),
    site: Flag.String("site").pipe(
      Flag.withDescription("Read a guide from this docs site (public site by default)"),
      Flag.withDefault(""),
    ),
    registry,
  },
  (options) =>
    query(
      async () => {
        if (options.registry || (!options.site && (await hasRegistryConfig(options.cwd)))) {
          return await registryDocumentation(options.cwd, options.registry, options.topic);
        }

        return await documentation(options.topic, options.site || defaultDocs);
      },
      [],
      (markdown) => markdown,
    ),
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
    offline: Flag.Boolean("offline").pipe(
      Flag.withDescription("Skip registry lookups and report local usage"),
      Flag.withDefault(false),
    ),
    repo: Flag.String("repo").pipe(
      Flag.withDescription("Scan a temporary checkout of this Git repository"),
      Flag.withDefault(""),
    ),
    github: Flag.String("github").pipe(
      Flag.withDescription("Scan repositories visible to the GitHub CLI in this organization"),
      Flag.withDefault(""),
    ),
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
        input: Argument.String("catalog").pipe(
          Argument.withDescription("Path to a shadcn catalog with inlined file contents"),
        ),
        examples: Flag.String("examples").pipe(
          Flag.withDescription("Include a second catalog for @erbium-examples items"),
          Flag.withDefault(""),
        ),
        storybook: Flag.String("storybook").pipe(
          Flag.withDescription("Include a static Storybook build for item previews"),
          Flag.withDefault(""),
        ),
        usage: Flag.String("usage").pipe(
          Flag.withDescription("Publish a report from erbium usage --json"),
          Flag.withDefault(""),
        ),
        verify: Flag.String("verify").pipe(
          Flag.withDescription("Publish a report from erbium check --json"),
          Flag.withDefault(""),
        ),
        noSite: Flag.Boolean("no-site").pipe(
          Flag.withDescription("Publish only the managed and shadcn registry files"),
          Flag.withDefault(false),
        ),
        history: Flag.Boolean("history").pipe(
          Flag.withDescription("Publish revisions from the catalogs’ first-parent Git history"),
          Flag.withDefault(false),
        ),
        out: Flag.String("out").pipe(
          Flag.withDescription("Write artifacts to this directory (default: dist/registry)"),
          Flag.withDefault("dist/registry"),
        ),
      },
      (options) =>
        query(
          buildRegistry,
          [options],
          ({ output, count }) => `Built ${count} items in ${output}.`,
        ),
    ).pipe(Command.withDescription("Validate catalogs and write a static registry")),
    Command.make("validate", { cwd, registry }, (options) =>
      query(
        validateRegistry,
        [options.cwd, options.registry],
        (count) => `Validated ${count} items.`,
      ),
    ).pipe(Command.withDescription("Validate a managed registry’s revisions and imports")),
    Command.make(
      "serve",
      {
        cwd,
        directory: Argument.String("directory").pipe(Argument.withDefault("dist/registry")),
        port: Flag.Int("port").pipe(
          Flag.withDescription("Listen on this loopback port (default: 4178)"),
          Flag.withDefault(4178),
        ),
      },
      ({ cwd: root, directory, port }) =>
        Effect.gen(function* serve() {
          yield* Console.log(`Serving registry on http://127.0.0.1:${port}/`);
          yield* Effect.tryPromise({
            try: async (signal) => {
              await serveRegistry(root, directory, port, signal);
            },
            catch: (cause) => new CliError.UserError({ cause }),
          });
        }),
    ).pipe(Command.withDescription("Serve a built registry on loopback for local testing")),
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
