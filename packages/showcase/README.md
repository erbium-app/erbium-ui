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

Catalogs preserve stable story export names. Storybook namespaces are generated from the shared semantic section and the component Markdown title; docs navigation consumes the same taxonomy. Variant names and prose live in `packages/content/components/<component>/<variant>.md`; component documentation lives in `index.md`. The catalog imports that Markdown and the real variant source, so descriptions and source panels stay synchronized.

## Authoring

1. Add or edit a React composition in `src/<component>/variants/<variant>.tsx`. Keep reusable state, helpers and fixtures in that component's folder. Use `@erbium/ui` primitives and real event handlers.
2. Add its named export to `catalog.tsx`, with any default `args`, `argTypes`, layout parameters. Use the matching `variantDocumentation` and `?raw` source imports. Classify the component once in `packages/content/src/sections.json`; do not add a title to the catalog.
3. Add the matching Markdown file under `packages/content/components/<component>/`, with a JSON-quoted `title` and the stable `story` export name in frontmatter. An empty body is valid when the example has no additional explanation.
4. Run `bun run showcase:generate`, then `bun run showcase:registry` from the workspace root.
5. Run `bun run showcase:check` and review both applications with `bun run showcase`.

Generation creates static Storybook adapters; edit the shared catalog instead of those adapters. The website creates one React island per variant, hydrates visible previews, and exposes the catalog's playground controls. Both applications use the same theme and providers. Toast documentation mounts one toaster for the page.

## Installable examples and stories

The `@erbium-examples` registry complements the existing `@erbium` UI registry:

- `<component>-<variant>` installs an individual variant and its local dependency graph.
- `<component>-examples` installs every variant of a component.
- `<component>-stories` installs portable React CSF stories, including examples, controls, defaults, Markdown descriptions. It adds `@storybook/react` as a development dependency and uses the consumer's existing Storybook configuration.
- Existing standalone names such as `button-demo` remain supported.

Registry generation follows relative imports recursively, includes helper files, derives npm and UI registry dependencies, and rewrites workspace imports into canonical shadcn imports. Targets use the consumer's configured `components`, `ui`, `lib` and `hooks` aliases. Erbium's class merger installs as `erbium-utils.ts` so the consumer's existing shadcn utility remains available.

The documentation serves the UI registry at `/r/ui/` and the showcase registry at `/r/examples/`, in development and static builds. Storybook serves the showcase package's `public/r` at `/r/`. Generated registry JSON belongs to its source package; applications publish those artifacts during their builds.

`bun run showcase:check` verifies generated artifacts, repository lint/types, and both builds. Example attribution is retained in [ATTRIBUTION.md](./ATTRIBUTION.md), with licenses under `licenses/`. Examples are organized by component and scenario in `src/<component>/examples`; provenance does not determine their directory.
