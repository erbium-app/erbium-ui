---
title: "Toast"
description: "Brief, supplementary notifications that are safe to miss."
---

Use a toast only when a short, nonessential message helps and the result remains available elsewhere. Never make the toast carry the interaction.

## Choose the feedback surface

Start with the effect: what changes immediately, where pending work appears, what durable state proves success, and where failure remains visible with a way to recover. Keep that feedback near the control or content that owns the action.

| Situation                                                 | Preferred feedback                                                                                                          |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Copy or another brief button action                       | Change the button’s icon, label, or state; provide a polite status announcement when needed.                                |
| Form submission                                           | Show pending state at submit, field errors beside fields, and form errors near submit. Keep the form available on failure.  |
| Toggle or optimistic row change                           | Show the changed state, indicate pending work locally, and restore the previous state with an explanation on failure.       |
| Autosave or keyboard command                              | Use a stable status region near the document or controls when the visible effect needs explanation.                         |
| Upload, import, export, or other background job           | Keep progress, results, failures, and recovery actions in a persistent activity surface. A toast may supplement completion. |
| Information that must be found, acted on, or acknowledged | Use a persistent notice, notification center, or dialog appropriate to the task.                                            |

A global toast fits optional background or cross-surface news with no stable on-screen origin. For example, an export may announce completion after its downloadable result has appeared in an activity list. If a saved state, changed checkbox, or removed row already makes the result clear, another success message usually adds noise.

Base UI also supports anchored toasts. Consider one only when a stable triggering control cannot clearly express a brief, nonessential result itself. Anchoring reduces distance; it does not make redundant feedback useful. Erbium’s `Toaster` renders a global stack; an anchored composition requires the underlying Base UI primitives.

## Constraints

- Keep the message to one or two short lines. Name the affected item when the event may arrive after the user has moved elsewhere.
- Preserve the information and any action elsewhere. Undo, Retry, Review, and Download must not be available only in a disappearing toast.
- Let the form, row, dialog, or job that owns a request render its failure. Avoid a global API error handler that toasts every failed request.
- Avoid a toast per autosave, rapid action, or bulk operation. Update the affected interface and use a persistent summary when needed.
- Keep long-running progress and job history in a persistent surface. A promise or loading toast may supplement it.

## Timing and accessibility

There is no universally safe timeout. A longer timeout or `timeout: 0` does not turn a floating notification into a reliable record. The message must be safe to miss because its information and functionality remain available elsewhere.

Use polite announcements for routine status and reserve urgent announcements for important interruptions. Do not move focus to a toast automatically. Live-region announcements help screen-reader users, but do not solve obstruction, magnification, reading time, or access to an expiring action. Check that the stack does not cover the next control users need and that feedback remains usable with keyboard navigation, zoom, and reduced motion.

## Usage

**Import:** `@erbium/ui/components/toast`

Mount `Toaster` once in your application, then call `toast` for supplementary notifications.

```tsx
import { Toaster, toast } from "@erbium/ui/components/toast";
```

Once the export result is available in your persistent activity surface:

```tsx
toast.add({
  id: "export-complete",
  type: "success",
  title: "Export ready",
  description: "Download it from Activity.",
});
```

## Stack behavior and API

Repeated calls without an ID create separate notifications. Supply a stable `id` to update an existing toast in place; repeating unchanged content replays its shake and refreshes its timer. `Toaster` has no presentation props: it uses Erbium’s lit surface, built-in status icons and close button, a three-toast preview, and a scrollable full queue on hover or keyboard focus. Swipe toward the inline end to dismiss (right in LTR, left in RTL; the direction comes from `DirectionProvider`). Press F6 to move focus into the stack; Escape dismisses the focused toast. Base UI keeps control of the timer, swipe, and focus behavior. For toast options, use Base UI’s `timeout` and `actionProps` names instead of Sonner’s `duration` and `action`. Sonner’s theme, rich-color, icon, position, and toaster-ID options are intentionally omitted. Base UI’s promise states, priority announcements, and `onClose`/`onRemove` callbacks remain available.
