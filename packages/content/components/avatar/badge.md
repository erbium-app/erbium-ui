---
title: "Badge"
story: Badge
---

Use the `AvatarBadge` component to add a badge to the avatar. The badge sits at the inline end and bottom of the avatar, so it moves to the bottom left in RTL layouts.

The image and fallback are clipped around the badge, leaving a transparent gap instead of painting a background-colored ring. That means the badge stays legible on any surface without extra classes.

Use a theme token such as `bg-success` to set the badge color.

```tsx
<Avatar>
  <AvatarImage
    src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop"
    alt="John Doe"
  />
  <AvatarFallback>JD</AvatarFallback>
  <AvatarBadge className="bg-success" />
</Avatar>
```
