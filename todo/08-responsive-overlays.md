# 08 — Responsive overlays and drawer indent

Every surface that floats above the page should adapt to a phone by default, by opening as a drawer, without each component hand-rolling its own `sm:` classes. One context layer decides the presentation, and every overlay reads from it. Every drawer insets the page behind it, as Vaul does.

References:

- Revola: `/Volumes/AlirezaDev/Codes/Packages/revola` (`registry/revola/revola.tsx`, `hooks/use-media-query.tsx`)
- Vaul: `/Volumes/AlirezaDev/Codes/Packages/vaul/src` (`use-scale-background.ts`, `constants.ts`)
- Vaul Base: `/Volumes/AlirezaDev/Codes/ReactJs/vaul-base/packages/core/src`
- Base UI: `/Volumes/AlirezaDev/Codes/Packages/base-ui/packages/react/src/drawer` and `docs/src/app/(docs)/react/components/drawer`

## Requirements

1. Dialog, alert dialog, popover, menus, select, combobox, command, and the other overlays have a mobile equivalent that opens the drawer.
2. The switch follows the user's viewport by default, with no per-component media-query code.
3. A context layer owns the decision. Components do not each decide for themselves.
4. Every drawer insets the page behind it (scaled, rounded, backed by a dark layer), matching Vaul.
5. The result removes the current class of responsive bugs. It does not add a parallel abstraction.

## What the research found

### Erbium today

- `Drawer.Provider`, `Drawer.Indent`, and `Drawer.IndentBackground` are **not used anywhere** in the repo: not in `packages/ui`, the storybook preview, the website, or the docs. This is why the indent effect never works.
- `drawer.tsx` already stacks nested drawers (`--stack-scale`, `--nested-drawers`). Nothing scales the page behind the first drawer.
- Responsiveness is ad hoc. `dialog.tsx`, `alert-dialog.tsx`, `sheet.tsx`, `toast.tsx`, and `autocomplete.tsx` carry `sm:` classes. No overlay switches to a drawer.
- `hooks/use-media-query.ts` re-exports Base UI's `unstable-use-media-query`. Nothing in the overlay components consumes it.
- Provider setup is split: the storybook preview wraps only `CSPProvider` and `Toaster`. `todo/02` already lists "document provider composition for direction, CSP, tooltip, toast, and portals".

### Revola (the responsive-by-default pattern)

- A root context carries `direction`, `modal`, `dismissible`, `onlyDrawer`, `onlyDialog`, and `alert`. Every part reads it and swaps between the Dialog and Drawer primitive at the `640px` breakpoint.
- Weaknesses to avoid:
  - Every part calls its own `useMediaQuery`, so parts can disagree during a resize.
  - The hook returns `null` on first render and listens to `window` `resize` instead of the `matchMedia` change event. That gives an SSR flash and a wrong first paint.
  - Swapping the Root component type remounts the tree. Open state and form state are lost when the viewport crosses the breakpoint.
  - It duplicates overlay and content classes, hard-codes `z-[9999]`, and uses its own close button.
- Keep: the single context, `onlyDrawer` / `onlyDialog` escape hatches, and alert mode (non-dismissible, no close button).

### Vaul and Vaul Base

- Vaul scales the app behind the drawer imperatively. It finds `[data-vaul-drawer-wrapper]`, applies `scale((innerWidth - 26) / innerWidth)` plus a `translate3d` safe-area offset, sets `border-radius: 8px` and `overflow: hidden`, and paints `body` black so the gap reads as a backdrop. It restores everything on close.
- Vaul Base is a Base UI-flavoured port. Not read in depth yet; see task R3.

### Base UI (the declarative version of the same effect)

- Drawer extends Dialog with gestures, snap points, and indent. The docs say to use Dialog if you do not need those.
- Wrap the app in `Drawer.Provider`, and put `Drawer.IndentBackground` and `Drawer.Indent` at the top of the tree.
  - Any `Drawer.Root` inside the provider registers itself. `Drawer.Indent` gets `data-active` or `data-inactive`.
  - A shared visual-state store pushes `--drawer-swipe-progress` and `--drawer-height` onto the indent element while swiping, so the page follows the finger.
  - The indent CSS in the demo is `scale(0.98 + 0.02 * progress)`, `translateY`, and a top radius that eases back to 0, with the transition disabled while swiping.
