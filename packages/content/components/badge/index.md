---
title: "Badge"
description: "A compact label for status or metadata."
---

## Usage

Render a badge or give another element the appearance of a badge.

**Import:** `@erbium/ui/components/badge`

## Usage

```tsx
import { Badge } from "@erbium/ui/components/badge";
```

```tsx
<Badge variant="default | outline | secondary | info | success | warning | error | ghost-error | ghost-info | ghost-success | ghost-warning | tag-gray | tag-red | tag-orange | tag-yellow | tag-green | tag-cyan | tag-blue | tag-purple | tag-magenta">
  Badge
</Badge>
```

## Loading

Loading retains the label and replaces the built-in status icon.

Spinners beside labels belong at the inline start: left in LTR and right in RTL. Inherit `dir` from the page or set it on a containing element. Loading APIs do not expose a spinner alignment option.

```tsx
<Badge loading>Syncing</Badge>
```
