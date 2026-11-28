---
title: "Shortcuts"
story: Shortcuts
---

Place `ButtonShortcut` after the label. Button owns its spacing in both LTR and RTL layouts; the binding determines the platform label.

`ButtonShortcut` only labels a binding. To also handle the key press, pass `hotkey` to `Button`: it clicks the button, announces the shortcut with `aria-keyshortcuts`, and reveals a hint while a modifier is held. A `ButtonShortcut` without its own `hotkey` then labels the button's shortcut. See the Kbd Hint example.
