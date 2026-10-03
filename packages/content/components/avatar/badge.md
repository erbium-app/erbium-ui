---
title: "Badge"
story: Badge
---

Use the `AvatarBadge` component to add a badge to the avatar. The badge is positioned at the bottom right of the avatar.

Use a theme token such as `bg-success` to set the badge color.

```tsx
<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
  <AvatarFallback>CN</AvatarFallback>
  <AvatarBadge className="bg-success" />
</Avatar>
```
