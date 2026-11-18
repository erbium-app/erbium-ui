# 18 — Closed APIs

Reviewed 2026-11-18. Most components pass through Base UI's full option set (placement, orientation, sides) and add wide `variant` and `size` sets, while real code uses one or two values of each. Every unused option is a decision a developer or an agent has to make and can get wrong. The drawer is the model: it dropped `swipeDirection` and is always a bottom sheet (`packages/ui/src/components/drawer.tsx`).

Usage counts come from a source audit of `packages/ui/src`, `packages/showcase/src`, `apps/docs/src` and `apps/website/src`. Counts are approximate (multi-line JSX, dynamic values). A value used only by a demo that exists to show that value is not counted as a need.

## Rules

- A prop or variant value stays only when product code, a block or another primitive uses it.
- Close an option by removing it from the type (`Omit<…Props, "…">`) and hardcoding the value, not by ignoring it at runtime.
- Name sides logically (`start`, `end`, `inline-end`), never `left` or `right`, so RTL needs no flips.
- When an option is removed, delete the demos, docs pages, stories and registry items that only showed it, and regenerate the registries.
- Every item below is a breaking change for registry installs. Batch them into one breaking release with a migration note per component rather than shipping them one at a time.

## Priority 1

- [ ] **Popup placement.** Popover, Tooltip, HoverCard, DropdownMenu, ContextMenu, Select, Combobox, Autocomplete, Menubar and NavigationMenu expose `side`, `align`, `sideOffset` and `alignOffset`.
  - Evidence: `sideOffset` is passed only by the tooltip playground. `alignOffset` appears once, in `combobox-input-group.tsx`. `side` has one real use, the collapsed sidebar's rail tooltip (`sidebar.tsx`, `side="right"`). `align` is `start` or `end` in real code (data table, filters, breadcrumb); `center` appears only in `popover-alignments.tsx`.
  - Close: remove `side`, `sideOffset` and `alignOffset`; hardcode each component's placement; type `align` as `"start" | "end"`. Give the rail tooltip a logical `inline-end` placement. Keep Combobox's `anchor` internal.
- [ ] **Button variants.** 14 values in `lib/button-variants.ts`.
  - Evidence: real code uses default, secondary, outline, ghost, error and link. info, success, warning and ghost-{error,info,success,warning} appear only in `spinner-button.tsx` and `toast-types.tsx`. `embedded` overlaps `ghost`.
  - Close: default, secondary, outline, ghost, error, link. Fold `embedded` into `ghost` or into `InputGroupButton`.
- [ ] **Button sizes.** 8 values that mix two axes: size and icon-only (`icon`, `icon-xs`, `icon-sm`, `icon-lg`).
  - Evidence: `lg` and `icon-lg` appear only in demos; `sm` is used about 60 times.
  - Close: `size: "xs" | "sm" | "default"`, with icon-only detected from children or set by one boolean. Update `spinnerSizes` (`button.tsx`), `PaginationSize` and `InputGroupButton` sizes to match.
- [ ] **One control size scale.** Toggle and NumberField use sm/default/lg, Select, Cascader and Switch use sm/default, Autocomplete uses sm/default/lg or a number, and Input and Textarea have none.
  - Evidence: real non-Button use is `sm` on Select (data table, calendar, item settings) and on Toggle (diff view). Toggle `lg`, NumberField sizes and Switch sizes appear only in `*-sizes` demos.
  - Close: a shared `ControlSize = "sm" | "default"` for Button, Toggle, Select, Cascader, NumberField and Autocomplete. Remove `size` from Switch. Remove Autocomplete's numeric `size`.

## Priority 2

- [ ] **Badge variants.** 21 values in `badge.tsx`.
  - Evidence: real code uses secondary and outline, plus status colours (filters priority map). The 9 `tag-*`, the 4 `ghost-*`, `ghost` and `link` appear only in the badge grid and `spinner-badge.tsx`. `link` duplicates `render={<a>}`.
  - Close: default, secondary, outline, info, success, warning, error. If coloured tags are needed, add a separate `Tag` with `color`.
- [ ] **Field orientation.** `field.tsx` and the bound fields in `form.tsx` take `orientation` (vertical, horizontal, responsive).
  - Evidence: about 40 call sites pass `orientation="horizontal"` only because the field holds a checkbox, radio or switch. The `choice-row` variant already detects `[data-choice]`. `responsive` appears in 2 demos.
  - Close: a field with a choice control lays itself out horizontally. Keep `responsive` only if a real layout needs it. Remove FieldLegend's `variant` (`label` appears only in demos).
