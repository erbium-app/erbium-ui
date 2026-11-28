# 12 — Keyboard shortcuts

Reviewed 2026-11-28.

The repository installs `@tanstack/react-hotkeys` `^0.29.0`, which matches the local TanStack Hotkeys checkout at `/Volumes/AlirezaDev/Codes/Packages/hotkeys`. Load `vp exec intent load @tanstack/react-hotkeys#react-hotkeys` and `@tanstack/hotkeys#app-hotkeys` before working on this file.

## Remaining work

### Shortcut cheat sheet block

Build a dialog that lists shortcuts from `useHotkeyRegistrations` (mounted shortcuts) or `useAppHotkeyList` (declared app hotkeys), grouped by `meta.group`, with status (`active`, `suspended`, `disabled`). Open it with `Mod+/` and register the same key inside the dialog to close it, since the dialog's scope pauses the page registration. Render keys with `Kbd` and `useFormatForDisplay()(..., { parts: true })` for one keycap per key.

- Decide where `meta.group` comes from for `Button` `hotkey` (today only `meta.name` is set from `aria-label` or `title`). A `hotkeyMeta` prop or a group context are candidates.
- `?` as an opener is a character key shortcut. The app's `suspendCharacterKeys` setting turns it off (WCAG 2.1.4), so show it as `suspended` then.

### Shortcut recorder field and settings block

A form field built on `useHotkeyRecorder`, with `validateHotkey` and the conflict checks from `conflicts.ts` reported through `field.FieldError` (follow the `FormField` shake rules in `CLAUDE.md`). A settings block built on `defineAppHotkeys`, `customHotkeys` and `onCustomHotkeysChange`, with reset per shortcut and a single-key shortcuts switch bound to `suspendCharacterKeys` (`useHotkeyScopesState().characterKeysSuspended` reports the current state).

- `validateHotkey` in 0.29.0 still accepts `Mod+PlusT` with no warning, so the field cannot rely on it alone to reject unknown key names.

### Sequence progress indicator

For sequences such as `G` then `H`, show what the user has pressed so far (`role="status"`) from `matchedStepCount` in `useHotkeyRegistrations`. Format the steps with `sequenceSeparator`. Decide whether this is a toast-like overlay or a status region the app places.

### Held-key state on keycaps

Use `useHeldKeys` to set `data-pressed` on `Kbd` keycaps while their keys are held, for the cheat sheet, the recorder and `KbdHint`. Keep it opt-in so static labels do not subscribe to key state.

### Menu and command item shortcuts

`DropdownMenuShortcut`, `ContextMenuShortcut`, `MenubarShortcut` and `CommandShortcut` only label a binding. Decide whether menu items take a `hotkey` that fires while the menu is open (Base UI stops the keys it handles, so test arrow keys, typeahead and `Escape`), and whether a page-level shortcut for the same action should be labelled from the item.

### Caps Lock warning in Password Input

`useKeyLockState("CapsLock")` returns `true`, `false`, or `null` until a key press, click, or mouse move reports it. Agree the shape before building. Proposed: an opt-in `PasswordInputCapsLock` part that shows while the input is focused and Caps Lock is on, announced with `role="status"`. It adds `@tanstack/react-hotkeys` to the `password-input` registry item.

### Devtools

Add `@tanstack/react-hotkeys-devtools` (`hotkeysDevtoolsPlugin()` in `@tanstack/react-devtools`) to Storybook and the docs dev build, not production.

## Element hotkeys inside overlays

`useHotkey` and `useHotkeys` with an element `target` listen on the document, after React's handlers. Base UI's dialog popup stops arrow keys, Home and End before they get there, so such a hotkey does nothing inside a `Dialog` or `Sheet` (checked in jsdom on 0.29.0). Carousel therefore keeps its own listener and matches keys with `matchesKeyboardEvent`. Test any new element hotkey on those keys inside an overlay.

## Verification gaps

- The page-shortcut pause behind an open Dialog was verified through the mobile sidebar sheet only. Check a Dialog, AlertDialog, Drawer and CommandDialog with a page `Button hotkey` behind them, including nested dialogs.
- `KbdHint` covers whatever sits directly above its control while the modifier is held. Check dense layouts (sidebar menus, toolbars, button groups) and decide whether any of them should default to `side="bottom"` or `side="inline-end"`.
- Light theme and Windows/Linux labels (`Ctrl+S`) were not checked in a browser.
