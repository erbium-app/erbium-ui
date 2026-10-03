---
title: "Attachment"
description: "File and image attachments with upload feedback."
---

## Usage

Compose file or image attachments with media, metadata, upload state, and actions.

**Import:** `@erbium/ui/components/attachment`

## Usage

```tsx
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@erbium/ui/components/attachment";
```

```tsx
<Attachment>
  <AttachmentMedia>
    <FileTextIcon />
  </AttachmentMedia>
  <AttachmentContent>
    <AttachmentTitle>sales-dashboard.pdf</AttachmentTitle>
    <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
  </AttachmentContent>
  <AttachmentActions>
    <AttachmentAction aria-label="Remove sales-dashboard.pdf">
      <XIcon />
    </AttachmentAction>
  </AttachmentActions>
</Attachment>
```

## Composition

Use the following composition to build an attachment:

Use `AttachmentGroup` to lay out multiple attachments in a scrollable row:

```text
Attachment
├── AttachmentMedia
├── AttachmentContent
│   ├── AttachmentTitle
│   └── AttachmentDescription
├── AttachmentActions
│   └── AttachmentAction
└── AttachmentTrigger
```

```text
AttachmentGroup
├── Attachment
└── Attachment
```

## Features

- Icon and image media through `AttachmentMedia`

- Upload states: `idle`, `uploading`, `processing`, `error`, and `done` with built-in styling and a shimmer while in progress

- Three sizes and horizontal or vertical orientation

- A full-card `AttachmentTrigger` that opens a link or dialog while the actions stay independently clickable

- Scrollable, snapping `AttachmentGroup` with an edge fade

- Customizable styling through the `className` prop on every part

## Accessibility

`AttachmentAction` renders a `Button`, and `AttachmentTrigger` renders a real `<button>` (or your element via `render`). Follow the guidance below so both are operable and announced.

`AttachmentAction` is usually icon-only, so give each one an `aria-label` describing the action and its target.

`AttachmentTrigger` covers the card with no text of its own, so give it an `aria-label` for what activating it does.

The trigger sits behind the actions in the stacking order, so an `AttachmentAction` and the `AttachmentTrigger` never trap each other — both remain separately focusable and clickable.

An `AttachmentGroup` scrolls horizontally. When its attachments are interactive: a trigger or actions, keyboard users reach off-screen items by tabbing to them. For a row of presentational attachments, make the group itself focusable and scrollable by adding `tabIndex={0}`, `role="group"`, and an `aria-label`.

The `error` state uses a error color. Keep the failure reason in `AttachmentDescription` so the state is not conveyed by color alone.

```tsx
<AttachmentAction aria-label="Remove sales-dashboard.pdf">
  <XIcon />
</AttachmentAction>
```

```tsx
<AttachmentTrigger
  render={<a href={url} target="_blank" rel="noreferrer" aria-label="Open workspace.png" />}
/>
```
