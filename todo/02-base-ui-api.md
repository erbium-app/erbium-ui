# 02 — Base UI and API modernization

After naming decisions and while implementing missing primitives, audit existing components against the current Base UI APIs. The goal is to use Base UI for behavior, state management, focus handling, portals, and accessibility while keeping Erbium's shadcn-style public composition and class customization.

## Foundation work

- [ ] Inventory every direct primitive dependency and identify where Erbium still has hand-rolled behavior.
- [ ] Add or standardize shared Base UI helpers for render delegation, prop merging, portal props, direction, and CSP-sensitive rendering.
- [ ] Decide whether these helpers are public package exports or internal implementation details.
- [ ] Add a consistent provider story for direction and portal behavior.
- [ ] Add `use-media-query` and `use-copy-to-clipboard` only as generic hooks; keep feature-specific hooks elsewhere.
- [ ] Add a reusable segmented-control utility/composition with explicit semantics for tabs, links, radio choices, and toggles.

## Component audit

- [ ] Audit overlays: `dialog`, `alert-dialog`, `drawer`, `sheet`, `popover`, `tooltip`, `hover-card`, and menus.
- [ ] Audit selection: `select`, `combobox`, `autocomplete`, `radio-group`, `checkbox`, and `checkbox-group`.
- [ ] Audit forms: `field`, `fieldset`, `form`, `input`, `textarea`, `input-group`, `number-field`, and `otp-field`.
- [ ] Audit navigation and focus management: `tabs`, `accordion`, `collapsible`, `toolbar`, `sidebar`, and navigation components.
- [ ] Audit status and progress: `toast`, `alert`, `progress`, `meter`, `spinner`, and `skeleton`.

## Toast and notifications

- [ ] Compare the current toast implementation with the latest Base UI notification/toast APIs.
- [ ] Keep notifications on Base UI; do not add Sonner or another toast runtime unless a separate product requirement justifies it.
- [ ] Adopt Base UI's current provider, store/manager, lifecycle, dismissal, and viewport patterns where applicable.
- [ ] Preserve a simple shadcn-style composition and avoid exposing internal notification state unnecessarily.
- [ ] Support action buttons, close controls, pause-on-hover/focus behavior, duration, controlled dismissal, and accessible announcements.
- [ ] Define whether notifications and toasts share one API or whether notifications are a higher-level package built on the toast primitive.
- [ ] Add tests for stacking, dismissal, keyboard access, reduced motion, RTL placement, and unmount cleanup.

## API compatibility

- [ ] Preserve shadcn-compatible exports for repeated concepts.
- [ ] Prefer additive changes and aliases over breaking renames.
- [ ] Mark deprecated aliases in documentation before removing anything.
- [ ] Keep data-slot attributes stable where practical so blocks and consumers can style components reliably.
- [ ] Document which parts are Base UI pass-through props and which parts are Erbium-specific conveniences.
