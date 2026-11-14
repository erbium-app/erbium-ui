#!/usr/bin/env node
import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as NodeServices from "@effect/platform-node/NodeServices";
import { Console, Effect } from "effect";
import { Argument, CliError, Command, Flag } from "effect/cli";
import packageJson from "../package.json" with { type: "json" };
import { runOperation } from "./operations.ts";
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
      }),
  ).pipe(Command.withDescription(commands[mode]));
};

const cli = Command.make("erbium").pipe(
  Command.withDescription("Manage source-owned Erbium UI components"),
  Command.withSubcommands([
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