- Base UI does **not** switch between Dialog, Popover, Menu, or Select and a drawer. Only `Select` adapts on touch (`alignItemWithTrigger` is disabled). The responsive layer is ours to build.
- `unstable-use-media-query` supports `defaultMatches` and `noSsr`, so it can replace Revola's `null` first render.
- `Drawer.createHandle()` allows detached triggers. It is relevant to a shared presenter, but the handle is a distinct type from `DialogHandle`.
- `Drawer.Portal` accepts a `container`. This is how the demo keeps the indent inside a scoped root.

## Proposed direction (to verify)

- Add one provider, `OverlayProvider`, mounted once at the app root. It renders `Drawer.Provider` and tracks the open drawer's direction so the indent has a source of truth. The mobile decision is a separate hook, `useIsMobile`, not provider state.
- Add a small `AppShell` (or `DrawerIndent` wrapper) that renders `Drawer.IndentBackground` + `Drawer.Indent`, styled with Erbium tokens and eased gradients where it fades.
- Each responsive component reads the provider and chooses the presentation at the **Root**, then shares it through its own existing context. Parts do not re-query.
- Prefer rendering a drawer-styled `Dialog.Popup` / `Drawer.Popup` under a stable Root so crossing the breakpoint does not remount open content.

## Tablets and large touch screens

Size and pointer type answer different questions, so they are kept apart:

- **Size decides presentation.** `useIsMobile()` (width only) picks drawer or anchored overlay. Anchoring needs room, and a full-width bottom sheet on a 1024px screen is awkward and far from the user's hands. iPad portrait (744–834px) and larger get dialogs, popovers, and menus.
- **Pointer decides affordances, never presentation.** Coarse pointers get larger targets (`any-pointer-coarse:`), 16px text to avoid the iOS zoom, hover-card disabled on touch at any size, and long-press context menus. Hybrid devices change pointer type mid-session, which is why it cannot pick the layout.
- **Landscape phones are a gap.** About 844×390 is 768px or wider, so it gets desktop dialogs on a 390px-tall screen. A possible fix is adding `(pointer: coarse) and (height < 30rem)` to the mobile query. Open: see D0.

## Drawer contract

The opinions the drawer and every responsive overlay bake in. Items marked **agreed** were confirmed; items marked **to confirm** are proposals.

**Policy**

1. **Agreed:** a drawer is the mobile presentation. Responsive wrappers never choose it on desktop or tablet. The raw `Drawer` stays available as an explicit primitive (snap-point and side-panel products).
2. **Agreed:** responsive presenters are always modal on mobile and expose no `modal` prop. The raw `Drawer` defaults to `modal`. The non-modal case is an explicit raw-drawer product pattern (a persistent snap-point sheet over a map or list). Do not use `trap-focus`.
3. **To confirm:** `DrawerIndent` applies only to modal drawers on mobile. Base UI registers every open drawer, modal or not, so this needs a small wrapper. Tablets and desktop never scale the page, and reduced motion turns the inset off.
4. Responsive overlays always open as `down`. Side drawers are raw only.
5. The raw drawer stays physical, like Base UI. Wrappers such as the sidebar resolve start and end through the direction provider.

**Affordances and accessibility**

6. Bottom drawers show the swipe handle by default. Side drawers do not.
7. Responsive presenters always render a close button. Swipe is not discoverable and fails WCAG's single-pointer rule alone. Only a raw `Drawer` may omit it. **To confirm** whether this also applies to alert dialogs, which have explicit buttons.
8. On coarse pointers, do not auto-focus the first input, because the keyboard would cover the content. Focus the popup instead. **To confirm.**
9. Alert dialogs are not dismissible by swipe or outside press. Base UI has no prop for swipe-dismiss (`disablePointerDismissal` only covers outside presses), so this needs `data-base-ui-swipe-ignore` or a wrapper. Verify before promising it.
10. A title is required, with a visually hidden fallback so screen readers always get one.

**Layout**

11. Bottom drawers are full-width on mobile and capped at about 32rem and centred from `sm` up, so a directly used drawer on a tablet is not edge-to-edge.
12. Maximum height stays `100dvh - 6rem` so the page peeks through for the indent. One scroll region (`DrawerContent`) with a pinned header and footer.
13. Add left and right safe-area padding for side drawers in landscape, alongside the existing top and bottom padding.
14. Snap points are opt-in on the raw drawer only. Responsive wrappers do not use them.

