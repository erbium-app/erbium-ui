---
title: "Direction"
description: "Sets the text direction for your application."
---

## Usage

Wrap your application in the direction provider to set its text direction.

**Import:** `@erbium/ui/components/direction`

## Usage

```tsx
import { DirectionProvider } from "@erbium/ui/components/direction";
```

```tsx
<html dir="rtl">
  <body>
    <DirectionProvider direction="rtl">{/* Your app content */}</DirectionProvider>
  </body>
</html>
```

## useDirection

The `useDirection` hook is used to get the current direction of the application.

```tsx
import { useDirection } from "@erbium/ui/components/direction";

function MyComponent() {
  const direction = useDirection();
  return <div>Current direction: {direction}</div>;
}
```
