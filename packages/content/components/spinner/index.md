---
title: "Spinner"
description: "A loading indicator for ongoing activity."
---

A loading indicator for ongoing activity.

**Import:** `@erbium/ui/components/spinner`

## Usage

```tsx
import { Spinner } from "@erbium/ui/components/spinner";
```

```tsx
<Spinner />
```

## Loading

Use standalone `Spinner` for independent loading indicators. Use `Button loading`, `Badge loading`, or `InputGroup loading` inside controls so the component owns placement and sizing. `StatefulButton` centers its spinner while replacing the label.

Spinners beside labels belong at the inline start: left in LTR and right in RTL. Inherit `dir` from the page or set it on a containing element. Loading APIs do not expose a spinner alignment option.
