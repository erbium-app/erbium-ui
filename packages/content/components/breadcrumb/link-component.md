---
title: "Link Component"
story: LinkComponent
---

In a TanStack Router app, pass the Erbium `Link` to `BreadcrumbLink` through its `render` prop. Foresight predicts interest in the link and asks the router to preload its route. Use exact matching so an ancestor link is marked current only on its own route.

```tsx
import { BreadcrumbLink } from "@erbium/ui/components/breadcrumb";
import { Link } from "@erbium/ui/components/link";

<BreadcrumbLink render={<Link to="/projects" activeOptions={{ exact: true }} />}>
  Projects
</BreadcrumbLink>;
```

The preview uses in-memory routing. Select **Projects** to go up one level and **Open settings** to return.
