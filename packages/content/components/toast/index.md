---
title: "Toast"
description: "Brief, supplementary notifications that are safe to miss."
---

## When to use

Use a toast for optional background or cross-surface news with no stable on-screen origin. Its result and any action must remain available after it disappears. An export completion notice backed by a downloadable result in Activity is one example.

For feedback tied to an action, keep cause and effect together:

| Situation                                         | Preferred feedback                                                                                               |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Copy or another brief button action               | Change the button’s icon, label, or state.                                                                       |
| Form submission                                   | Show pending state at submit and errors beside the relevant field or submit area. Keep the form open on failure. |
| Toggle or optimistic row change                   | Update the affected state; show pending work locally and restore it with an explanation on failure.              |
| Autosave or keyboard command                      | Use a stable status region near the document or controls when the visible effect needs explanation.              |
| Long-running job                                  | Keep progress, results, failures, and recovery in a persistent activity surface.                                 |
| Information requiring attention or acknowledgment | Use a persistent notice, notification center, or dialog appropriate to the task.                                 |

Base UI supports anchored toasts for brief, nonessential results that a stable control cannot express clearly. Erbium’s `Toaster` renders a global stack; anchored compositions require the underlying Base UI primitives.

## Writing and delivery

- Use one or two short lines. Name the affected item if the notification may arrive after the user has moved elsewhere.
- Skip confirmations that repeat an obvious state change. For rapid or bulk actions, update the interface and summarize persistently when needed.
- Render request failures in the form, row, dialog, or job that owns them rather than toasting every API error globally.
- Keep Undo, Retry, Review, and Download available outside the toast.

There is no universally safe timeout, and `timeout: 0` does not make the stack a reliable record. Use polite announcements for routine status, reserve urgent announcements for important interruptions, and do not move focus to a toast automatically. Check obstruction, keyboard access, zoom, magnification, and reduced motion; live-region announcements alone do not address these concerns.

## Usage

**Import:** `@erbium/ui/components/toast`

Mount `Toaster` once in your application, then call `toast`.

```tsx
import { Toaster, toast } from "@erbium/ui/components/toast";
```

After an export appears in Activity:

```tsx
toast.add({
  id: "export-complete",
  type: "success",
  title: "Export ready",
  description: "Download it from Activity.",
});
```

## Stack behavior and API

Repeated calls without an ID create separate notifications. Supply a stable `id` to update an existing toast in place; repeating unchanged content replays its shake and refreshes its timer.

`Toaster` has no presentation props: it uses Erbium’s lit surface, built-in status icons and close button, a three-toast preview, and a scrollable full queue on hover or keyboard focus. Swipe toward the inline end to dismiss (right in LTR, left in RTL; the direction comes from `DirectionProvider`). Press F6 to move focus into the stack; Escape dismisses the focused toast. Base UI keeps control of the timer, swipe, and focus behavior.

For toast options, use Base UI’s `timeout` and `actionProps` names instead of Sonner’s `duration` and `action`. Sonner’s theme, rich-color, icon, position, and toaster-ID options are intentionally omitted. Base UI’s promise states, priority announcements, and `onClose`/`onRemove` callbacks remain available.
