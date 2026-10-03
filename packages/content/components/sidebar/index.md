---
title: "Sidebar"
description: "Navigation and controls beside the main content."
---

## Usage

Compose, theme, and customize a sidebar for your application.

**Import:** `@erbium/ui/components/sidebar`

## Usage

```tsx
import { SidebarProvider, SidebarTrigger } from "@erbium/ui/components/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
```

```tsx
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@erbium/ui/components/sidebar";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
```

## Composition

Use the following composition to build a `Sidebar` layout:

```text
SidebarProvider
├── Sidebar
│   ├── SidebarHeader
│   ├── SidebarContent
│   │   ├── SidebarGroup
│   │   │   ├── SidebarGroupLabel
│   │   │   ├── SidebarGroupAction
│   │   │   ├── SidebarGroupContent
│   │   │   └── SidebarMenu
│   │   │       ├── SidebarMenuItem
│   │   │       │   ├── SidebarMenuButton
│   │   │       │   ├── SidebarMenuAction
│   │   │       │   └── SidebarMenuBadge
│   │   │       └── SidebarMenuItem
│   │   │           ├── SidebarMenuButton
│   │   │           └── SidebarMenuSub
│   │   │               ├── SidebarMenuSubItem
│   │   │               └── SidebarMenuSubItem
│   │   └── SidebarGroup
│   │       └── SidebarMenu
│   │           ├── SidebarMenuItem
│   │           └── SidebarMenuItem
│   ├── SidebarFooter
│   └── SidebarRail
├── SidebarInset
└── SidebarTrigger
```

## Structure

- **SidebarProvider** — Handles collapsible state and provides sidebar context to child components.

- **Sidebar** — The main collapsible sidebar panel.

- **SidebarHeader** — Sticky at the top; use for branding, titles, or workspace switchers.

- **SidebarFooter** — Sticky at the bottom; use for user menus, settings, or actions.

- **SidebarContent** — Scrollable region between the header and footer.

- **SidebarGroup** — Groups related navigation with optional label, action, and content areas.

- **SidebarMenu** / **SidebarMenuItem** — Menu structure for links, badges, actions, and nested submenus.

- **SidebarRail** — Resize handle for adjusting sidebar width when applicable.

- **SidebarInset** — Wraps main content when using the `inset` variant.

- **SidebarTrigger** — Control that toggles the sidebar open or collapsed.

src="/images/sidebar-structure.png"

width="716"

height="420"

alt="Sidebar Structure"

className="mt-6 w-full overflow-hidden rounded-2xl border dark:hidden"

/>

src="/images/sidebar-structure-dark.png"

width="716"

height="420"

alt="Sidebar Structure"

className="mt-6 hidden w-full overflow-hidden rounded-2xl border dark:block"

/>

## SidebarProvider

The `SidebarProvider` component is used to provide the sidebar context to the `Sidebar` component. You should always wrap your application in a `SidebarProvider` component.

| Name           | Type                      | Description                                  |
| -------------- | ------------------------- | -------------------------------------------- |
| `defaultOpen`  | `boolean`                 | Default open state of the sidebar.           |
| `open`         | `boolean`                 | Open state of the sidebar (controlled).      |
| `onOpenChange` | `(open: boolean) => void` | Sets open state of the sidebar (controlled). |

If you have a single sidebar in your application, you can use the `SIDEBAR_WIDTH` and `SIDEBAR_WIDTH_MOBILE` variables in `sidebar.tsx` to set the width of the sidebar.

For multiple sidebars in your application, you can use the `--sidebar-width` and `--sidebar-width-mobile` CSS variables in the `style` prop.

To trigger the sidebar, you use the `cmd+b` keyboard shortcut on Mac and `ctrl+b` on Windows.

```tsx
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
```

```tsx
<SidebarProvider
  style={
    {
      "--sidebar-width": "20rem",
      "--sidebar-width-mobile": "20rem",
    } as React.CSSProperties
  }
>
  <Sidebar />
</SidebarProvider>
```

```tsx
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
```

