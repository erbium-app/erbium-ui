---
title: "App Shell"
description: "The persistent application frame: sidebar, header, and content surface, driven by TanStack Router."
---

## Usage

Render the shell once, in a layout route, around `<Outlet />`. The sidebar, header, and surface stay mounted while navigation replaces only the content.

```tsx
import {
  AppShell,
  AppShellActions,
  AppShellBreadcrumbs,
  AppShellContent,
  AppShellHeader,
  AppShellNav,
  AppShellNavLink,
  AppShellNavSection,
  AppShellSidebar,
  AppShellSidebarFooter,
  AppShellSidebarHeader,
  AppShellSurface,
} from "@erbium/ui/blocks/app-shell";

// routes/_app.tsx
export const Route = createFileRoute("/_app")({
  component: () => (
    <AppShell>
      <AppShellSidebar>
        <AppShellSidebarHeader>{/* brand */}</AppShellSidebarHeader>
        <AppShellNav label="Main">
          <AppShellNavSection label="Workspace">
            <AppShellNavLink to="/inbox" icon={<Icon name="inbox" />} label="Inbox" />
            <AppShellNavLink to="/projects" icon={<Icon name="folder-open" />} label="Projects" />
          </AppShellNavSection>
        </AppShellNav>
        <AppShellSidebarFooter>{/* account menu */}</AppShellSidebarFooter>
      </AppShellSidebar>
      <AppShellSurface>
        <AppShellHeader>
          <AppShellBreadcrumbs />
          <AppShellActions />
        </AppShellHeader>
        <AppShellContent>
          <Outlet />
        </AppShellContent>
      </AppShellSurface>
    </AppShell>
  ),
});
```

## Anatomy

```text
AppShell                      provider: sidebar mode, open state, width
├── AppShellSidebar           inset sidebar; drawer on mobile
│   ├── AppShellSidebarHeader
│   ├── AppShellNav           scrolling <nav> landmark
│   │   └── AppShellNavSection
│   │       ├── AppShellNavLink    router link row
│   │       └── AppShellNavAction  button row
│   └── AppShellSidebarFooter
└── AppShellSurface           raised surface beside the sidebar
    ├── AppShellHeader        optional: sidebar trigger, progress bar
    │   ├── AppShellBreadcrumbs | AppShellTitle
    │   └── AppShellActions
    └── AppShellContent       scrolling region for <Outlet />
```

## Without a header

The header is optional. Leave it out when pages carry their own titles, as a documentation site does. The header is where the sidebar trigger lives, so place `AppShellTrigger` yourself, for example in a bar shown only on mobile. With a fixed sidebar the trigger hides on desktop and opens the drawer on mobile.

```tsx
<AppShellSurface>
  <div className="flex items-center justify-between md:hidden">
    <Brand />
    <AppShellTrigger />
  </div>
  <AppShellContent>
    <Outlet />
  </AppShellContent>
</AppShellSurface>
```

## Sidebar modes

`sidebar="resizable"` (the default) collapses the sidebar offcanvas and resizes it from its edge. Drag the edge to resize between 224 and 352 pixels; drag past half the minimum to collapse it. The open state and width are kept in `localStorage` under `storageKey` (`"app-shell"`); pass `null` to keep nothing.

`sidebar="fixed"` keeps the sidebar open on desktop with no rail and no desktop trigger, for documentation sites. Both modes use a drawer on mobile, and the drawer closes when a navigation lands on a new path.

## Header from routes

The header reads the active route matches, so pages do not build their own headers.

- **Crumbs**: a route names itself with `staticData: { crumb: "Projects" }`. A route named by its data returns `crumb` from its loader, and the name is ready when the route renders:

  ```tsx
  export const Route = createFileRoute("/_app/projects/$projectId")({
    loader: async ({ params }) => {
      const project = await fetchProject(params.projectId);
      return { crumb: project.name, project };
    },
  });
  ```

  A layout and its index route share a path, so the deeper one names it.

- **Breadcrumbs or a title**: `AppShellBreadcrumbs` shows the trail, with ancestors linking back and overflow folding into a menu. `AppShellTitle` shows only the current crumb as the page heading. Choose one for the header.

- **Actions**: a route sets `staticData: { actions: ProjectActions }`, and `AppShellActions` renders the deepest route's actions. Children of `AppShellActions` render on every route. Actions are components outside the page, so state they share with the page belongs in search params or a query, not in page state.

## Navigation

`AppShellNavLink` takes Router's link options (`to`, `params`, `search`, `activeOptions`), so destinations stay typed. It preloads the route when the pointer heads for it, so loaders that call `ensureQueryData` fetch before the click. Router marks the active row with `data-status="active"` and `aria-current="page"`; pass `activeOptions={{ exact: true }}` for an index route. `badge` shows passive metadata such as a count.

`AppShellNavAction` is a row that runs an action, such as creating a project.

## Loading and scrolling

While a navigation resolves, a thin bar along the header's bottom edge fades in after a short delay, so quick navigations show nothing. Use a route's `pendingComponent` with the measured `Skeleton` for content that is not known yet.

When only the content scrolls (the default), `AppShellContent` carries `data-scroll-restoration-id`, so Router restores its scroll position per entry when the router sets `scrollRestoration: true`. Add `'[data-slot="app-shell-content"]'` to the router's `scrollToTopSelectors` so a new page starts at the top, since the window itself does not scroll. The region is `aria-busy` while a navigation resolves.

## Scrolling

`scroll="content"` (the default) fills the viewport and scrolls only `AppShellContent`, so the header stays in place, as in an application.

`scroll="page"` scrolls the document instead, as on a documentation site. The sidebar stays fixed, the surface grows with its content, and a header sticks to the top of the viewport. The browser owns scrolling, so Router's window scroll restoration, anchor links, and the mobile toolbar that collapses on scroll work without setup, and `scrollToTopSelectors` is not needed.

```tsx
<AppShell sidebar="fixed" scroll="page">
```

## Layout

With `scroll="content"` the shell fills the viewport (`h-svh`) and the surface fills the remaining height, so the header stays in place and only the content scrolls. The header height is `--app-shell-header-height`.

The sidebar sits on the page canvas (`bg-sidebar`) and the surface is a `surface-panel`: the panel face, perimeter, and drop shadow raise it above the canvas in both themes. On mobile the surface fills the screen with the same panel face. `--sidebar-inset-gap` (default `--spacing(2)`) sets the space around the sidebar and between the surface and the viewport; set it on `AppShell` for a roomier frame.
