---
title: "Kbd"
description: "Displays keyboard shortcuts for the current platform."
---

## Usage

Displays a platform-aware shortcut. Pass the stored binding to `hotkey`; TanStack Hotkeys formats it for macOS, Windows, or Linux.

**Import:** `@erbium/ui/components/kbd`

```tsx
<Kbd hotkey="Mod+K" />
```

## Registering shortcuts

`Kbd` only renders a binding; it does not register one. Register the behavior with `useHotkey` from `@tanstack/react-hotkeys` and display the same binding with `Kbd`, so the label and the shortcut never drift apart.

```tsx
import { useHotkey } from "@tanstack/react-hotkeys";
import { Kbd } from "@erbium/ui/components/kbd";

export function SaveButton() {
  useHotkey("Mod+S", () => save());
  return (
    <button type="button" onClick={save}>
      Save <Kbd hotkey="Mod+S" />
    </button>
  );
}
```

Components that ship shortcuts register them the same way: `SidebarProvider` toggles with `Mod+B`, and command palettes register `Mod+K` with `useHotkey`.
