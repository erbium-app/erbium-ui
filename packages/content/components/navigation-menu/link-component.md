---
title: "Link Component"
story: LinkComponent
---

`NavigationMenuLink` takes TanStack Router's link options. `to` names a route, typed against your routes, and the destination preloads before activation; `href` takes a fully built or external URL. The menu still manages focus and keyboard navigation, and applies its active styles when the router marks a link with `aria-current="page"`.

```tsx
import { NavigationMenuItem, NavigationMenuLink } from "@erbium/ui/components/navigation-menu";

export function NavigationMenuDemo() {
  return (
    <NavigationMenuItem>
      <NavigationMenuLink to="/docs">Documentation</NavigationMenuLink>
    </NavigationMenuItem>
  );
}
```
