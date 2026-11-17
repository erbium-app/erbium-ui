---
title: "Breadcrumb"
description: "Links that show the current page’s location."
---

Pass the parent pages in path order and the current page as a label. Breadcrumb adapts to the width of its container. When the full path no longer fits, the ellipsis opens a menu of hidden parents in path order.

```tsx
import { Breadcrumb } from "@erbium/ui/components/breadcrumb";

<Breadcrumb
  items={[
    { label: "Home", href: "/" },
    { label: "Components", href: "/docs/components" },
  ]}
  currentPage="Breadcrumb"
/>;
```

Give the breadcrumb a container with a bounded width. In a flex or grid layout, allow its wrapper to shrink with `min-w-0`. The trail keeps the first link visible whenever it fits beside the ellipsis and current page. Any remaining space goes to nearby ancestors. The current page label truncates as a last resort.

| Prop            | Description                                                                                                                                                         |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `items`         | Parent pages in path order. Each entry has a text `label` and either an `href` or an anchor rendered through `render`. Use a stable `id` if hrefs or labels repeat. |
| `currentPage`   | The label for the current page. Pass an empty `items` array to show this label by itself.                                                                           |
| `separator`     | Optional text or icon between crumbs. Defaults to a chevron.                                                                                                        |
| `overflowLabel` | Optional accessible name for the ellipsis button.                                                                                                                   |

For bespoke markup such as a named dropdown in the trail, compose `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbSeparator`, and `BreadcrumbPage` as children of `Breadcrumb`. In that composition you control wrapping and which entries appear.

In a TanStack Router app, the **TanStack Router** example shows how to derive the trail from the active route matches and define labels once on each route.
