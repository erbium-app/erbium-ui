# 19 — `@erbium-ui/react` headless package

Reviewed 2026-11-18. Some `packages/ui` components implement behavior (state machines, tree indexes, URL codecs, keyboard models) in the same file as their Tailwind classes. Cascader is 937 lines; filters span `blocks/filters.tsx`, `lib/filter-rules.ts`, `lib/filter-search.ts` and `hooks/use-filters.ts` (about 1,900 lines). Most other components only style Base UI parts.

`@erbium-ui/react` is an unstyled, published package that owns this behavior with a wide API, the way Base UI owns Menu and Select. `packages/ui` stays the styled, source-owned registry and closes the API (see [18 — Closed APIs](./18-closed-apis.md)). The drawer shows the split: Base UI offers four swipe directions, and Erbium UI always renders a bottom sheet.

The primitives are redesigned, not moved. Each component was split into design, function and reactions, and only the last two become parts. The parts are specified in [19 — primitive APIs](./19-erbium-ui-react-api.md).

Out of scope: Questionnaire stays on `@shadcn/react/questionnaire`. Control is deferred.

## How shadcn does it

Source: `shadcn-ui/ui` at `968d8cb9d`, package `packages/react`.

- **Package.** `@shadcn/react`, "Unstyled components for React": `message-scroller` and `questionnaire`. Each is a folder with `index.ts`, `components.tsx`, `context.ts`, `types.ts`, one hook per part, pure helpers, a README and tests.
- **Exports.** Subpath exports only, ESM only, `sideEffects: false`, `files: ["dist"]`, built with tsup.
- **API shape.** A namespace object (`Questionnaire.Root`, `Questionnaire.Item`) matching Base UI. Each part calls its hook and renders through `useRender` with a `render` prop and state as `data-*` attributes.
- **Dependencies.** None at runtime; `useRender` is vendored from Base UI because shadcn ships Radix, Base UI and React Aria bases.
- **Styled layer.** The registry file imports `{ Questionnaire as QuestionnairePrimitive }`, adds `data-slot` and classes, and declares `dependencies: ["@shadcn/react"]` so the CLI installs it.
- **Docs.** A separate `@shadcn/react` docs section (`content/docs/react/*.mdx`): installation, import, anatomy, a table mapping styled components to unstyled parts, usage, keyboard, accessibility, data attributes and an API reference per part. Styled examples live on the component pages.
- **Release.** Changesets with independent versions, npm trusted publishing (OIDC), `release: beta` snapshot labels. A new package needs a hand-published placeholder before a trusted publisher can be added.
- **RSC.** A tsup plugin prepends `"use client"` to each dist entry.

## What differs for Erbium

- Erbium is Base UI only, so `@erbium-ui/react` takes `@base-ui/react` as a peer dependency and uses its `useRender`, `mergeProps` and Menu parts. Cascader is a Menu.
- `@erbium/ui` ships source, so its registry items pin a range of `@erbium-ui/react` instead of a bare name.
- Pure entries (`cascader/tree`, `filters/core`) carry no `"use client"`, so servers can import them.

## Audit

- **Primitives, first wave:** Cascader, Filters, Editable, Pagination.
- **Primitives, second wave:** Step indicator, Carousel (one frame clock for both), Date input.
- **Later:** Sidebar provider, Breadcrumb overflow.
- **Stay in `packages/ui`:** Base UI wrappers (Drawer, Dialog, Toast, Select, Combobox, Autocomplete, OTP field, Number field, Slider, Switch, menus, Tooltip, Popover), Form, StatefulButton, PasswordInput, Skeleton, App shell, Lightbox, Code block, Diff view, File tree, Charts, Data table (TanStack Table is its headless layer).

## Registry and CLI

- [x] **Pin the range in registry items.** `build-registry.mjs` writes `@erbium-ui/react@^<version>` from `packages/react/package.json`; `workspace:*` never reaches `registry.json`.
- [x] **CLI installs it.** `packagePlan` in `packages/cli/src/operations.ts` already installs missing `name@range` specs and rejects conflicting ranges.
- [ ] **CLI upgrades it.** `erbium update` reports a declared range that no longer satisfies the registry's and does not install it. Make `update` install the requested range, with `--skip-install` keeping the report.
- [ ] **Publish before deploy.** Check in the docs build that every pinned `@erbium-ui/*` version exists on npm before the registry deploys.

## Publishing

- [x] `packages/react` builds with `vp pack`, passes `bun run react:publish:dry`, and has `react:publish` for the owner.
- [ ] First publish by the owner, then a GitHub Actions trusted publisher on npmjs.com.
- [ ] Changesets with independent versions for `@erbium-app/cli` and `@erbium-ui/react`, and a release workflow with `npm publish --provenance`.

## Decisions

Settled 2026-11-18:

- **Tests.** `packages/react` has its own Vitest suite through `vp test`: pure modules, jsdom interaction tests and server render tests. The rest of the repository keeps its no-test-runner policy.
- **Next.js.** The build prepends `"use client"` to every client entry, so App Router server components can render the parts. This is the one exception to the client directive policy in `CLAUDE.md`.
- **Scope.** `@erbium-ui/react`; the `erbium-ui` npm organization exists.
- **Docs.** A separate "@erbium-ui/react" docs section with API pages and no showcases; Erbium UI component pages keep the examples.

## Order

1. Scaffold `packages/react` (build, tests, Next.js directive, publishing).
2. Cascader primitive; Erbium Cascader on it.
3. Filters primitive; Erbium filters on it.
4. Editable and Pagination primitives; Erbium components on them.
5. Docs section for the package.
6. Second wave: step indicator, carousel, date input.
