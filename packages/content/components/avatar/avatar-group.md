---
title: "Avatar Group"
story: AvatarGroup
---

Use the `AvatarGroup` component to overlap a set of avatars. Each avatar is clipped around the avatar above it, leaving a transparent gap instead of a background-colored ring.

`topmost` chooses which avatar stays whole. It defaults to `last`, which keeps a trailing `<AvatarGroupCount>` intact. Use `topmost="first"` when the first avatar should lead the stack.

Adjust the overlap with `--avatar-overlap` and the cut gap with `--avatar-gap`:

```tsx
<AvatarGroup className="[--avatar-overlap:0.625rem] [--avatar-gap:0.125rem]">
  <Avatar>...</Avatar>
  <Avatar>...</Avatar>
  <AvatarGroupCount>+3</AvatarGroupCount>
</AvatarGroup>
```
