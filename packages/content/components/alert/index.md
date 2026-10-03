---
title: "Alert"
description: "Displays a callout for agent activity, decisions, and failures. Each variant supplies its own icon."
---

Displays a callout for agent activity, decisions, and failures. Each variant supplies its own icon.

**Import:** `@erbium/ui/components/alert`

## Usage

```tsx
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@erbium/ui/components/alert";
```

```tsx
<Alert variant="warning">
  <AlertTitle>Approval required</AlertTitle>
  <AlertDescription>The agent needs permission to install a new dependency.</AlertDescription>
  <AlertAction>
    <Button variant="outline">Review</Button>
  </AlertAction>
</Alert>
```

## Composition

Use the following composition to build an `Alert`:

```text
Alert
├── AlertTitle
├── AlertDescription
└── AlertAction
```