## Sidebar

The main `Sidebar` component used to render a collapsible sidebar.

| Property      | Type                                                         | Description                       |
| ------------- | ------------------------------------------------------------ | --------------------------------- |
| `side`        | `left` or `right`                                            | The side of the sidebar.          |
| `variant`     | `sidebar`, `floating`, or `inset`                            | The variant of the sidebar.       |
| `collapsible` | `offcanvas`, `icon`, or `none`                               | Collapsible state of the sidebar. |
| Prop          | Description                                                  |
| -----------   | ------------------------------------------------------------ |
| `offcanvas`   | A collapsible sidebar that slides in from the left or right. |
| `icon`        | A sidebar that collapses to icons.                           |
| `none`        | A non-collapsible sidebar.                                   |

**Note:** If you use the `inset` variant, remember to wrap your main content

in a `SidebarInset` component.

```tsx
<SidebarProvider>
  <Sidebar variant="inset" />
  <SidebarInset>
    <main>{children}</main>
  </SidebarInset>
</SidebarProvider>
```

## useSidebar

The `useSidebar` hook is used to control the sidebar.

| Property        | Type                      | Description                                   |
| --------------- | ------------------------- | --------------------------------------------- |
| `state`         | `expanded` or `collapsed` | The current state of the sidebar.             |
| `open`          | `boolean`                 | Whether the sidebar is open.                  |
| `setOpen`       | `(open: boolean) => void` | Sets the open state of the sidebar.           |
| `openMobile`    | `boolean`                 | Whether the sidebar is open on mobile.        |
| `setOpenMobile` | `(open: boolean) => void` | Sets the open state of the sidebar on mobile. |
| `isMobile`      | `boolean`                 | Whether the sidebar is on mobile.             |
| `toggleSidebar` | `() => void`              | Toggles the sidebar. Desktop and mobile.      |

```tsx
import { useSidebar } from "@erbium/ui/components/sidebar";

export function AppSidebar() {
  const { state, open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar } = useSidebar();
}
```

## SidebarHeader

Use the `SidebarHeader` component to add a sticky header to the sidebar.

```tsx
<Sidebar>
  <SidebarHeader>
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={<SidebarMenuButton />}>
            Select Workspace
            <ChevronDown className="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <span>Acme Inc</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarHeader>
</Sidebar>
```

## SidebarFooter

Use the `SidebarFooter` component to add a sticky footer to the sidebar.

```tsx
<Sidebar>
  <SidebarFooter>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton>
          <User2 /> Username
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarFooter>
</Sidebar>
```

## SidebarContent

The `SidebarContent` component is used to wrap the content of the sidebar. This is where you add your `SidebarGroup` components. It is scrollable.

```tsx
<Sidebar>
  <SidebarContent>
    <SidebarGroup />
    <SidebarGroup />
  </SidebarContent>
</Sidebar>
```

## SidebarGroup

Use the `SidebarGroup` component to create a section within the sidebar.

A `SidebarGroup` has a `SidebarGroupLabel`, a `SidebarGroupContent` and an optional `SidebarGroupAction`.

To make a `SidebarGroup` collapsible, wrap it in a `Collapsible`.

```tsx
<SidebarGroup>
  <SidebarGroupLabel>Application</SidebarGroupLabel>
  <SidebarGroupAction>
    <Plus /> <span className="sr-only">Add Project</span>
  </SidebarGroupAction>
  <SidebarGroupContent></SidebarGroupContent>
</SidebarGroup>
```

```tsx
<Collapsible defaultOpen className="group group/collapsible">
  <SidebarGroup>
    <SidebarGroupLabel render={<CollapsibleTrigger />}>
      Help
      <ChevronDown className="ml-auto transition-transform group-data-open/collapsible:rotate-180" />
    </SidebarGroupLabel>
    <CollapsibleContent>
      <SidebarGroupContent />
    </CollapsibleContent>
  </SidebarGroup>
</Collapsible>
```

## SidebarMenu

The `SidebarMenu` component is used for building a menu within a `SidebarGroup`.

