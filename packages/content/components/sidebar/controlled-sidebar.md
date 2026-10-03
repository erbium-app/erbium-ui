---
title: "Controlled Sidebar"
story: ControlledSidebar
---

Use the `open` and `onOpenChange` props to control the sidebar.

```tsx
export function AppSidebar() {
  const [open, setOpen] = React.useState(false);

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <Sidebar />
    </SidebarProvider>
  );
}
```
