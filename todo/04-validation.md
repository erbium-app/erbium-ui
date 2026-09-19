# 04 — Validation and release gates

Use the repository's existing checks throughout the work.

## Per-component checks

- [ ] Add or update focused Vitest tests.
- [ ] Add Storybook coverage for interactive states.
- [ ] Verify keyboard navigation and focus restoration.
- [ ] Verify screen-reader labeling and live-region behavior where relevant.
- [ ] Verify RTL layout and directional keyboard behavior.
- [ ] Verify controlled/uncontrolled parity.
- [ ] Verify generated registry output and dependency metadata.
- [ ] Verify the component has a stable public name and does not duplicate another primitive.
- [ ] Verify Base UI pass-through props are typed and functional.
- [ ] Verify `render`/polymorphic composition and ref forwarding where supported.
- [ ] Verify state attributes and `data-slot` attributes remain stable.
- [ ] Verify portal, positioner, popup, viewport, and backdrop behavior for overlays.
- [ ] Verify controlled/uncontrolled parity and state reset behavior.
- [ ] Verify reduced-motion behavior for transitions and loading indicators.

## Repository checks

- [ ] Run `bun run fix` after mechanical edits.
- [ ] Run `bun run check` and fix actionable failures.
- [ ] Run `bun run ready` before considering the registry parity work release-ready.
- [ ] Run `bun run knip` only when unused files or dependencies are in scope.

## Parity review

- [ ] Compare the final primitive list with the active Coss registry.
- [ ] Compare all Coss particle families with Erbium block families.
- [ ] Verify that repeated concepts retain shadcn-compatible names.
- [ ] Verify that Base UI-backed components use current APIs rather than compatibility behavior.
- [ ] Record intentional differences in the package documentation.

## Provider and infrastructure checks

- [ ] Test direction inheritance and RTL keyboard/layout behavior.
- [ ] Test CSP provider behavior with a nonce-restricted setup.
- [ ] Test toast and overlay portals across nested providers and multiple app roots.
- [ ] Test SSR/hydration-safe rendering for components with portals, IDs, or managers.
- [ ] Test generic hooks independently from feature-specific consumers.

## Paper design-system checks

- [ ] Verify every public registry item has a Paper mapping or documented intentional omission.
- [ ] Verify every Paper mapping points to an existing source file, registry item, and Storybook story.
- [ ] Verify Paper pages use the current semantic token names from the codebase.
- [ ] Verify component anatomy and slot names match the public Erbium composition.
- [ ] Verify default, interactive, disabled, invalid, loading, and empty states where relevant.
- [ ] Verify dark mode, RTL, responsive, long-content, and reduced-motion coverage where relevant.
- [ ] Verify responsive compositions preserve the intended interaction semantics.
- [ ] Review Storybook output and Paper frames together for visual drift.

## Completeness sign-off

- [ ] Every Base UI public component that is in Erbium scope has a wrapper, alias, or documented intentional omission.
- [ ] Every Coss primitive in scope has an Erbium equivalent or a recorded reason for exclusion.
- [ ] Every repeated shadcn concept retains a familiar public name or has a documented compatibility alias.
- [ ] The registry, Storybook, docs, tests, and package exports agree on the same public component list.
- [ ] The package boundary review has moved feature-heavy components out of the foundation where appropriate.
- [ ] The Paper design-system file, component manifest, Storybook stories, registry, and source implementation agree.