src="/images/sidebar-menu.png"

width="716"

height="420"

alt="Sidebar Menu"

className="mt-6 w-full overflow-hidden rounded-2xl border dark:hidden"

/>

src="/images/sidebar-menu-dark.png"

width="716"

height="420"

alt="Sidebar Menu"

className="mt-6 hidden w-full overflow-hidden rounded-2xl border dark:block"

/>

```tsx
<SidebarMenu>
  {projects.map((project) => (
    <SidebarMenuItem key={project.name}>
      <SidebarMenuButton render={<a href={project.url} />}>
        <project.icon />
        <span>{project.name}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  ))}
</SidebarMenu>
```

## SidebarMenuButton

The `SidebarMenuButton` component is used to render a menu button within a `SidebarMenuItem`.

By default, the `SidebarMenuButton` renders a button but you can use the `render` prop to render a different component such as a `Link` or an `a` tag.

Use the `isActive` prop to mark a menu item as active.

```tsx
<SidebarMenuButton render={<a href="#" />} isActive>
  Home
</SidebarMenuButton>
```

## SidebarMenuAction

The `SidebarMenuAction` component is used to render a menu action within a `SidebarMenuItem`.

```tsx
<SidebarMenuItem>
  <SidebarMenuButton render={<a href="#" />}>
    <Home />
    <span>Home</span>
  </SidebarMenuButton>
  <SidebarMenuAction>
    <Plus /> <span className="sr-only">Add Project</span>
  </SidebarMenuAction>
</SidebarMenuItem>
```

## SidebarMenuSub

The `SidebarMenuSub` component is used to render a submenu within a `SidebarMenu`.

```tsx
<SidebarMenuItem>
  <SidebarMenuButton />
  <SidebarMenuSub>
    <SidebarMenuSubItem>
      <SidebarMenuSubButton />
    </SidebarMenuSubItem>
  </SidebarMenuSub>
</SidebarMenuItem>
```

## SidebarMenuBadge

The `SidebarMenuBadge` component is used to render a badge within a `SidebarMenuItem`.

```tsx
<SidebarMenuItem>
  <SidebarMenuButton />
  <SidebarMenuBadge>24</SidebarMenuBadge>
</SidebarMenuItem>
```

## SidebarMenuSkeleton

The `SidebarMenuSkeleton` component is used to render a skeleton for a `SidebarMenu`.

```tsx
<SidebarMenu>
  {Array.from({ length: 5 }).map((_, index) => (
    <SidebarMenuItem key={index}>
      <SidebarMenuSkeleton />
    </SidebarMenuItem>
  ))}
</SidebarMenu>
```

## SidebarTrigger

Use the `SidebarTrigger` component to render a button that toggles the sidebar.

```tsx
import { useSidebar } from "@erbium/ui/components/sidebar";

export function CustomTrigger() {
  const { toggleSidebar } = useSidebar();

  return <button onClick={toggleSidebar}>Toggle Sidebar</button>;
}
```

## SidebarRail

The `SidebarRail` component is used to render a rail within a `Sidebar`. This rail can be used to toggle the sidebar.

```tsx
<Sidebar>
  <SidebarHeader />
  <SidebarContent>
    <SidebarGroup />
  </SidebarContent>
  <SidebarFooter />
  <SidebarRail />
</Sidebar>
```

## Theming

We use the following CSS variables to theme the sidebar.

## Styling

Here are some tips for styling the sidebar based on different states.

```tsx
<Sidebar collapsible="icon">
  <SidebarContent>
    <SidebarGroup className="group-data-[collapsible=icon]:hidden" />
  </SidebarContent>
</Sidebar>
```

```tsx
<SidebarMenuItem>
  <SidebarMenuButton />
  <SidebarMenuAction className="peer-data-[active=true]/menu-button:opacity-100" />
</SidebarMenuItem>
```

## Direction

Use `DirectionProvider` and the matching HTML `dir` attribute for RTL layouts. Set `side="right"` to position the sidebar on the right.
