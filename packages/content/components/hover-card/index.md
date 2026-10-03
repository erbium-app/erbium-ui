---
title: "Hover Card"
description: "For sighted users to preview content available behind a link."
---

For sighted users to preview content available behind a link.

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
