---
title: "Link Component"
story: LinkComponent
---

In a TanStack Router app, pass Erbium's `Link` to `NavigationMenuLink` through `render`. The menu still manages focus and keyboard navigation, while Foresight can preload the destination before activation. The menu applies its active styles when the router marks a link with `aria-current="page"`. Use `href` for ordinary anchors.

```tsx
import { Link } from "@erbium/ui/components/link";

import { NavigationMenuItem, NavigationMenuLink } from "@erbium/ui/components/navigation-menu";

export function NavigationMenuDemo() {
  return (
    <NavigationMenuItem>
      <NavigationMenuLink render={<Link to="/docs" />}>Documentation</NavigationMenuLink>
    </NavigationMenuItem>
  );
}
```
