---
title: "Sizes"
story: Sizes
---

Use the `size` prop to change the size of the avatar. The fallback type and badge scale with it.

For a custom size, set `--avatar-size` instead of a `size-*` utility. The size token keeps the fallback and badge in sync:

```tsx
<Avatar className="[--avatar-size:3rem]">
  <AvatarImage src="/avatar.png" alt="John Doe" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```
