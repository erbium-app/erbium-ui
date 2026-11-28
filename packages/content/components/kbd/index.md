---
title: "Kbd"
description: "Displays keyboard shortcuts for the current platform."
---

## Usage

Displays a platform-aware shortcut. Pass the stored binding to `hotkey`; TanStack Hotkeys formats it for macOS, Windows, or Linux. Physical bindings such as `[KeyW]` follow the user's keyboard layout in Chromium browsers, so the label reads `Z` on an AZERTY keyboard.

**Import:** `@erbium/ui/components/kbd`

```tsx
<Kbd hotkey="Mod+K" />
```

## Registering shortcuts

`Kbd` only renders a binding; it does not register one. For a button, pass the binding to the button itself: `hotkey` registers a shortcut that clicks the button while it is mounted, enabled, and not loading, and sets `aria-keyshortcuts`. A `ButtonShortcut` inside it labels the same binding, so the label and the shortcut cannot drift apart.

```tsx
<Button hotkey="Mod+S" onClick={save}>
  Save
  <ButtonShortcut />
</Button>
```

For any other action, register the behavior with `useHotkey` from `@tanstack/react-hotkeys` in the component that owns it, and display the same binding with `Kbd`. Components that ship shortcuts register them the same way: `SidebarProvider` toggles with `Mod+B`, and command palettes register `Mod+K` with `useHotkey`.

A shortcut repeats while its keys are held. Pass `requireReset: true` for one that toggles something, as `SidebarProvider` does, so it runs once per press.

A disabled button leaves its key to the browser, so a disabled `Mod+S` opens the browser's save dialog.

## Announcing shortcuts

`Button` and `SidebarTrigger` set `aria-keyshortcuts` themselves. On any other control that has a shortcut, set it with `useFormatForAria` from `@tanstack/react-hotkeys`. It resolves the platform and returns `undefined` while the shortcut cannot fire, so screen readers announce only working shortcuts.

```tsx
const formatForAria = useFormatForAria();

<Toggle aria-label="Bold" aria-keyshortcuts={formatForAria("Mod+B")} />;
```

## Single-key shortcuts

Shortcuts made of keys that type a character, alone or with `Shift`, such as `G`, `?`, or `["G", "H"]`, need a user setting that turns them off ([WCAG 2.1.4](https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html)). Bind the setting to `suspendCharacterKeys` on a provider at the root of the app:

```tsx
<HotkeysProvider suspendCharacterKeys={!settings.singleKeyShortcuts}>
  <App />
</HotkeysProvider>
```

While suspended, those shortcuts do not fire, their `KbdHint` stays hidden, and their buttons drop `aria-keyshortcuts`. Chords with `Control`, `Alt`, or `Meta`, keys such as `Escape`, and shortcuts targeted at one element keep working. A `Kbd` or `ButtonShortcut` label still shows, so hide it with the same setting.

## Shortcut hints

A control whose shortcut has no visible label can reveal it on demand. `KbdHint` renders the shortcut in a `Badge` above its container while the user holds a modifier of a shortcut that can fire right now. It stays hidden for shortcuts that nothing registers, shortcuts in a suspended scope (such as page shortcuts behind an open dialog), and shortcuts without a modifier. Pass `exact` to require every modifier.

`Button` renders the hint for its `hotkey` unless a `ButtonShortcut` already labels it, and `SidebarTrigger` renders the hint for `Mod+B`. For other controls, render `KbdHint` inside a `relative` container:

```tsx
<div className="relative">
  <Toggle aria-label="Bold" />
  <KbdHint hotkey="Mod+B" />
</div>
```

The badge is anchored with Base UI's positioner, the same one tooltips use, so it never covers its own control. It renders in a portal, so `overflow: hidden` ancestors such as button groups do not clip it, and it flips below the control at the top of the viewport. It is centred by default, so the badges of adjacent controls do not run into each other. `side` and `align` are logical and follow the reading direction: `align="end"` puts the badge over the top right corner in LTR and the top left corner in RTL. Leave room above a row of controls, or pass `side="bottom"` when the space above is taken, because the badge covers whatever sits there while the modifier is held.

## Server rendering

Labels use the platform of the nearest `HotkeysProvider` from `@tanstack/react-hotkeys`, or the browser's platform after hydration. Without a provider, server-rendered HTML shows Windows and Linux labels, and macOS users see them switch to `⌘` when the page hydrates. Server-rendered apps can avoid that by passing `detectPlatform(userAgent)` from the request's `User-Agent` header to `<HotkeysProvider defaultOptions={{ platform }}>`. Prerendered pages have no request, so they keep the switch.
