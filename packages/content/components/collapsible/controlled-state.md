---
title: "Controlled State"
story: ControlledState
---

Use the `open` and `onOpenChange` props to control the state.

```tsx
import * as React from "react";

export function Example() {
  const [open, setOpen] = React.useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger>Toggle</CollapsibleTrigger>
      <CollapsibleContent>Content</CollapsibleContent>
    </Collapsible>
  );
}
```
