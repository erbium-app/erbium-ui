# 06 — Surfaces and depth

Reviewed 2026-11-17.

## Remaining work

- [ ] Review each affected component's light/dark, focus, selected, invalid, disabled, and loading states against its intended role.
- [ ] Check clipping, nested surfaces, portal appearance, and shadow performance with realistic content.
- [ ] Manually verify forced colors, reduced motion, and control contrast; record specific failures rather than assuming all states pass.
- [ ] Keep docs adapters and live previews aligned with shared tokens.
- [ ] Add the surface ladder and corner fallback examples to the planned Paper kit.

Do not add a surface context or remove `shadow-plugin` solely because an old proposal suggested it. Require a current usage/dependency audit. Use the repository validation workflow in [04](./04-validation.md); no automated test runner is configured.
