---
title: "Link"
description: "TanStack Router links that preload their route before the click."
---

## Usage

`Link` is TanStack Router's `Link` with one addition: it preloads its route when the user is about to use it, not only once they hover it. Use it for every in-app link.

**Import:** `@erbium/ui/components/link`

```tsx
import { Link } from "@erbium/ui/components/link";

<Link to="/projects/$projectId" params={{ projectId }}>
  Open project
</Link>;
```

The props and types are Router's own. Routes, params, search, hash, masks, `activeProps`, and `activeOptions` are checked against your route tree exactly as they are for Router's `Link`, so switching an import changes nothing else.

## How it works

Router's `intent` preload starts when the pointer enters the link, after a short delay. By then the user is usually a few hundred milliseconds from clicking, and a slow loader is still running when the click arrives.

`Link` also preloads when the user is heading for it:

- The cursor's path points at the link.
- The link is one or two tab stops ahead of the focused element.
- Scrolling is bringing the link under the cursor.
- A finger touches the link.

Prediction comes from [ForesightJS](https://foresightjs.com), through the same `usePredictedIntent` hook the library exposes. The preload runs the route's loaders, so data, code-split route components, and anything a loader starts are ready together. Router's own hover and focus preloading stays on as a fallback, and the router reuses the cached result when both fire.

Prediction turns itself off on slow connections and when the browser asks to save data.

## Components that navigate

Navigation components take Router's link options themselves and render `Link` inside, so they preload the same way. `to` (with `params`, `search`, `hash`, and `activeOptions`) names a route, typed against your route tree; `href` takes a fully built or external URL.

```tsx
<SidebarMenuButton to="/inbox">Inbox</SidebarMenuButton>

<BreadcrumbLink to="/projects">Projects</BreadcrumbLink>

<NavigationMenuLink to="/docs">Documentation</NavigationMenuLink>

<PaginationLink to="." search={{ page: 2 }}>2</PaginationLink>

<Button to="/projects/new" variant="outline">
  New project
</Button>
```

Router marks the current page's link with `aria-current="page"`, which each component styles as active.

For components that only render a link, such as `Item`, pass `Link` through `render`:

```tsx
<Item render={<Link to="/settings/billing" />}>
  <ItemContent>
    <ItemTitle>Billing</ItemTitle>
  </ItemContent>
</Item>
```

## Router configuration

`Link` reads the router's preload settings. A router configured like this gets the most from it:

```tsx
createRouter({
  routeTree,
  defaultPreload: "intent",
  // How long a preloaded match stays fresh. Match it to how fast your data changes.
  defaultPreloadStaleTime: 30_000,
});
```

A preloaded link predicts again once its match would be stale or collected, so a link that stays on screen keeps its route warm.

## Opting out

`Link` follows Router's preload rules:

- `preload={false}` turns prediction off along with Router's own preloading. Use it for links to expensive or side-effecting routes.
- Disabled links, `reloadDocument` links, and external URLs never predict.
- A router created with `defaultPreload: false` turns prediction off for every link that does not opt back in.

Links outside the app, such as an `https:` URL in a footer, can still use `Link`; Router renders them as plain anchors.
