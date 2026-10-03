---
title: "Marker"
description: "Inline notes and separators for conversations."
---

## Usage

Display an inline status, system note, bordered row, or labeled separator in a conversation.

**Import:** `@erbium/ui/components/marker`

## Usage

```tsx
import { Marker, MarkerContent, MarkerIcon } from "@erbium/ui/components/marker";
```

```tsx
<Marker>
  <MarkerIcon>
    <CheckIcon />
  </MarkerIcon>
  <MarkerContent>Explored 4 files</MarkerContent>
</Marker>
```

## Composition

Use the following composition to build a marker:

```text
Marker
├── MarkerIcon
└── MarkerContent
```

## Features

- Inline marker, bordered row, and labeled separator variants

- Decorative icon slot that is hidden from assistive tech

- Polymorphic root via `render` for link and button markers

- Pairs with the [`shimmer`](https://ui.shadcn.com/docs/utils/shimmer) utility for streaming status text

- Customizable styling through the `className` prop on every part

## Accessibility

`Marker` is presentational by default. The correct semantics depend on how you use it, so choose the role based on intent rather than relying on a single default.

For streaming or progress markers such as "Thinking..." or a running tool, set `role="status"` so assistive tech announces the update as it appears. `Marker` forwards `role` to the underlying element.

A separator that carries text, such as a date or a section label, needs no role. The divider lines are decorative CSS pseudo-elements, and the text is announced as ordinary content.

**Note:** Do not add `role="separator"` to a labeled divider. A separator

takes its accessible name from `aria-label`, not from its text, and its

contents are treated as presentational, so the visible label would not be

announced. Reserve `role="separator"` for a divider with no meaningful text.

A bordered marker keeps the same semantics as the default marker. The bottom border is decorative, so choose `role="status"`, `render`, or no role based on the marker's purpose.

`MarkerIcon` is decorative and hidden from assistive tech with `aria-hidden`, so the adjacent `MarkerContent` carries the meaning. For an icon-only marker, provide an `aria-label` or visible text so it is not announced as empty.

When a marker links or triggers an action, render it as a real `<button>` or `<a>` with the `render` prop so it is focusable and exposes the correct role. The accessible name comes from the marker text.

```tsx
<Marker role="status">
  <MarkerIcon>
    <Spinner />
  </MarkerIcon>
  <MarkerContent>Compacting conversation</MarkerContent>
</Marker>
```

```tsx
<Marker variant="separator">
  <MarkerContent>Today</MarkerContent>
</Marker>
```

```tsx
<Marker variant="border">
  <MarkerIcon>
    <FileTextIcon />
  </MarkerIcon>
  <MarkerContent>Opened implementation notes</MarkerContent>
</Marker>
```

```tsx
<Marker aria-label="Synced">
  <MarkerIcon>
    <CheckIcon />
  </MarkerIcon>
</Marker>
```

```tsx
<Marker render={<a href="/files" />}>
  <MarkerIcon>
    <FileTextIcon />
  </MarkerIcon>
  <MarkerContent>Explored 4 files</MarkerContent>
</Marker>
```
