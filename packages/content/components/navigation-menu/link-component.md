---
title: "Link Component"
story: LinkComponent
---

Use the `render` prop to compose a custom link component such as `Link` from `@erbium/ui/components/link`, which preloads the route before the click.

```tsx
import { Link } from "@erbium/ui/components/link";

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
