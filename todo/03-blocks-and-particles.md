# 03 — Blocks and stories

Reviewed 2026-11-17.

## Remaining work

- [ ] Create TerminalCommand stories once its API is agreed; compose CodeBlock and CopyButton. Track the block in [01](./01-missing-primitives.md).
- [ ] Review existing catalogs before adding or porting examples; add only compositions that demonstrate a recurring need.
- [ ] Expand card, dialog, form, and selection stories where layout or behavior decisions need explanation.
- [ ] Cover useful loading, empty, error, disabled, success, long-content, keyboard, and RTL cases in the relevant stories.
- [ ] Add combined file review and agent session compositions following [11](./11-files-and-session-ui.md).
- [ ] Document source inspiration and intentional differences when adapting Coss, OpenCode, or Pierre examples.

Keep workflows and network state in applications or dedicated packages. Stories should explain composition rather than turn every example into a new primitive. Remove redundant variants instead of seeking complete parity with another registry.

## Synchronization

After showcase source or shared content changes, run `bun run showcase:generate` and `bun run showcase:registry`. Use `bun run showcase:check` to verify generated adapters, registries, checks, and builds. Never hand-edit generated adapters or registry output.
