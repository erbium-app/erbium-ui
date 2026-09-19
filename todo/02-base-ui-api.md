# 02 — Base UI conventions and API modernization

After naming decisions and while implementing missing primitives, audit existing components against the current Base UI APIs. The goal is to use Base UI for behavior, state management, focus handling, portals, and accessibility while keeping Erbium's shadcn-style public composition and class customization.

## Foundation work

- [ ] Inventory every direct primitive dependency and identify where Erbium still has hand-rolled behavior.
- [ ] Add or standardize shared Base UI conventions for:
  - [ ] `useRender` polymorphic rendering and the `render` prop;
  - [ ] `mergeProps` for event handlers, refs, class names, and prop precedence;
  - [ ] portal props and the `Portal`/`Positioner`/`Popup`/`Viewport` split;
  - [ ] `DirectionProvider` and logical RTL-safe styling;
  - [ ] `CSPProvider` and nonce/style handling.
- [ ] Decide whether these helpers are public package exports or internal implementation details.
- [ ] Add a consistent provider story for direction and portal behavior.
- [ ] Add a reusable segmented-control utility/composition with explicit semantics for tabs, links, radio choices, and toggles.

## Component implementation conventions

- [ ] Use Base UI state attributes as the styling contract where applicable:
  - `data-open`, `data-closed`, `data-highlighted`, `data-checked`, `data-disabled`;
  - `data-invalid`, `data-valid`, `data-complete`, `data-indeterminate`;
  - `data-starting-style`, `data-ending-style`, and `data-swipe-direction`.
- [ ] Keep `data-slot` names stable across wrappers and generated registry output.
- [ ] Pass Base UI props through unless Erbium intentionally provides a constrained convenience API.
- [ ] Document every Erbium-specific prop and every Base UI pass-through prop.
- [ ] Prefer logical CSS properties (`start`, `end`, `ms`, `me`) over physical left/right properties.
- [ ] Avoid custom focus management when Base UI already owns it.
- [ ] Test both controlled and uncontrolled modes for stateful primitives.
- [ ] Ensure all polymorphic components preserve refs and keyboard semantics.

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
- [ ] Keep the low-level Base UI composition available (`ToastProvider`, `ToastViewport`, `Toast`, `ToastAction`, `ToastClose`, etc.).
- [ ] Define a high-level notification API only if it improves common usage without exposing manager internals.
- [ ] Define notification types (`success`, `info`, `warning`, `error`, `loading`) as an Erbium convenience rather than a behavior dependency.
- [ ] Decide whether the default exported manager is appropriate for multiple app roots, tests, and SSR/hydration.
- [ ] Add tests for stacking, dismissal, keyboard access, reduced motion, RTL placement, and unmount cleanup.

## Current hand-rolled behavior audit

- [ ] Replace or reconcile the custom `Field` behavior with Base UI Field semantics.
- [ ] Add Base UI-backed `Autocomplete`, `CheckboxGroup`, `Meter`, `NumberField`, and `Toolbar`.
- [ ] Review custom `Combobox` composition for Base UI API parity, especially chips, filtering, empty states, and controlled values.
- [ ] Review `InputOTP` against Base UI `OTPField` before committing to the third-party implementation.
- [ ] Review `Alert`, `Spinner`, `Skeleton`, and `Progress` for consistent status semantics and reduced-motion behavior.
- [ ] Review custom layout components for consistent `render` and `mergeProps` support.
- [ ] Verify overlay wrappers expose the relevant Base UI positioning, portal, backdrop, arrow, and viewport props.

## API compatibility

- [ ] Preserve shadcn-compatible exports for repeated concepts.
- [ ] Prefer additive changes and aliases over breaking renames.
- [ ] Mark deprecated aliases in documentation before removing anything.
- [ ] Keep data-slot attributes stable where practical so blocks and consumers can style components reliably.
- [ ] Document which parts are Base UI pass-through props and which parts are Erbium-specific conveniences.
