# Shared showcases

`@erbium/showcase` owns the React compositions used by the documentation site and Storybook. `@erbium/ui` owns primitives and styles; `@erbium/content` owns Markdown and the semantic taxonomy in `src/sections.json`. Applications consume these packages without importing each other's source.

```text
packages/showcase/
  src/
    checkbox/
      catalog.tsx          # Ordered named variants, defaults and controls
      variants/            # One React composition per named variant
        playground.tsx
        controlled.tsx
      examples/            # Scenario compositions, fixtures, and local helpers
      helpers.tsx          # Component-specific shared logic, where needed
    preview.tsx            # Shared CSP and overlay providers
    types.ts               # Framework-independent catalog types
  manifest.json            # Generated component/variant inventory
  registry.json            # Generated registry inventory
  public/r/                # Generated installable registry items
  scripts/
```

Catalogs preserve stable story export names. Storybook namespaces are generated from the shared semantic section and the component Markdown title; docs navigation consumes the same taxonomy. Variant names and prose live in `packages/content/components/<component>/<variant>.md`; component documentation lives in `index.md`. The catalog imports that Markdown, the preview composition, and the runnable usage source through `?raw`. The usage source is part of the preview’s import graph. Both applications use that same file for the Code tab.

## Authoring

1. Write the usage component as `export default function ComponentVariantExample()`. Use an explicit return, complete imports, real event handlers, and a descriptive name ending in `Example`. Put state and required layout in that function. A developer must be able to render it without Storybook args. Keep local helpers and fixtures in the component’s folder.
2. Render that component from `variants/<variant>.tsx`. Keep preview framing, simulated navigation hosts, and demonstration controls outside the usage component when they are unnecessary for using the API. The catalog’s `VariantSource` raw import points to the usage component actually rendered by the preview. When the variant itself is useful copyable usage, import that file as the source.
3. For playgrounds, export `defaultProps` from the usage file and import those defaults into the catalog’s `args`. Pass them as the function’s parameter default. This keeps standalone usage and playground controls synchronized.
4. Add its named export to `catalog.tsx`, with any default `args`, `argTypes`, layout parameters. Use the matching `variantDocumentation` and `?raw` source imports. Classify the component once in `packages/content/src/sections.json`; do not add a title to the catalog.
5. Add the matching Markdown file under `packages/content/components/<component>/`, with a JSON-quoted `title` and the stable `story` export name in frontmatter. An empty body is valid when the example has no additional explanation.
6. Run `bun run showcase:generate`, then `bun run showcase:registry` from the workspace root.
7. Run `bun run showcase:check` and review both applications with `bun run showcase`.

Generation creates static Storybook adapters; edit the shared catalog instead of those adapters. The website creates one React island per variant, hydrates visible previews, and exposes the catalog's playground controls. Both applications use the same theme and providers. Toast documentation mounts one toaster for the page.

## Displayed usage

Generation follows the usage entry’s relative imports and verifies that the entry is consumed by the preview. The docs show the entry first, followed by required local files in file tabs. Single-file examples have one code block. Copy includes the whole module, including imports, state, and its default export. The docs derive default Shadcn import aliases from the UI registry’s install targets. Adjust these aliases to match your application’s `components.json`.

The generated manifest keeps usage files and preview entries explicit. Registry installation follows the preview entry so installed examples and portable stories retain their demonstration behavior. The docs page source and agent-readable examples use the usage files. Run generation in check mode to catch missing dependencies, disconnected usage entries, and inconsistent entry exports.

## Installable examples and stories

The `@erbium-examples` registry complements the existing `@erbium` UI registry:

- `<component>-<variant>` installs an individual variant and its local dependency graph.
- `<component>-examples` installs every variant of a component.
- `<component>-stories` installs portable React CSF stories, including examples, controls, defaults, Markdown descriptions. It adds `@storybook/react` as a development dependency and uses the consumer's existing Storybook configuration.
- Existing standalone names such as `button-demo` remain supported.

Registry generation follows relative imports recursively, includes helper files, derives npm and UI registry dependencies, and rewrites workspace imports into canonical shadcn imports. Targets use the consumer's configured `components`, `ui`, `lib` and `hooks` aliases. Erbium's class merger installs as `erbium-utils.ts` so the consumer's existing shadcn utility remains available.

The documentation serves the UI registry at `/r/ui/` and the showcase registry at `/r/examples/`, in development and static builds. Storybook serves the showcase package's `public/r` at `/r/`. Generated registry JSON belongs to its source package; applications publish those artifacts during their builds.

`bun run showcase:check` verifies generated artifacts, repository lint/types, and both builds. Examples adapted from shadcn/ui retain its [MIT license](./licenses/shadcn-ui.md). Examples are organized by component and scenario in `src/<component>/examples`; provenance does not determine their directory.
