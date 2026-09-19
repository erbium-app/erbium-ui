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
