---
title: "Slider"
description: "Adjust a value within a range."
---

Adjust a value within a range.

**Import:** `@erbium/ui/components/slider`

## Usage

```tsx
import { Slider } from "@erbium/ui/components/slider";
```

```tsx
<Slider defaultValue={[33]} max={100} step={1} />
```

## Value shape and gestures

A numeric value renders one thumb. A one-element array also renders one thumb and retains its array value shape; a range array renders one thumb per value. Keep the value shape consistent between initial state and updates. Use `onValueChange` for a live preview and `onValueCommitted` for work that should run after the interaction completes.

Inside a drawer, put `data-base-ui-swipe-ignore="x"` on a horizontal slider or `"y"` on a vertical slider. This lets the control own its touch axis without disabling every drawer gesture. Touch cancellation and interrupted drags are handled by Base UI; do not add document-level pointer listeners to reproduce them.
