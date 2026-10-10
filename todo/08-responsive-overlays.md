# 08 — Responsive overlays

Reviewed 2026-10-04.

## Remaining work

- [ ] Record actual failures at phone and tablet sizes: clipping, scroll lock, keyboard overlap, safe areas, focus, and RTL.
- [ ] Specify the viewport/pointer policy, SSR default, and explicit presentation overrides before adding responsive behavior.
- [ ] Prototype breakpoint changes without losing open state, form values, or focus. Decide whether root swapping is acceptable.
- [ ] Verify which modal drawers should indent the page, including nested drawers and desktop use.
- [ ] Review handle, dismissal, title, coarse-pointer autofocus, landscape safe areas, width caps, and toast layering against current Drawer behavior.
- [ ] Adopt responsive presentation per overlay only after its interaction semantics are proven.

## Candidate presentation

- Dialog and Command: bottom drawer on phones.
- Alert Dialog: preserve deliberate confirmation and prohibit accidental gesture dismissal.
- Sheet: decide its relationship to Drawer before merging APIs.
- Popover and value pickers: consider drawer presentations with keyboard-safe search.
- Menus: preserve action/checkbox/radio semantics; coordinate with [07](./07-searchable-menus.md).
- Hover Card: define a touch alternative.
- Tooltip, Toast, and Navigation Menu: retain their semantics rather than forcing drawer presentation.

These are design candidates, not universal defaults already shipped. Verify long content, nesting, RTL, reduced motion, focus restoration, and SSR manually in Storybook/docs. Run `bun run check`; use `bun run ready` for release readiness. Regenerate UI and showcase registries for affected source changes as described in [04](./04-validation.md).
