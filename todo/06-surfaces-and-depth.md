# 06 — Surfaces and depth

Reviewed 2026-10-04. The surface migration is implemented across controls, panels, overlays, and many selection/data components. The old phase checklist is retired; source adoption does not imply that every visual state has been manually verified.

## Current design

- Shared tokens and lighting live in `packages/ui/src/styles/surfaces.css` and `theme.css`.
- Roles include panel, control, input, overlay, modal, flat, frame, and well. Controls are raised; wells are reserved for recessed tracks.
- Shared shadows and highlights provide edges and depth. Transparent borders preserve a forced-colors fallback.
- Semantic state tokens use `error`. Native squircle corners are guarded by `@supports`; ordinary rounded corners remain the fallback. Circles and pills stay round.
- Surface documentation and examples exist in `packages/content/components/surfaces` and `packages/showcase/src/surfaces`. The docs import shared styles rather than maintaining a second surface system.

## Remaining work

- [ ] Review each affected component's light/dark, focus, selected, invalid, disabled, and loading states against its intended role.
- [ ] Check clipping, nested surfaces, portal appearance, and shadow performance with realistic content.
- [ ] Manually verify forced colors, reduced motion, and control contrast; record specific failures rather than assuming all states pass.
- [ ] Keep docs adapters and live previews aligned with shared tokens.
- [ ] Add the surface ladder and corner fallback examples to the planned Paper kit.

Do not add a surface context or remove `shadow-plugin` solely because an old proposal suggested it. Require a current usage/dependency audit. Use the repository validation workflow in [04](./04-validation.md); no automated test runner is configured.
