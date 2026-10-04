---
title: "Action"
story: Action
---

Pass button props with `actionProps` to render an action. This example closes the toast; a real Undo handler must also restore application state.

```tsx
const id = toast.add({
  id: "event-created",
  title: "Event created",
  actionProps: {
    children: "Undo",
    onClick() {
      toast.close(id);
    },
  },
});
```
