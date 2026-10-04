---
title: "Action"
story: Action
---

Pass button props with `actionProps` to render a supplementary action. Keep the same action available in a persistent surface after the toast disappears. An Undo toast must not be the only way to restore an item; provide recovery in the affected list or history.

The example below shows the action API and closes the toast. A real Undo handler must also restore the application state.

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
