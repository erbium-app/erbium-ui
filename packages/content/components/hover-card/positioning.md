---
title: "Positioning"
story: Positioning
---

Use the `side` and `align` props on `HoverCardContent` to control placement.

```tsx
<HoverCard>
  <HoverCardTrigger render={<Button variant="link">Hover</Button>} />
  <HoverCardContent side="top" align="start">
    Content
  </HoverCardContent>
</HoverCard>
```
