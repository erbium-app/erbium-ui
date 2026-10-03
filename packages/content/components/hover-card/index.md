---
title: "Hover Card"
description: "Preview linked content on hover."
---

## Usage

Use a visual preview to show sighted users the content behind a link.

**Import:** `@erbium/ui/components/hover-card`

## Usage

```tsx
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@erbium/ui/components/hover-card"
import {{ Button }} from "@erbium/ui/components/button"
```

```tsx
<HoverCard>
  <HoverCardTrigger render={<Button variant="link">Hover</Button>} />
  <HoverCardContent>Accessible components for building your next interface.</HoverCardContent>
</HoverCard>
```

## Composition

Use the following composition to build a `HoverCard`:

```text
HoverCard
├── HoverCardTrigger
└── HoverCardContent
```
