# 02 — Base UI conventions and API modernization

Base UI owns interaction, state, focus, and accessibility where it has a suitable primitive. Erbium owns styling, `data-slot` names, and the public composition. Preserve established shadcn UI names; adopt Coss UI concepts only where they add distinct value.

## Remaining work

- [ ] Reconcile `Field` with Base UI Field for control association, validity, descriptions, errors, and generated IDs. Keep useful Erbium layout parts.
- [ ] Compare the current `input-otp` behavior with Base UI OTP Field and choose one behavior foundation without changing the established name unnecessarily.
- [ ] Add a CSP provider wrapper and document nonce handling where Base UI injects styles.
- [ ] Document the provider composition for direction, CSP, tooltip, toast, and portals. Add a combined provider only if it simplifies a real app setup.
- [ ] Audit the existing Base UI-backed overlay wrappers for missing portal, positioning, backdrop, arrow, and viewport props that users need. Fix specific gaps rather than adding a parallel abstraction.
- [ ] Review toast manager behavior across multiple roots and SSR, then add focused coverage for dismissal, keyboard access, RTL placement, and cleanup.

## Implementation rule

Pass through Base UI props unless an Erbium convenience has a documented reason to narrow them. Use Base UI state attributes and logical CSS for styling, preserve refs and keyboard behavior through `render` composition, and keep `data-slot` names stable. Verify those contracts in the component being changed rather than reopening a library-wide audit for each addition.
