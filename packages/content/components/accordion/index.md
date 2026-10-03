---
title: "Accordion"
description: "A vertically stacked set of interactive headings that each reveal a section of content."
---

A vertically stacked set of interactive headings that each reveal a section of content.

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
