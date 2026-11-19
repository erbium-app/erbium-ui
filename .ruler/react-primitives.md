# @erbium-ui/react primitives

Put behavior (state, keys, value math) in `packages/react`. The `packages/ui` component stays thin: classes, `data-slot` and skeleton hints. Copy Pagination or Slider.

- **`src/<name>/`** holds four kinds of file.
  - `core.ts`: pure functions with no React, safe on the server.
  - `parts.tsx`: Base UI `useRender` and `mergeProps`, or Base UI parts wrapped. Uses the `src/internal` helpers: `useControlledState`, `createChangeDetails`, `dataFlag` and `missingContext`.
  - `index.ts`: the `X = { Root, … }` namespace, hooks and types, then `export * from "./core"`.
  - Tests: `core.test.ts` (node), `<name>.test.tsx` (Testing Library) and `<name>-server.test.tsx` (`renderToString`).
- **Entries** go in three places, and `test/manifest.test.ts` checks they match.
  - `entries.json`: `client` for parts (the build adds `"use client"`), `server` for `core`.
  - `package.json` `exports`: the `./src` file.
  - `publishConfig.exports`: the `./dist` file plus `types`.
- **UI** imports `@erbium-ui/react/<name>`. `ui:registry` adds the `@erbium-ui/react@^x` dependency itself. Move shared lib math into `core.ts` and delete the old lib file.
- **Docs** need five updates.
  - A new page, `packages/content/react/<name>.md`, with frontmatter, a link to the styled page, an `**Import:**` line, Anatomy and API.
  - The name added to the `react` section of `packages/content/src/sections.json`.
  - Rows in both tables of `packages/content/react/index.md`.
  - The `packages/react/README.md` entry table and a short section.
  - A link from the styled page `components/<name>/index.md` to the new page.
