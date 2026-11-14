import { createRequire } from "node:module";
import { realpath, stat } from "node:fs/promises";
import path from "node:path";
import { resolvePathAlias } from "get-tsconfig";
import type { ProjectConfig } from "./project.ts";

const sourceImport =
  /(?:^\s*(?:import|export)\b[^;]*?\bfrom\s*|\bimport\s*\(\s*|^\s*import\s*)(?<quote>["'])(?<source>[^"'\r\n]+)\k<quote>/gmu;

const extensions = [".ts", ".tsx", ".js", ".jsx", ".json", ".css"];

export const importSpecifiers = (content: string): string[] => [
  ...new Set([...content.matchAll(sourceImport)].flatMap((match) => match.groups?.source ?? [])),
];

export const resolveLocalImport = async (
  config: Pick<ProjectConfig, "tsconfig"> & { aliases?: ProjectConfig["aliases"] },
  importer: string,
  specifier: string,
  resolvePackages = false,
) => {
  const alias = config.tsconfig === undefined ? [] : resolvePathAlias(config.tsconfig, specifier);

  const candidates = specifier.startsWith(".")
    ? [path.resolve(path.dirname(importer), specifier)]
    : alias;

  const paths = candidates.flatMap((candidate) => [
    candidate,
    ...extensions.map((extension) => candidate + extension),
    ...extensions.map((extension) => path.join(candidate, `index${extension}`)),
    candidate.replace(/\.jsx?$/u, ".ts"),
    candidate.replace(/\.jsx?$/u, ".tsx"),
  ]);

  const existence = await Promise.all(
    paths.map(async (candidate) => {
      const info = await stat(candidate).catch(() => null);

      return info?.isFile() === true ? candidate : undefined;
    }),
  );

  let target = existence.find((candidate) => candidate !== undefined);

  if (target === undefined && resolvePackages && candidates.length === 0) {
    try {
      const resolved = createRequire(importer).resolve(specifier);
      target = path.isAbsolute(resolved) ? await realpath(resolved) : undefined;
    } catch {
      target = undefined;
    }
  }

  return {
    expectedLocal:
      candidates.length > 0 ||
      Object.values(config.aliases ?? {}).some(
        (prefix) => specifier === prefix || specifier.startsWith(`${prefix}/`),
      ),
    target,
  };
};
