import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    clean: true,
    entry: ["src/index.ts"],
    // The package is ESM, and `bin` points at `dist/index.js` rather than `.mjs`.
    fixedExtension: false,
    format: ["esm"],
    outDir: "dist",
    platform: "node",
  },
  test: {
    include: ["test/**/*.test.ts"],
    // Each test runs the built CLI in child processes several times.
    testTimeout: 60_000,
  },
});
