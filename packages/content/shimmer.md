---
title: Shimmer
description: Animate an agent’s status while it searches, reads files, or generates a response.
---

## Installation

Import the Erbium UI global stylesheet once in your app. The shimmer utilities come from `shadcn/tailwind.css`, which the stylesheet imports; the `shadcn` package is installed with the Erbium styles.

```tsx
import "@erbium/ui/globals.css";
```

## Usage

Add `shimmer` to the text inside a [Marker](/docs/components/marker) while the agent is working. It follows the element’s text color and adjusts automatically for dark mode. Keep the marker mounted as the status changes so assistive technology can announce the update.

```tsx
import { Marker, MarkerContent } from "@erbium/ui/components/marker";

function AgentStatus() {
  return (
    <Marker render={<output />}>
      <MarkerContent className="shimmer">Reading project files…</MarkerContent>
    </Marker>
  );
}
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
