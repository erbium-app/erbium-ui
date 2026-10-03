---
title: "Collapsible"
description: "An interactive component which expands/collapses a panel."
---

An interactive component which expands/collapses a panel.

**Import:** `@erbium/ui/components/collapsible`

## Usage

```tsx
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@erbium/ui/components/collapsible";
```

```tsx
<Collapsible>
  <CollapsibleTrigger>Can I use this in my project?</CollapsibleTrigger>
  <CollapsibleContent>
    Yes. Free to use for personal and commercial projects. No attribution required.
  </CollapsibleContent>
</Collapsible>
```

## Composition

Use the following composition to build a `Collapsible`:

```text
Collapsible
├── CollapsibleTrigger
└── CollapsibleContent
```
