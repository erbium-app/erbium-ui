import { defineConfig } from "vite-plus";

export default defineConfig({
  run: {
    tasks: {
      build: {
        command: "node scripts/generate.mjs",
        cache: {
          input: ["svg/**/*.svg", "scripts/**", "package.json", "vite.config.ts", "../../bun.lock"],
          output: ["src/generated/**"],
        },
      },
    },
  },
});