**Stacking and system**

15. Nested drawers stack (Base UI supports it). **To confirm** whether to cap the visual peek at two levels.
16. Toasts render above drawers. Both are `z-50` today, so verify.
17. Keyboard-aware focus for bottom drawers stays always on (done).

## Tasks

### Research (verify before building)

- [ ] **R1 — Why the indent does not work today.** Confirm the cause is the missing `Drawer.Provider` and `Drawer.Indent`. Check whether anything else in `drawer.tsx` or the `surface-modal` styles fights it (`fixed` portal, `isolate`, root background, `body` background).
- [ ] **R2 — Reproduce the current responsive bugs.** List each overlay at a 390px viewport and record what breaks (clipping, keyboard overlap, scroll lock, `100dvh`, safe-area, RTL). This gives a baseline to fix against. The ad hoc `sm:` classes are suspected, but not yet confirmed as the cause.
- [ ] **R3 — Read `vaul-base/packages/core` end to end.** Record what it adds over Base UI's own Drawer (scale background, snap points, direction handling) and whether any of it is still needed now that Base UI ships `Drawer.Indent`.
- [ ] **R4 — Remount behaviour.** Prototype the Dialog-to-Drawer swap and check what happens to open state, focus, and form values when the viewport crosses the breakpoint. Decide between swapping the Root and keeping one Root with a different Popup.
- [ ] **R5 — Classify every overlay** (decision table below). Confirm each row with the owner before building.
- [x] **R6 — Breakpoint and detection.** Decided: Base UI treats mobile as a media query, not a platform flag. The decision uses `@base-ui/react/unstable-use-media-query` with `(width < 48rem)`, the shadcn mobile breakpoint and the complement of Tailwind `md:`, which the sidebar CSS already uses. The hook takes Base UI's media query options (`noSsr`, `defaultMatches`). A pointer-based query is deferred because Storybook viewport resizing does not change the pointer type.
- [x] **R7 — `@base-ui/utils` in the UI layer.** Decided: do not depend on it. It is an internal 0.x package for Base UI, and its `platform` module is static OS and engine detection, which Erbium has no use for (`kbd` uses TanStack hotkeys, clipboard is feature-detected). It would add a dependency to every registry install. `hooks/use-media-query.ts` stays the one place that imports Base UI's unstable hook. Revisit only when a concrete engine or OS workaround is needed: add `@base-ui/utils` as an explicit pinned dependency in that component, and prefer CSS `@supports` for CSS-side checks.

### Foundation

