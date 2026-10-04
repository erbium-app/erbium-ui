# 09 — Agent tooling and platforms

Reviewed 2026-10-04. Public direction: [Roadmap](../packages/content/roadmap.md).

## Available today

The docs expose page Markdown, llms indexes, JSON resources, and a basic installation/composition skill at `.well-known/agent-skills/erbium-ui/SKILL.md`. Components and installable stories already provide source and usage examples.

## Planned

- [ ] Add OpenUI support and MCP-UI integration; define adapters, interaction contracts, and host expectations before implementation.
- [ ] Extend agent skills with integration and composition guidance instead of duplicating the existing installation skill.
- [ ] Build agent session/chat compositions informed by [OpenCode](https://opencode.ai/).
- [ ] Evaluate [Pierre](https://pierre.computer/)'s Trees, Diffs, icons, and other reusable pieces for API fit, licensing, accessibility, and package boundaries.
- [ ] Release reusable Astro components with the React API/design contract where the platform allows it. Current Astro docs adapters are application code, not that library.
- [ ] Release React Native components with consistent APIs and design, documenting platform-specific behavior.

Paper/MCP mockups are tracked in [05](./05-paper-design-system.md). Keep integrations composable and avoid embedding app-specific session persistence or routing in UI primitives.
