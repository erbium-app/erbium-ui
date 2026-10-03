---
title: "Link Component"
story: LinkComponent
---

Use the `render` prop to compose a custom link component such as Next.js `Link`.

```tsx
import Link from "next/link";

import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@erbium/ui/components/navigation-menu";

export function NavigationMenuDemo() {
  return (
    <NavigationMenuItem>
      <NavigationMenuLink render={<Link href="/docs" />} className={navigationMenuTriggerStyle()}>
        Documentation
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}
```
