---
title: "Card"
description: "Groups related content and actions."
---

## Usage

Displays a card with header, content, and footer. Use `size="sm"` for compact spacing.

**Import:** `@erbium/ui/components/card`

## Usage

```tsx
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@erbium/ui/components/card";
```

```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
    <CardAction>Card Action</CardAction>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>
```

## Composition

Use the following composition to build a `Card`:

```text
Card
├── CardHeader
│   ├── CardTitle
│   ├── CardDescription
│   └── CardAction
├── CardContent
└── CardFooter
```

Card owns the vertical rhythm; CardHeader, CardContent, and CardFooter own their gutters. Use `size="sm"` for the compact recipe rather than overriding section padding. A calendar or independently scrolling body that owns its internal spacing belongs directly in Card, without a CardContent wrapper whose padding must be cancelled. Put an aspect ratio on Card itself, so its gutters count toward the overall dimensions.

CardFooter includes the full-width separator. Do not add `border-t` or a second Separator. The same ownership rule applies to dialog, sheet, and drawer footers.
