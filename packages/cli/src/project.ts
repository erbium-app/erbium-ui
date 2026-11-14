import { lstat, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { getTsconfig, resolvePathAlias } from "get-tsconfig";
import * as Schema from "effect/Schema";
import { parseJson } from "./revision.ts";
import type { Snapshot } from "./revision.ts";

const digest = Schema.String.check(Schema.isPattern(/^[a-f0-9]{64}$/u));

const trackedItem = Schema.Struct({
  revision: digest,
  files: Schema.Record(Schema.String, digest),
  dependencies: Schema.Array(Schema.String),
  devDependencies: Schema.Array(Schema.String),
  registryDependencies: Schema.Array(Schema.String),
});

const lockSchema = Schema.Struct({
  version: Schema.Literal(1),
  items: Schema.Record(Schema.String, trackedItem),
  aliases: Schema.optionalKey(Schema.Record(Schema.String, Schema.String)),
});

const configSchema = Schema.Struct({
  aliases: Schema.Record(Schema.String, Schema.String),
  tsx: Schema.optionalKey(Schema.Boolean),
});

const aliasTarget = /^@(?<alias>ui|components|hooks|lib)\/(?<suffix>.+)$/u;

const canonicalImport =
  /(?<quote>["'])@\/registry\/erbium\/(?<group>ui|components|hooks|lib|blocks)\/(?<name>[^"'\n]+)\k<quote>/gu;

// Shadcn emits TypeScript starting at the first token, omitting initial trivia.
const leadingTrivia = /^(?:#![^\r\n]*)?(?:\s+|\/\/[^\r\n]*|\/\*[\s\S]*?\*\/)*/u;

const reservedTargets = new Set([
  ".erbium",
  "components.json",
  "package.json",
  "package-lock.json",
  "bun.lock",
  "bun.lockb",
  "pnpm-lock.yaml",
  "yarn.lock",
]);

export const lockPath = ".erbium/lock.json";

export type LockedItem = typeof trackedItem.Type;

export type Lock = typeof lockSchema.Type;

export type ProjectConfig = ReturnType<typeof projectConfig> extends Promise<infer A> ? A : never;

const errorCode = Schema.decodeUnknownOption(Schema.Struct({ code: Schema.Literal("ENOENT") }));

export const readText = async (file: string): Promise<string | undefined> => {
  try {
    return await readFile(file, "utf-8");
  } catch (error) {
    if (errorCode(error)._tag !== "Some") {
      throw error;
    }

    return undefined;
  }
};

export const safePath = async (root: string, target: string): Promise<string> => {
  const segments = target.split("/");

  if (
    path.isAbsolute(target) ||
    target.includes("\\") ||
    segments.some((part) => !part || part === ".." || part === "." || part.includes(":")) ||
    segments[0] === ".git" ||
    segments[0] === "node_modules"
  ) {
    throw new Error(`Unsafe project path: ${target}`);
  }

  const prefixes = segments.map((_part, index) => path.join(root, ...segments.slice(0, index + 1)));

  const entries = await Promise.all(
    prefixes.map(async (entry) => {
      try {
        return await lstat(entry);
      } catch (error) {
        if (errorCode(error)._tag !== "Some") {
          throw error;
        }

        return null;
      }
    }),
  );

  if (entries.some((entry) => entry?.isSymbolicLink() === true)) {
    throw new Error(`Refusing to write through a symbolic link: ${target}`);
  }

  return path.join(root, ...segments);
};

export const atomicWrite = async (file: string, text: string): Promise<void> => {
  await mkdir(path.dirname(file), { recursive: true });
  const temporary = `${file}.${randomUUID()}.tmp`;

  try {
    await writeFile(temporary, text, { flag: "wx" });
    await rename(temporary, file);
  } finally {
    await rm(temporary, { force: true });
  }
};

export const loadLock = async (root: string): Promise<Lock> => {
  const text = await readText(await safePath(root, lockPath));

  return text === undefined
    ? { version: 1, items: {} }
    : Schema.decodeUnknownSync(lockSchema)(parseJson(text));
};

export const projectConfig = async (root: string) => {
  const text = await readText(path.join(root, "components.json"));

  if (text === undefined) {
    throw new Error("Set up components.json with shadcn init first.");
  }

  const config = Schema.decodeUnknownSync(configSchema)(parseJson(text));
  const { components } = config.aliases;

  if (components === undefined || components.length === 0 || config.tsx === false) {
    throw new Error("Erbium requires a TypeScript shadcn project with a components alias.");
  }

  const prefix = components.slice(0, components.lastIndexOf("/"));

  const aliases = {
    components,
    ui: config.aliases.ui ?? `${components}/ui`,
    hooks: config.aliases.hooks ?? `${prefix}/hooks`,
    lib: config.aliases.lib ?? `${prefix}/lib`,
    blocks: `${components}/blocks`,
  };

  return { aliases, tsconfig: getTsconfig(root) };
};

const aliasName = Schema.decodeUnknownSync(
  Schema.Literals(["ui", "components", "hooks", "lib", "blocks"]),
);

const importAlias = (config: ProjectConfig, group: string): string =>
  config.aliases[aliasName(group)];

export const planFiles = (root: string, config: ProjectConfig, snapshot: Snapshot) =>
  (snapshot.item.files ?? []).map((file) => {
    let target = file.target.slice(2);

    if (!file.target.startsWith("~/")) {
      const match = aliasTarget.exec(file.target);
      const alias = match?.groups?.alias;
      const suffix = match?.groups?.suffix;

      const [absolute] =
        alias !== undefined && suffix !== undefined && config.tsconfig !== undefined
          ? resolvePathAlias(config.tsconfig, `${importAlias(config, alias)}/${suffix}`)
          : [];

      if (absolute === undefined) {
        throw new Error(
          `Cannot resolve ${file.target} for ${snapshot.id}. Check components.json and tsconfig.json.`,
        );
      }

      target = path.relative(root, absolute).split(path.sep).join("/");
    }

    if (
      target.startsWith(".erbium/") ||
      reservedTargets.has(target) ||
      /(?:^|\/)\.env(?:\.|$)/u.test(target)
    ) {
      throw new Error(`Protected install target: ${target}`);
    }

    const content =
      /\.tsx?$/u.test(target) && file.type !== "registry:file" && file.type !== "registry:item"
        ? file.content
            .replace(leadingTrivia, "")
            .replaceAll(
              canonicalImport,
              (_match, quote: string, group: string, name: string) =>
                `${quote}${importAlias(config, group)}/${name}${quote}`,
            )
        : file.content;

    return { content, target };
  });

export const validateAliases = async (root: string) => {
  const config = await projectConfig(root);
  const aliases: Record<string, string> = {};

  for (const [name, specifier] of Object.entries(config.aliases)) {
    const [resolved] =
      config.tsconfig === undefined
        ? []
        : resolvePathAlias(config.tsconfig, `${specifier}/erbium-target`);

    if (resolved === undefined) {
      throw new Error(
        `Alias ${specifier} does not resolve. Check components.json and tsconfig.json.`,
      );
    }

    aliases[name] = path.relative(root, path.dirname(resolved)).split(path.sep).join("/") || ".";
  }

  return aliases;
};
