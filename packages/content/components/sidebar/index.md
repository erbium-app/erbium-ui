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

## Links

`SidebarMenuButton` and `SidebarMenuSubButton` take TanStack Router's link options. With `to` a row is a router link: `to`, `params`, `search`, `hash`, and `activeOptions` type against your routes, the route preloads before the click, and Router marks the current page with `aria-current="page"`, which applies the active styling. `href` takes a fully built or external URL. Without either, the row is a button.

```tsx
import { SidebarMenuButton } from "@erbium/ui/components/sidebar";

<SidebarMenuButton to="/projects/$projectId" params={{ projectId }}>
  Project
</SidebarMenuButton>
<SidebarMenuButton href="https://github.com/erbium">GitHub</SidebarMenuButton>
<SidebarMenuButton onClick={createProject}>New project</SidebarMenuButton>
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

## SidebarProvider

The `SidebarProvider` component is used to provide the sidebar context to the `Sidebar` component. You should always wrap your application in a `SidebarProvider` component.

| Name            | Type                                   | Description                                                                |
| --------------- | -------------------------------------- | -------------------------------------------------------------------------- |
| `defaultOpen`   | `boolean`                              | Default open state of the sidebar.                                         |
| `open`          | `boolean`                              | Open state of the sidebar (controlled).                                    |
| `onOpenChange`  | `(open: boolean) => void`              | Sets open state of the sidebar (controlled).                               |
| `defaultWidth`  | `number`                               | Initial width in pixels. Unset, the width comes from `--sidebar-width`.    |
| `width`         | `number`                               | Width in pixels (controlled). `undefined` falls back to `--sidebar-width`. |
| `onWidthChange` | `(width: number \| undefined) => void` | Called when the rail resizes the sidebar (controlled).                     |
| `minWidth`      | `number`                               | Smallest width the rail resizes to. Defaults to 224.                       |
| `maxWidth`      | `number`                               | Largest width the rail resizes to. Defaults to 352.                        |

`SidebarProvider` sets `--sidebar-width` (16rem) and `--sidebar-width-icon` (3rem) as classes. Override either one with a class on the provider; `cn` keeps the last value. The mobile sheet uses 18rem.

To toggle the sidebar, `SidebarProvider` registers the `Mod+B` shortcut through TanStack Hotkeys — `Cmd+B` on macOS and `Ctrl+B` on Windows and Linux.

```tsx
<SidebarProvider className="[--sidebar-width:20rem]">
  <Sidebar />
</SidebarProvider>
```

```tsx
const SIDEBAR_KEYBOARD_SHORTCUT = "Mod+B";
```

The provider wires the shortcut up with `useHotkey` from `@tanstack/react-hotkeys`, so the binding adapts to the platform and cleans itself up on unmount. `SidebarTrigger` announces it with `aria-keyshortcuts` and shows a hint badge while the user holds the modifier. The shortcut pauses while a modal dialog or sheet is open.

## Sidebar

The main `Sidebar` component used to render a collapsible sidebar.

| Property      | Type                                                         | Description                       |
| ------------- | ------------------------------------------------------------ | --------------------------------- |
| `side`        | `left` or `right`                                            | The side of the sidebar.          |
| `variant`     | `sidebar` or `inset`                                         | The variant of the sidebar.       |
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
            <DropdownMenuList>
              <DropdownMenuItem>
                <span>Acme Inc</span>
              </DropdownMenuItem>
            </DropdownMenuList>
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

```tsx
<SidebarMenu>
  {projects.map((project) => (
    <SidebarMenuItem key={project.name}>
      <SidebarMenuButton to={project.to}>
        <project.icon />
        <span>{project.name}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  ))}
</SidebarMenu>
```

## SidebarMenuButton

The `SidebarMenuButton` component is used to render a menu button within a `SidebarMenuItem`.

It renders a button, or a router link when given `to` or `href` (see [Links](#links)). A row with `aria-current="page"` shows as active, which Router sets on the current page's link.

```tsx
<SidebarMenuButton to="/">Home</SidebarMenuButton>
```

## SidebarMenuAction

The `SidebarMenuAction` component is used to render a menu action within a `SidebarMenuItem`.

```tsx
<SidebarMenuItem>
  <SidebarMenuButton to="/">
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

## Motion

Opening and closing slides the sidebar over `duration-panel` (300ms) on `ease-ui-out`, `cubic-bezier(0.23, 1, 0.32, 1)`, which starts fast and settles without a linear tail. With the `inset` variant the content surface moves its leading margin on the same curve, so it lands with the sidebar instead of snapping at the end. The mobile drawer uses `ease-ui-drawer`. All of it turns off under `prefers-reduced-motion`.

## SidebarRail

`SidebarRail` is the sidebar's edge. Drag it to resize the sidebar between `minWidth` and `maxWidth`; dragging past half the minimum collapses it, and dragging a collapsed sidebar's edge opens it again. A click toggles the sidebar.

The rail is a focusable window splitter: the arrow keys resize it (Shift moves further), Home and End jump to the bounds, and Enter toggles the sidebar. Leave the rail out for a sidebar that should not resize.

While a drag is in progress the provider's wrapper carries `data-resizing`, which turns off the width transitions. The new width reaches `onWidthChange` when the pointer is released.

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

The sidebar uses its own CSS variables, defined for light and dark themes in `@erbium/ui/globals.css`. Override them to theme the sidebar separately from the rest of the app.

| Variable                       | Use                                         |
| ------------------------------ | ------------------------------------------- |
| `--sidebar`                    | Sidebar background.                         |
| `--sidebar-foreground`         | Default text and icon color.                |
| `--sidebar-primary`            | Emphasized content you add, such as a logo. |
| `--sidebar-primary-foreground` | Text on `--sidebar-primary`.                |
| `--sidebar-accent`             | Hover and active menu item background.      |
| `--sidebar-accent-foreground`  | Text on `--sidebar-accent`.                 |
| `--sidebar-border`             | Borders and separators.                     |
| `--sidebar-ring`               | Focus ring.                                 |

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
