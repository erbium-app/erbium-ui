# 05 — Paper design kit

Reviewed 2026-10-04. Paper remains planned: no `design/` mapping directory is present in the repository. Existing source, documentation, stories, and registries provide the foundation; a public synchronized canvas has not been established here.

## Boundaries

React/Base UI remains the authority for behavior and accessibility. `packages/ui/src` owns implementation and tokens; `packages/showcase/src` owns rendered examples. Paper represents visual intent, states, and page composition, not a second component implementation.

## Pilot

- [ ] Recheck Paper's current token, import, sharing, and MCP capabilities; the [research note](./05-paper-design-research.md) is a dated snapshot.
- [ ] Create foundations plus Button, Input, Checkbox, and Dialog specimens.
- [ ] Verify editable import, semantic tokens, fonts, icons, dark mode, RTL, long content, and meaningful states.
- [ ] Verify public viewing, copying into a user's project, and stable page/frame links.
- [ ] Create `design/README.md` and a mapping manifest connecting source files, registry items, stories, and Paper frames.
- [ ] Change a token and component style, then repeat synchronization without duplicates or lost annotations.

## Expand after the pilot

- [ ] Cover each public component or record an intentional omission.
- [ ] Add responsive layouts and useful block/page compositions.
- [ ] Publish the canvas and document the MCP mockup workflow.
- [ ] Establish drift detection and a reviewed source version before automating publication.

Reuse existing stories; add missing state coverage where needed. Keep source tokens authoritative and record limitations of Paper's rendering. Apply the Paper checks in [04](./04-validation.md) before declaring parity.
