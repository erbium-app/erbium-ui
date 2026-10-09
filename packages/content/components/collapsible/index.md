---
title: "Collapsible"
description: "Expand or collapse a section of content."
---

Expand or collapse a section of content.

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

## Discoverable collapsed content

Use `hiddenUntilFound` on CollapsibleContent when reading content should remain discoverable through browser Find. Base UI opens the panel when a supported browser reveals a match. Do not add `display: none`, a `hidden` utility, or your own beforematch handler; these interfere with the primitive's reveal behavior. Keep ordinary unmounted panels for content that does not need browser search.

Disabled triggers use the native disabled button behavior. Use the primitive's `disabled` prop rather than recreating it with pointer-event classes.
