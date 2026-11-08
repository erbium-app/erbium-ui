---
title: "Avatar"
description: "A profile image with a fallback."
---

A profile image with a fallback.

**Import:** `@erbium/ui/components/avatar`

## Usage

```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@erbium/ui/components/avatar";
```

```tsx
<Avatar>
  <AvatarImage
    src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop"
    alt="John Doe"
  />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

## Composition

Use the following composition to build an `Avatar`:

```text
Avatar
├── AvatarImage
├── AvatarFallback
└── AvatarBadge
```

Use the following composition to build an `AvatarGroup`:

```text
AvatarGroup
├── Avatar
│   ├── AvatarImage
│   ├── AvatarFallback
│   └── AvatarBadge
├── Avatar
│   ├── AvatarImage
│   ├── AvatarFallback
│   └── AvatarBadge
└── AvatarGroupCount
    └── AvatarFallback
```

`AvatarGroupCount` renders an avatar with a fallback, so it accepts the same `size` prop as `Avatar`. `AvatarGroup` uses `topmost="last"` by default, keeping a trailing count whole.
