---
title: "Link Component"
story: LinkComponent
---

Use the `render` prop to compose a custom link component such as TanStack Router `Link`.

```tsx
import { Link } from "@tanstack/react-router";

import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@erbium/ui/components/navigation-menu";

export function NavigationMenuDemo() {
  return (
    <NavigationMenuItem>
      <NavigationMenuLink render={<Link to="/docs" />} className={navigationMenuTriggerStyle()}>
        Documentation
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}
```
