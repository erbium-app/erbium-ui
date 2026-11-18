// @vitest-environment node
import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";
import manifest from "../package.json" with { type: "json" };
import entries from "../entries.json" with { type: "json" };

const packageRoot = path.dirname(import.meta.dirname);
const all = [...entries.client, ...entries.server, ...Object.keys(entries.facades)];

const sourceExports: Partial<Record<string, string>> = manifest.exports;

const published: Partial<Record<string, { types: string; default: string } | string>> =
  manifest.publishConfig.exports;

/** The subpath an entry is published at: `cascader/index` is `./cascader`. */
const subpath = (entry: string) => `./${entry.replace(/\/index$/u, "")}`;

describe("package manifest", () => {
  it("exports every entry from source inside the repository", () => {
    for (const entry of all) {
      const target = sourceExports[subpath(entry)];

      expect(target).toBe(`./src/${entry}.ts`);
      expect(existsSync(path.join(packageRoot, target ?? ""))).toBe(true);
    }
  });

  it("publishes every entry from dist with its declarations", () => {
    for (const entry of all) {
      expect(published[subpath(entry)]).toEqual({
        default: `./dist/${entry}.js`,
        types: `./dist/${entry}.d.ts`,
      });
    }

    const expectedSubpaths = [...all.map(subpath), "./package.json"].toSorted();

    expect(Object.keys(published).toSorted()).toEqual(expectedSubpaths);
    expect(Object.keys(manifest.exports).toSorted()).toEqual(expectedSubpaths);
  });

  it("ships only the build output", () => {
    expect(manifest.files).toEqual(["dist", "LICENSE", "README.md"]);
    expect(manifest.sideEffects).toBe(false);
  });
});
