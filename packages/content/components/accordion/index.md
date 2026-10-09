---
title: "Accordion"
description: "Expandable sections for related content."
---

## Usage

Arrange interactive headings vertically; each heading reveals its own section of content.

**Import:** `@erbium/ui/components/accordion`

**COSS UI page:** [Accordion](https://coss.com/ui/docs/components/accordion)

## Usage

```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@erbium/ui/components/accordion";
```

```tsx
<Accordion defaultValue={["item-1"]}>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
  </AccordionItem>
</Accordion>
```

## Composition

Use the following composition to build an `Accordion`:

```text
Accordion
├── AccordionItem
│   ├── AccordionTrigger
│   └── AccordionContent
└── AccordionItem
    ├── AccordionTrigger
    └── AccordionContent
```

## Discoverable collapsed content

Use `hiddenUntilFound` on AccordionContent when reading content should remain discoverable through browser Find. Base UI opens the panel when a supported browser reveals a match. Do not add `display: none`, a `hidden` utility, or your own beforematch handler; these interfere with the primitive's reveal behavior. Keep ordinary unmounted panels for content that does not need browser search.

Disabled triggers use the native disabled button behavior. Use the primitive's `disabled` prop rather than recreating it with pointer-event classes.
