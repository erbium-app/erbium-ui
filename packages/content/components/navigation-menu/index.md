---
title: "Navigation Menu"
description: "A collection of links for navigating websites."
---

A collection of links for navigating websites.

**Import:** `@erbium/ui/components/navigation-menu`

## Usage

```tsx
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@erbium/ui/components/navigation-menu";
```

```tsx
<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink>Link</NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

## Composition

Use the following composition to build a `NavigationMenu`:

```text
NavigationMenu
├── NavigationMenuList
│   ├── NavigationMenuItem
│   │   ├── NavigationMenuTrigger
│   │   └── NavigationMenuContent
│   │       ├── NavigationMenuLink
│   │       └── NavigationMenuLink
│   └── NavigationMenuItem
│       └── NavigationMenuLink
└── NavigationMenuIndicator
```
