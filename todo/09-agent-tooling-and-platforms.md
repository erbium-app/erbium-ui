# 09 — Agent tooling and platforms

Reviewed 2026-10-11. Public direction: [Roadmap](../packages/content/roadmap.md).

## Planned

- [ ] Add OpenUI support and MCP-UI integration; define adapters, interaction contracts, and host expectations before implementation.
- [ ] Extend agent skills with integration and composition guidance instead of duplicating the existing installation skill.
- [ ] Build agent session/chat compositions informed by [OpenCode](https://opencode.ai/), following the prioritized source audit and ownership boundaries in [11](./11-files-and-session-ui.md).
- [ ] Evaluate additional Pierre capabilities (multi-file rendering, virtualization, workers, SSR, and unresolved files) against concrete session needs in [11](./11-files-and-session-ui.md). Audit licenses and accessibility before adopting additional packages; icons and other packages remain candidates.
- [ ] Release reusable Astro components with the React API/design contract where the platform allows it. Current Astro docs adapters are application code, not that library.
- [ ] Release React Native components with consistent APIs and design, documenting platform-specific behavior.

Paper/MCP mockups are tracked in [05](./05-paper-design-system.md). Keep integrations composable and avoid embedding app-specific session persistence or routing in UI primitives.
