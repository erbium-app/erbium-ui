---
title: "Toast"
description: "Brief notifications for events and feedback."
---

## Usage

Display a short message temporarily to provide feedback.

**Import:** `@erbium/ui/components/toast`

## Usage

```tsx
import { toast } from "@erbium/ui/components/toast";
```

```tsx
toast.add({
  id: "event-created",
  title: "Event created",
  description: "Sunday, December 3 at 9:00 AM",
});
```

Repeated calls without an ID create separate notifications. Supply a stable `id` to update an existing toast in place; repeating unchanged content replays its shake and refreshes its timer. `Toaster` has no presentation props: it uses Erbium’s lit surface, built-in status icons and close button, a three-toast preview, and a scrollable full queue on hover or keyboard focus. Swipe toward the inline end to dismiss (right in LTR, left in RTL; the direction comes from `DirectionProvider`). Press F6 to move focus into the stack; Escape dismisses the focused toast. Base UI keeps control of the timer, swipe, and focus behavior. For toast options, use Base UI’s `timeout` and `actionProps` names instead of Sonner’s `duration` and `action`. Sonner’s theme, rich-color, icon, position, and toaster-ID options are intentionally omitted. Base UI’s promise states, priority announcements, and `onClose`/`onRemove` callbacks remain available.
