---
title: "Link Component"
story: LinkComponent
---

Pass a router link to the `render` prop on `<BreadcrumbLink />`. In an app, use `Link` from `@erbium/ui/components/link`, which preloads the route before the click:

```tsx
<BreadcrumbLink render={<Link to="/projects" />}>Projects</BreadcrumbLink>
```