- [x] **F1 — Provider and mobile hook.** `useIsMobile()` is a standalone hook in `hooks/use-is-mobile.ts` (Base UI `useMediaQuery`, `(width < 48rem)`); it needs no provider and takes the hook options (`noSsr`, `defaultMatches`). `OverlayProvider` (`overlay-provider.tsx`) only coordinates drawers for `DrawerIndent` and renders Base UI's `Drawer.Provider`; drawers throw outside it. `sidebar.tsx` reads `useIsMobile()` instead of its own `(max-width: 767px)` query.
- [x] **F2 — Indent.** Wire `Drawer.Provider`, `Drawer.IndentBackground`, and `Drawer.Indent` into the shared shell. Style it from tokens (radius, scale, background layer). Verify swipe-progress tracking, nested drawers, and the `modal={false}` case (see D1).
- [x] **F3 — Mount the shell** in the storybook preview, the website, and the docs site, so every example shows the indent without per-story setup. Update `todo/02` provider composition notes. (Storybook and docs previews are mounted; `apps/website` has no `@erbium/ui` dependency yet; the `todo/02` note is still open.)
- [x] **F4 — Drawer parity.** Make `DrawerPanel` a clean presenter for non-drawer content: handle, safe-area padding, `dvh` sizing, keyboard-aware height (Base UI's `virtual-keyboard-provider`), and a close affordance for every dismissible state. (Done: `showCloseButton`, bottom safe-area padding without a footer, and keyboard-aware focus for bottom drawers, always on. A pinned footer input still needs the keyboard-inset lift from the Base UI demo.)
- [x] **F5 — Drawer RTL.** Base UI swipe directions are physical, so `left` and `right` drawers are positioned with `left-0` and `right-0` (and a physical bleed edge) instead of `inset-s` and `inset-e`. Horizontal flex rows reverse in RTL to keep the swipe handle on its physical side. Still to verify visually with `dir="rtl"`.

### Drawer contract (apply the items above)

- [ ] **D0 — Confirm the open items.** Landscape-phone query, close button on alert dialogs (7), no auto-focus on coarse pointers (8), nested peek cap (15), and the indent limited to modal mobile drawers (3).
- [ ] **D1 — Indent gating.** Limit `DrawerIndent` to modal drawers on mobile (3). Needs a wrapper because Base UI registers every open drawer.
- [ ] **D2 — Defaults.** Swipe handle on bottom drawers (6), width cap from `sm` up (11), landscape side safe areas (13).
- [ ] **D3 — Accessibility.** Required title with a hidden fallback (10), no auto-focus on coarse pointers (8), and the alert-dialog swipe lock (9, with O2).
- [ ] **D4 — Toast layering** (16): check and fix the z-order against drawers.

### Overlay adoption (one per task, after F1–F3 and the drawer contract)

- [ ] **O1 — Dialog, command.** Dialog and `CommandDialog` switch to a bottom drawer on mobile.
- [ ] **O2 — Alert dialog.** Keep it non-dismissible by gesture on mobile (alert mode). Decide whether it stays centred on mobile (R5).
- [ ] **O3 — Sheet.** Decide whether sheet is the desktop twin of drawer. If so, it collapses into the same presenter.
- [ ] **O4 — Popover, hover-card.** Popover becomes a drawer on mobile. Hover-card has no touch equivalent; decide between disabling it and falling back to a popover-style drawer.
- [ ] **O5 — Menus.** Dropdown menu, context menu, and menubar: a drawer-style action list on mobile. Context menu needs long-press, and menubar may be desktop-only.
- [ ] **O6 — Select, combobox, autocomplete.** Drawer listbox on mobile, with the search input handled against the on-screen keyboard. Coordinate with `todo/07-searchable-menus.md`.
- [ ] **O7 — Leave alone, and document why.** Tooltip, toast, and navigation-menu (see table).

### Validation

- [ ] **V1 — Tests.** Cover breakpoint crossing, SSR default, override props, nested drawers, and RTL (physical drawer edges). Run through `vp test run`.
- [ ] **V2 — Stories.** Add a responsive Foundations story with a viewport toggle. Check light and dark.
- [ ] **V3 — Registry.** Run `bun run ui:registry` and `bun run storybook:registry` before committing, then `bun run check`. Commit regenerated registry output with the UI change.

## Overlay inventory (proposed, to confirm in R5)

| Component                      | Mobile behaviour                     | Notes                                  |
| ------------------------------ | ------------------------------------ | -------------------------------------- |
| dialog, command (dialog)       | Bottom drawer                        | Core case                              |
| alert-dialog                   | Drawer, no swipe-dismiss, or centred | Open question                          |
| sheet                          | Same presenter as drawer             | Check overlap with drawer              |
| popover                        | Bottom drawer                        | Anchor is lost on mobile               |
| dropdown-menu                  | Drawer action list                   |                                        |
| context-menu                   | Drawer action list on long-press     | Gesture conflicts with swipe           |
| menubar                        | Likely desktop-only                  | Needs a call                           |
| select, combobox, autocomplete | Drawer listbox                       | Keyboard and search behaviour matter   |
| hover-card                     | Disable, or popover-style drawer     | No hover on touch                      |
| tooltip                        | Unchanged                            | Not an interactive surface             |
| toast                          | Unchanged                            | Already has mobile placement           |
| navigation-menu                | Unchanged, or mobile-nav drawer      | Base UI has a `mobile-nav` drawer demo |

## Open questions

- The provider is required: drawers and `DrawerIndent` throw outside `OverlayProvider`. A silent fallback would hide setup mistakes. Revisit only if isolated registry installs prove painful.
- Should consumers get the responsive wrappers as the default exports of `dialog`, `popover`, and so on, or as separate `responsive-*` names? `todo/00-naming-and-boundaries.md` should decide, since the registry keeps one canonical API per concept.

## Implementation rule

Follow `todo/02`: pass Base UI props through, use state attributes and logical CSS, keep `data-slot` names stable, and add no `"use client"` directives. Do not suppress diagnostics, and preserve RTL. Use `error`, not `destructive`, in any new variants.
