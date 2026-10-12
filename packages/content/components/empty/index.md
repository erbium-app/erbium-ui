---
title: "Empty"
description: "A placeholder for empty content with next steps."
---

## Usage

Use `Empty` for an absent item or an initial state. It includes a subtle dashed boundary and generous spacing by default. Place the icon, title, and description in `EmptyHeader`; place actions or inputs in `EmptyContent` as a sibling. Use `EmptyMedia` without a variant for larger artwork or avatars.

**Import:** `@erbium/ui/components/empty`

## Usage

```tsx
import { Icon } from "@erbium/ui/components/icon";
import { Button } from "@erbium/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@erbium/ui/components/empty";

<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon">
      <Icon name="folder-01" />
    </EmptyMedia>
    <EmptyTitle>No projects yet</EmptyTitle>
    <EmptyDescription>Create a project to get started.</EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button>Create project</Button>
  </EmptyContent>
</Empty>;
```
