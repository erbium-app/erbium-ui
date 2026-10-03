---
title: "Avatar"
description: "An image element with a fallback for representing the user."
---

An image element with a fallback for representing the user.

**Import:** `@erbium/ui/components/avatar`

## Usage

```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@erbium/ui/components/avatar";
```

```tsx
<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
```

## Composition

Use the following composition to build an `Avatar`:

Use the following composition to build an `AvatarGroup`:

```text
Avatar
├── AvatarImage
├── AvatarFallback
└── AvatarBadge
```

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
```
