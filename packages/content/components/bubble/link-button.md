---
title: "Links and Buttons"
story: LinkButton
---

You can turn a bubble into a link or button by using the `render` prop on `BubbleContent`.

```tsx
import { Bubble, BubbleContent } from "@erbium/ui/components/bubble";

export function BubbleLinkDemo() {
  return (
    <Bubble variant="muted">
      <BubbleContent render={<button />}>Click here</BubbleContent>
    </Bubble>
  );
}
```
