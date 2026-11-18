---
title: "TanStack Router"
story: LinkComponent
---

Derive the breadcrumb from TanStack Router’s [active route matches](https://tanstack.com/router/latest/docs/api/router/useMatchesHook). Define each title once with [`staticData`](https://tanstack.com/router/latest/docs/guide/static-route-data) on the route. The shared layout builds the trail from the matched route hierarchy, including the resolved path parameters.

```tsx
// routes/projects.tsx
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/projects")({
  component: Outlet,
  staticData: { breadcrumb: "Projects" },
});
```

Set `staticData: { breadcrumb: "Settings" }` on the nested settings route. Render `RouteBreadcrumb` in the shared layout alongside its `Outlet`:

```tsx
import { trimPathRight, useMatches } from "@tanstack/react-router";
import { Breadcrumb } from "@erbium/ui/components/breadcrumb";

declare module "@tanstack/react-router" {
  interface StaticDataRouteOption {
    breadcrumb?: string;
  }
}

export const RouteBreadcrumb = () => {
  const matches = useMatches();
  const labels = new Map<string, string>();

  for (const match of matches) {
    const label = match.staticData.breadcrumb;
    if (label !== undefined) {
      labels.set(trimPathRight(match.pathname), label);
    }
  }

  const leaf = matches.at(-1);
  if (!leaf) {
    return null;
  }

  const currentPath = trimPathRight(leaf.pathname);
  const currentPage = labels.get(currentPath);
  if (currentPage === undefined) {
    return null;
  }

  labels.delete(currentPath);
  return (
    <Breadcrumb
      items={[...labels].map(([to, label]) => ({
        id: to,
        label,
        to,
        activeOptions: { exact: true },
      }))}
      currentPage={currentPage}
    />
  );
};
```

Leave metadata off routes that should not add a crumb, such as pathless layouts. If a layout and its index share a URL, the deeper labeled match wins. The example skips pages with no label for the current URL. For a title that depends on fetched data, such as a project name, read that route’s loader data in the same adapter. If an ancestor requires search parameters, pass the search values required by that route to its link.

The preview uses in-memory routing. Select **Projects** to go up one level and **Open settings** to return. The same links work in the overflow menu when the trail collapses.
