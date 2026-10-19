import { defineConfig } from "vite-plus";

export default defineConfig({
  run: {
    tasks: {
      build: {
        cache: {
          input: ["svg/**/*.svg", "scripts/**", "package.json", "vite.config.ts", "../../bun.lock"],
          output: ["src/generated/**"],
        },
        command: "node scripts/generate.mjs",
      },
    },
  },
});
