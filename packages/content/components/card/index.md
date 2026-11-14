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
  CardMedia,
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
├── CardMedia
├── CardHeader
│   ├── CardTitle
│   ├── CardDescription
│   └── CardAction
├── CardContent
└── CardFooter
```

Card owns the vertical rhythm; CardHeader, CardContent, and CardFooter own their gutters. Use `size="sm"` for the compact recipe rather than overriding section padding. A calendar or independently scrolling body that owns its internal spacing belongs directly in Card, without a CardContent wrapper whose padding must be cancelled. Put an aspect ratio on Card itself, so its gutters count toward the overall dimensions.

CardFooter includes the full-width separator. Do not add `border-t` or a second Separator. The same ownership rule applies to dialog, sheet, and drawer footers. To divide a CardHeader from the body, place a `Separator` with `variant="full"` between them; the rule belongs between sections, never as a `border-b` on CardHeader.

Wrap a cover image in `CardMedia` to draw the shared image hairline. Place it first or last in `Card` so it follows the corresponding card corners.

The sign-in and account creation views use TanStack Router links. The preview uses memory history. In an app, mount the forms on your sign-in and sign-up routes. Use `Form`, `useAppForm`, and the bound fields for values, validation, and submission state. Auth service errors are displayed from the form error map. The provider button sits above the email form with a labeled separator. The filled Google mark uses `data-icon="inline-start"` for spacing and `aria-hidden` because the label names the provider.

Storybook demonstrates the forms locally. In an app with a [configured Better Auth server](https://better-auth.com/docs/installation), pass your client to the installed card example to enable email sign-in, registration, and Google sign-in.

```tsx
import { createAuthClient } from "better-auth/client";

// Import CardDemo from the installed example.
const authClient = createAuthClient();

<CardDemo authClient={authClient} />;
```
