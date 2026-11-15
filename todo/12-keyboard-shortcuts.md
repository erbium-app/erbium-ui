# 12 — Keyboard shortcuts

## Current status (2026-11-16)

Erbium uses TanStack Hotkeys through `@tanstack/react-hotkeys` only; `packages/ui` no longer depends on `@tanstack/hotkeys` directly. Delivered:

- `Kbd` formats labels with `useFormatForDisplay` (provider platform, keyboard layout for physical keys).
- Modal Dialog, Sheet, AlertDialog, Drawer and CommandDialog popups render an exclusive scope (`packages/ui/src/lib/modal-hotkeys-scope.tsx`), so page shortcuts pause while they are open. The mobile sidebar sheet registers `Mod+B` inside its scope to close itself.
- `Button` `hotkey` registers a shortcut that clicks it and sets `aria-keyshortcuts`; `ButtonShortcut` without `hotkey` labels the button's binding.
- `KbdHint` shows a shortcut in a `Badge` while a modifier is held, anchored with Base UI's tooltip positioner (centred above by default, logical `side`/`align`). `Button` and `SidebarTrigger` render it.

Reference: the local TanStack Hotkeys checkout is at `/Volumes/AlirezaDev/Codes/Packages/hotkeys` (react-hotkeys 0.25.1, core 0.30.0). Load `bunx --no-install --package @tanstack/intent intent load @tanstack/react-hotkeys#react-hotkeys` and `@tanstack/hotkeys#app-hotkeys` before working on this file.

## Remaining work

### Shortcut cheat sheet block

Build a dialog that lists shortcuts from `useHotkeyRegistrations` (mounted shortcuts) or `useAppHotkeyList` (declared app hotkeys), grouped by `meta.group`, with status (`active`, `suspended`, `disabled`). Open it with `Mod+/` and register the same key inside the dialog to close it, since the dialog's scope pauses the page registration. Render keys with `Kbd` and `formatForDisplay(..., { parts: true })` for one keycap per key.

- Decide where `meta.group` comes from for `Button` `hotkey` (today only `meta.name` is set from `aria-label` or `title`). A `hotkeyMeta` prop or a group context are candidates.
- `?` as an opener is a single-key shortcut and needs an off switch (WCAG 2.1.4).

### Shortcut recorder field and settings block

A form field built on `useHotkeyRecorder`, with `validateHotkey` and the conflict checks from `conflicts.ts` reported through `field.FieldError` (follow the `FormField` shake rules in `CLAUDE.md`). A settings block built on `defineAppHotkeys`, `customHotkeys` and `onCustomHotkeysChange`, with reset per shortcut and an off switch for single-key and letter-sequence shortcuts.

- `validateHotkey` accepted `Mod+PlusT` as valid, so the field cannot rely on it alone to reject unknown key names. Check the installed release before relying on it.

### Sequence progress indicator

For sequences such as `G` then `H`, show what the user has pressed so far (`role="status"`) from `matchedStepCount` in `useHotkeyRegistrations`. Format the steps with `sequenceSeparator`. Decide whether this is a toast-like overlay or a status region the app places.

### Held-key state on keycaps

Use `useHeldKeys` to set `data-pressed` on `Kbd` keycaps while their keys are held, for the cheat sheet, the recorder and `KbdHint`. Keep it opt-in so static labels do not subscribe to key state.

### Menu and command item shortcuts

`DropdownMenuShortcut`, `ContextMenuShortcut`, `MenubarShortcut` and `CommandShortcut` only label a binding. Decide whether menu items take a `hotkey` that fires while the menu is open (Base UI stops the keys it handles, so test arrow keys, typeahead and `Escape`), and whether a page-level shortcut for the same action should be labelled from the item.

### Carousel keyboard handling

`packages/ui/src/components/carousel.tsx` uses a native `keydown` listener for arrows, Home and End, with its own RTL mapping and editable-target check. Moving it to `useHotkeys` with `target` would list it in devtools and registrations. Keep the consumer opt-out (`preventDefault` in `onKeyDown`) by setting `ignoreDefaultPrevented`.

### Devtools

Add `@tanstack/react-hotkeys-devtools` (`hotkeysDevtoolsPlugin()` in `@tanstack/react-devtools`) to Storybook and the docs dev build, not production.

### Server-rendered labels

The docs app is prerendered, so Mac users see `Ctrl` labels until hydration. Options: render shortcut labels client-only with a same-width fallback, or accept the switch. Server-rendered apps can pass `detectPlatform(userAgent)` to `HotkeysProvider` (documented in the Kbd page).

## Verification gaps

- The page-shortcut pause behind an open Dialog was verified through the mobile sidebar sheet only. Check a Dialog, AlertDialog, Drawer and CommandDialog with a page `Button hotkey` behind them, including nested dialogs.
- `KbdHint` covers whatever sits directly above its control while the modifier is held. Check dense layouts (sidebar menus, toolbars, button groups) and decide whether any of them should default to `side="bottom"` or `side="inline-end"`.
- Light theme and Windows/Linux labels (`Ctrl+S`) were not checked in a browser.