- [ ] **Overlay overlap.**
  - Sheet `side`: `top` and `bottom` duplicate the bottom-sheet Drawer; the only real caller is the mobile sidebar (left or right). Close to logical `start | end`, which also removes the `rtl:` translate flips, or make Sheet internal to Sidebar. Decide together with [08](./08-responsive-overlays.md).
  - HoverCard: no callers outside its showcase, and it cannot be opened by touch or keyboard. Delete it, or make it a Popover option (`openOnHover`).
  - Dialog and Sheet `modal`: never set. Omit it and hardcode `true`.
  - Close buttons: `DialogFooter showCloseButton` and `CommandDialog showCloseButton` have no callers; `showCloseButton={false}` on panels appears only in demos. Dialog and Sheet always show the close button; Drawer never does.
- [ ] **Sidebar.** See [10](./10-opinionated-sidebars.md).
  - Evidence: `side` and `variant` are set only by the playground. `AppShellSidebar` hardcodes `inset` and `offcanvas` but still passes `side` through. `SidebarMenuButton` `size` and `variant` are never passed. `showOnHover` has no callers. `collapsible="icon"` appears only in the playground but drives most of the `group-data-[collapsible=icon]` CSS.
  - Close: start side only; remove MenuButton `size` and `variant` and `showOnHover`; decide whether the icon rail is a product need before keeping it.
- [ ] **Button-styled links.** Three ways today: `Button` with `to`/`href`, `buttonVariants()` on a raw Link (`link-demo.tsx`, `apps/docs/src/components/shell.tsx`, `doc-page.tsx`, `blocks/filters.tsx`), and `render={<a>}` on Badge.
  - Close: keep `buttonVariants` internal to `packages/ui`; `Button to/href` is the one way. The docs pagination cards need a replacement for their `buttonVariants` use.

## Priority 3

- [ ] **ScrollArea.** Remove `scrollbarVisibility` (no callers) and `scrollbar="default"` (unused); replace `scrollbar` with `hideScrollbar`. Delete the thumb `size` variant, whose values are empty strings. Consider removing `contentClassName` and `scrollbarClassName` (no callers).
- [ ] **ToggleGroup.** Replace `spacing: number` (only 2 or 0 are used) with `attached`. Horizontal only. `variant` and `size` on the group, not on each item. Decide whether an attached ToggleGroup replaces ButtonGroup's segmented use.
- [ ] **Orientation props.** ButtonGroup, ToggleGroup and Slider `vertical` appear only in demos. Hardcode horizontal.
- [ ] **Spinner sizes.** `lg` and `xl` (raw `size-5`/`size-6`) appear only in `spinner-size.tsx`. Size the spinner from its parent control; keep sm/default for standalone use.
- [ ] **Combobox and Autocomplete.** `showTrigger` defaults to true in Combobox and false in Autocomplete; align the defaults. Remove Autocomplete's `triggerProps` and `clearProps`. Autocomplete has no callers outside its demos; consider folding it into Combobox.
- [ ] **AlertDialog.** Pick one layout instead of `size` (both sizes share `max-w-xs`). Remove `variant` and `size` from `AlertDialogCancel`; its one use repeats the default.
- [ ] **Small props.** Hardcode Kbd `useSymbols`. Drop Avatar `sm` (only `avatar-size.tsx`). Stop `StatefulButton` re-exposing Button's full variant set. Omit `width` and `height` from `Icon` so icons size from the control tokens.
- [ ] **Card size.** `sm` is used in 7 showcase places, often cancelled by `gap-0 p-0`. Weak candidate: review those uses before removing it.

## Drawer follow-ups

- [ ] Decide whether `showSwipeHandle` stays. A bottom sheet on a touch screen may always want the handle.
- [ ] `DrawerPortal`, `DrawerOverlay` and `DrawerSwipeHandle` are exported as low-level escape hatches and have no callers outside `drawer.tsx`. Make them internal.
- [ ] Review `modal` on the drawer: `false` and `"trap-focus"` are used only by the non-modal demo.

## Enforcement

- [ ] Add a lint rule (anti-slop fork, see [13](./13-anti-slop-fork.md)) that rejects importing `buttonVariants` and other internal style helpers outside `packages/ui`.
- [ ] Document each intentional restriction in the component's docs page, so a missing Base UI prop reads as a decision, not a gap. This closes the audit item in [02](./02-base-ui-api.md).
- [ ] After each closure, check that `bun run check`'s error count does not rise and that `bun run showcase:check` passes, as described in [04](./04-validation.md).

## Not yet audited

- Menu `inset` and `variant` (`error` has about 13 uses and looks legitimate; `inset` needs a targeted count).
- Charts, Table and DataTable parts, Breadcrumb, Progress and Meter.
- Tabs, Accordion, Collapsible and Resizable look like thin passthroughs; Toast already omits `swipeDirection` and has no position prop.

## Order

1. Popup placement.
2. Button variants, Button sizes and the shared control size scale, as one change.
3. Badge, Field orientation, overlay overlap, Sidebar and button-styled links.
4. Priority 3 and the drawer follow-ups as the components are next touched.
