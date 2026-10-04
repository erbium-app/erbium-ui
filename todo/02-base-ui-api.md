# 02 — Base UI APIs

Reviewed 2026-10-04.

## Implemented foundation

Field and Fieldset wrap Base UI. OTP Field uses Base UI rather than an external OTP package. Meter, Toast, Direction Provider, and CSP Provider are available. OverlayProvider coordinates drawers. Provider documentation lives in `packages/content/components`.

## Remaining work

- [ ] Review provider composition examples for direction, CSP nonces, tooltips, toasts, and overlays in a real app setup.
- [ ] Verify nonce behavior, portal placement, and hydration in representative SSR integrations.
- [ ] Audit specific missing portal, positioner, backdrop, arrow, and viewport props in overlay wrappers; document intentional restrictions.
- [ ] Review toast managers across multiple roots, including dismissal, keyboard access, RTL placement, and cleanup.
- [ ] Replace Command's `cmdk` behavior after confirming the available Base UI command/autocomplete contract; see [07](./07-searchable-menus.md).

Preserve Base UI state attributes, logical CSS, refs, and `render` composition where supported. Keep APIs focused without discarding behavior needed by real usages. Do not treat source presence as proof that all interaction and SSR checks have passed.
