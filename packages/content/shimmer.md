---
title: Shimmer
description: CSS utilities for adding a shimmer effect to text.
---

# Shimmer

Add a soft animated highlight to text, useful for live status and streaming content.

## Installation

Import the Erbium UI global stylesheet once in your app. The shimmer utilities come from `shadcn/tailwind.css`, which the stylesheet imports; the `shadcn` package is installed with the Erbium styles.

```tsx
import "@erbium/ui/globals.css";
```

## Usage

Add `shimmer` to any text element. It follows the element’s text color and adjusts automatically for dark mode.

```tsx
<p className="shimmer text-muted-foreground">Generating response…</p>
```

## Customize the effect

Set the highlight color, sweep duration, band width, or angle with utility classes.

```tsx
<p className="shimmer shimmer-color-blue-500/60 shimmer-duration-1000 shimmer-spread-24 shimmer-angle-45">
  Generating response…
</p>
```

- `shimmer-once` plays one sweep.
- `shimmer-reverse` reverses the sweep direction.
- `shimmer-none` displays normal text, useful with responsive variants such as `md:shimmer-none`.
- In RTL layouts, the sweep follows the reading direction automatically.

The animation respects the user’s reduced-motion preference and renders as normal text when motion is reduced.
