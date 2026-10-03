---
title: "Trigger Delays"
story: TriggerDelays
---

Use `delay` and `closeDelay` on the trigger to control when the card opens and

closes.

```tsx
<HoverCard>
  <HoverCardTrigger delay={100} closeDelay={200} render={<Button variant="link">Hover</Button>} />
  <HoverCardContent>Content</HoverCardContent>
</HoverCard>
```
