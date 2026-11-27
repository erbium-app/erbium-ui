import { defineConfig } from "vite-plus";
import lint from "./oxlint.config.ts";
import fmt from "./oxfmt.config.ts";

export default defineConfig({
  fmt,
  lint: {
    ...lint,
    options: { typeAware: true, typeCheck: true },
  },
  run: {
    // Checks, generators, dev servers, and infrastructure commands must execute.
    // Opt into build caching with vp run build:cached.
    cache: { scripts: false, tasks: true },
  },
  staged: {
    "*": "vp check --fix",
  },
});
