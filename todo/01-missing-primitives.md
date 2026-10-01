# 01 — Missing primitives

Add a primitive when it supplies distinct behavior or composition. Use Base UI for behavior, shadcn UI for familiar composition and names, and Coss UI for concepts that add a real capability. An added primitive needs a registry item, a Storybook example, and focused accessibility and interaction coverage.

## Build

- [ ] `meter`: wrap Base UI Meter for measured values with accessible labels and range semantics. Keep it distinct from task progress.

## Decide from actual use

- [ ] `menu`: expose a generic Base UI Menu composition only if it reduces duplication or enables a use case the existing `dropdown-menu`, `context-menu`, and `menubar` APIs cannot express. Preserve those public names.
- [ ] `frame`: add a Coss-style content surface only when blocks need a reusable API beyond `Card` and existing surface styles.
- [ ] `group`: add connected controls only when `ButtonGroup`, `InputGroup`, and `Toolbar` cannot express the intended behavior or layout. Define RTL edge behavior before implementation.

API modernization for existing components belongs in [Base UI conventions](./02-base-ui-api.md). Per-component verification belongs in [Validation](./04-validation.md).
