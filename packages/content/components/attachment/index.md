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
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentRemove,
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
  <AttachmentRemove aria-label="Remove sales-dashboard.pdf" />
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
├── AttachmentTrigger
└── AttachmentRemove
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

- An `AttachmentRemove` badge on the top-end corner, set into a notch in the card like an avatar badge. It appears on hover or focus, and stays visible on touch screens

- A full-card `AttachmentTrigger` that opens a link, dialog, or lightbox while the actions stay independently clickable. It can wrap the media, so a lightbox opens out of the thumbnail

- Scrollable, snapping `AttachmentGroup` with an edge fade

- Customizable styling through the `className` prop on every part

## Viewing in a lightbox

`Lightbox` triggers wrap the thumbnail they open from, and `AttachmentTrigger` follows that contract. Render a `LightboxTrigger` as an `AttachmentTrigger` around the `AttachmentMedia`: the lightbox keeps the attachment's styling and focus ring, morphs from the media, and reuses the thumbnail through `imageRef`. No other wiring is needed. See [Image](#image) for a gallery and [Group](#group) for a mixed row.

Other file types can join the same lightbox as viewers arrive. A PDF or spreadsheet attachment wraps its icon media in a `LightboxTrigger` the same way, adds `crossfade="both"` because the icon and the viewer look different, and gets a `LightboxItem` whose child is the viewer instead of `LightboxZoom` and `LightboxMedia`. Attach the item's `morphRef` to the viewer's frame so the transition lands on it.

```tsx
<LightboxTrigger
  aria-label="Open briefing-notes.pdf"
  crossfade="both"
  index={index}
  render={<AttachmentTrigger />}
>
  <AttachmentMedia>
    <FileTextIcon />
  </AttachmentMedia>
</LightboxTrigger>

<LightboxItem caption="briefing-notes.pdf" index={index}>
  {({ morphRef }) => <PdfViewer ref={morphRef} src={url} />}
</LightboxItem>
```

## Accessibility

`AttachmentAction` renders a `Button`, and `AttachmentTrigger` renders a real `<button>` (or your element via `render`). Follow the guidance below so both are operable and announced.

`AttachmentAction` is usually icon-only, so give each one an `aria-label` describing the action and its target.

`AttachmentRemove` shows an × by default, so give it an `aria-label` naming the file, such as "Remove sales-dashboard.pdf" or "Cancel upload". It is hidden until hover only on devices that can hover, and it appears whenever focus is inside the card, so keyboard users reach it by tabbing.

`AttachmentTrigger` has no text of its own, whether it covers the card or wraps the media, so give it an `aria-label` for what activating it does, such as "Open workspace.png".

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
