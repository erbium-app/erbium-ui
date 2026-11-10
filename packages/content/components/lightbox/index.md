---
title: "Lightbox"
description: "A fullscreen image viewer with thumbnail transitions, zoom, and swipe navigation."
---

## Installation

```sh
bunx shadcn@latest add @erbium/lightbox
```

With the default aliases, import the installed parts from `@/components/blocks/lightbox`. In a workspace using the Erbium UI package, import them from `@erbium/ui/blocks/lightbox`.

## Composition

Use one `Lightbox` per gallery. Match each `LightboxTrigger` index to its `LightboxItem` index, starting at zero. Attach the trigger's `imageRef` to the thumbnail image for the open and close transitions. Give `LightboxMedia` the full image's dimensions so it can fit the image to the viewport before it loads.

The gallery example shows one `LightboxThumbnail` per slide in the footer. Nest the thumbnails inside `LightboxThumbnailStripTrack` and `LightboxThumbnailStrip`, and give each an accessible label and the index of its slide. For a single image, use one trigger and slide and omit the navigation controls and thumbnail strip. Use `createLightboxHandle` with the root's `handle` prop to open a slide from code.

## Accessibility

Give `LightboxContent` an accessible name and supply alt text for each image. The gallery supports keyboard navigation and returns focus to the trigger after closing. Click the background or press Escape to close it. Set the root's `dir` to `rtl` for a right-to-left gallery when direction is scoped below the document.
