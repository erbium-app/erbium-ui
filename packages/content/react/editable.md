---
title: "Editable"
description: "Headless text that reads as text and becomes an input in place."
---

Text that reads as text and becomes an input when activated. The input edits a draft; Enter or blur commits it, Escape discards it, and focus returns to the part that started editing. The preview and the input are both rendered, so a design can lay the input over the preview and keep the text in one box.

Use [styled Editable](/docs/components/editable) for a single-line editor that keeps its size while you edit.

**Import:** `@erbium-ui/react/editable`

## Anatomy

```tsx
import { Editable } from "@erbium-ui/react/editable";

<Editable.Root defaultValue="Untitled" placeholder="Name">
  <Editable.Preview />
  <Editable.Input aria-label="Name" />
  <Editable.Trigger />
  <Editable.Submit />
  <Editable.Cancel />
</Editable.Root>;
```

`Trigger`, `Submit` and `Cancel` are optional. `Trigger` renders only while not editing; `Submit` and `Cancel` only while editing.

## Committing and cancelling

`onValueChange` fires when a commit changes the value, and `onSubmit` on every commit. Both receive `details.reason`: `"enter"`, `"blur"` or `"submit-press"`. Calling `details.cancel()` in `onValueChange` rejects the commit and keeps editing, which is how to validate.

```tsx
<Editable.Root
  value={title}
  onValueChange={(next, details) => {
    if (next.trim() === "") {
      details.cancel();
      return;
    }

    setTitle(next);
  }}
/>
```

`onCancel` fires when the draft is discarded, with a reason of `"escape"`, `"blur"` or `"cancel-press"`.

`submitMode` chooses what commits: `"both"` (Enter and blur, the default), `"enter"`, `"blur"` or `"none"`. A blur that does not commit discards the draft.

## Activation

`activationMode` chooses what on the preview starts editing: `"click"` (the default), `"dblclick"`, `"focus"` or `"none"`, for a design that edits through a `Trigger` only. `selectOnEdit` selects the text when editing starts; turn it off to put the caret at the end.

## Multiline text

Render a `<textarea>` through `Input`'s `render`. Enter then inserts a line, and Ctrl or Cmd with Enter commits.

```tsx
<Editable.Input render={<textarea rows={3} />} />
```

## Keyboard

| Key                    | Action                                    |
| ---------------------- | ----------------------------------------- |
| Enter                  | Commits. In a textarea, inserts a line.   |
| Ctrl or Cmd with Enter | Commits in a textarea.                    |
| Escape                 | Discards the draft.                       |
| Tab                    | Moves focus on; blur commits or discards. |

Keys that confirm or drop IME composition candidates never commit or discard.

## API reference

### Root

Renders a `<div>`.

| Prop                                             | Type                                         | Default   |
| ------------------------------------------------ | -------------------------------------------- | --------- |
| `value` / `defaultValue` / `onValueChange`       | `string`                                     | `""`      |
| `editing` / `defaultEditing` / `onEditingChange` | `boolean`                                    | `false`   |
| `onSubmit`                                       | `(value, details) => void`                   | —         |
| `onCancel`                                       | `(details) => void`                          | —         |
| `activationMode`                                 | `"click" \| "dblclick" \| "focus" \| "none"` | `"click"` |
| `submitMode`                                     | `"enter" \| "blur" \| "both" \| "none"`      | `"both"`  |
| `selectOnEdit`                                   | `boolean`                                    | `true`    |
| `placeholder`, `maxLength`                       |                                              | —         |
| `disabled`, `readOnly`, `required`               | `boolean`                                    | `false`   |
| `name`                                           | `string`                                     | —         |

`name` submits the committed value through a hidden input. `onEditingChange` receives the activation, commit or cancel reason, and `details.cancel()` keeps the current mode.

### Parts

| Part      | Element    | Notes                                                                                                        |
| --------- | ---------- | ------------------------------------------------------------------------------------------------------------ |
| `Preview` | `<button>` | Shows the value, or the placeholder. While editing it stays in place with `aria-hidden` and `tabIndex={-1}`. |
| `Input`   | `<input>`  | Edits the draft. Inert while not editing: read-only, `aria-hidden` and out of the tab order.                 |
| `Trigger` | `<button>` | Starts editing. Focus returns to it afterwards.                                                              |
| `Submit`  | `<button>` | Commits. Pressing it keeps focus in the input until the commit.                                              |
| `Cancel`  | `<button>` | Discards the draft.                                                                                          |

Every part carries `data-editing`, `data-empty`, `data-disabled` and `data-readonly`.
