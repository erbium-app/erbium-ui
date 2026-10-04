# 03 — Blocks and stories

Reviewed 2026-10-04.

## Implemented foundation

`packages/showcase/src` contains examples and composition stories. Its manifest, Storybook adapters, and registry are generated. `packages/showcase/scripts/build-registry.mjs` already emits installable examples and story items, including `registry:block` compositions. The registry infrastructure is not pending work.

## Remaining work

- [ ] Review existing catalogs before adding or porting examples; add only compositions that demonstrate a recurring need.
- [ ] Expand card, dialog, form, and selection stories where layout or behavior decisions need explanation.
- [ ] Cover useful loading, empty, error, disabled, success, long-content, keyboard, and RTL cases in the relevant stories.
- [ ] Add agent session, file tree, and diff compositions after their package/API boundaries are agreed.
- [ ] Document source inspiration and intentional differences when adapting Coss, OpenCode, or Pierre examples.

Keep workflows and network state in applications or dedicated packages. Stories should explain composition rather than turn every example into a new primitive. Remove redundant variants instead of seeking complete parity with another registry.

## Synchronization

After showcase source or shared content changes, run `bun run showcase:generate` and `bun run showcase:registry`. Use `bun run showcase:check` to verify generated adapters, registries, checks, and builds. Never hand-edit generated adapters or registry output.
