---
title: "Link"
story: Link
---

Use the `render` prop to render the item as a link. The hover and focus states will be applied to the anchor element.

```tsx
<Item render={<a href="/dashboard" />}>
  <ItemMedia variant="icon">
    <HomeIcon />
  </ItemMedia>
  <ItemContent>
    <ItemTitle>Dashboard</ItemTitle>
    <ItemDescription>Overview of your account and activity.</ItemDescription>
  </ItemContent>
</Item>
```
