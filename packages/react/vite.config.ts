import { createRequire } from "node:module";
import path from "node:path";
import { defineConfig } from "vite-plus";
import entries from "./entries.json" with { type: "json" };

/*
 * `entries.json` lists the published entries. Client entries export components or hooks, and
 * `scripts/finalize-dist.mjs` marks each with "use client" so React Server Components frameworks
 * treat it as a client boundary. Server entries are pure and stay unmarked.
 */

const source = (entry: string) => `src/${entry}.ts`;

// The repository uses a TypeScript 7 development build, which tsdown does not detect as
// TypeScript Go, so its compiler is passed explicitly for declaration files.
const tsc = path.join(
  path.dirname(createRequire(import.meta.url).resolve("typescript/package.json")),
  "bin/tsc",
);

export default defineConfig({
  pack: {
    clean: true,
    dts: { generator: "tsgo", tsgo: { path: tsc } },
    entry: Object.fromEntries(
      [
        ...entries.client,
        ...entries.server,
        ...Object.keys(entries.facades),
        ...Object.values(entries.facades),
      ].map((entry) => [entry, source(entry)]),
    ),
    format: ["esm"],
    outDir: "dist",
    platform: "neutral",
    // Keep the client re-export in its own module so the public facade stays server-safe.
    plugins: [
      {
        name: "filters-client-boundary",
        resolveId(id, importer) {
          if (id === "./client" && importer?.endsWith("/src/filters/index.ts") === true) {
            return { external: true, id: "./client.js" };
          }

          return null;
        },
      },
    ],
    sourcemap: false,
    target: "es2022",
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}", "test/**/*.test.ts"],
    setupFiles: ["./test/setup.ts"],
  },
});
