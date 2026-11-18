import * as React from "react";
import { useMatches, useRouter } from "@tanstack/react-router";
import type {
  AnyRouteMatch,
  AnyRouter,
  LinkComponentProps,
  RegisteredRouter,
} from "@tanstack/react-router";
import { Breadcrumb } from "../components/breadcrumb";
import type { BreadcrumbDestination } from "../components/breadcrumb";
import { Link } from "../components/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "../components/sidebar";
import { useRouterPending } from "../hooks/use-router-pending";
import { Option, Schema } from "effect";
import { cn } from "../lib/utils";

/*
 * Routes describe their own header. `crumb` names the route in the breadcrumb trail and the
 * title; a route named by its data returns `crumb` from its loader instead. `actions` is a
 * component the header renders while the route is the deepest one with actions.
 */
declare module "@tanstack/react-router" {
  interface StaticDataRouteOption {
    crumb?: string;
    actions?: React.ComponentType;
  }
}

// A loader names its route by returning `{ crumb }` alongside its data.
const decodeLoaderCrumb = Schema.decodeUnknownOption(Schema.Struct({ crumb: Schema.String }));

const crumbOf = (match: AnyRouteMatch) =>
  Option.match(decodeLoaderCrumb(match.loaderData), {
    onNone: () => match.staticData.crumb,
    onSome: ({ crumb }) => crumb,
  });

/**
 * `resizable`: the sidebar collapses offcanvas and resizes from its edge; open state and width
 * are remembered. `fixed`: the sidebar is always open on desktop and cannot be resized, as on
 * a documentation site. Both use a drawer on mobile.
 */
type AppShellSidebarMode = "resizable" | "fixed";

const AppShellContext = React.createContext<{ sidebar: AppShellSidebarMode }>({
  sidebar: "resizable",
});

const StoredSidebarState = Schema.Struct({
  open: Schema.Boolean,
  width: Schema.optionalKey(Schema.Finite),
});

type SidebarState = typeof StoredSidebarState.Type;

const decodeSidebarState = Schema.decodeUnknownOption(Schema.fromJsonString(StoredSidebarState));

const defaultSidebarState: SidebarState = { open: true };

// Storage can be unavailable (private windows, blocked site data) or hold an older format; the
// shell then starts from its defaults.
const readSidebarState = (storageKey: string): SidebarState => {
  let stored: string | null = null;

  try {
    stored = localStorage.getItem(storageKey);
  } catch {
    // Unreadable storage is an expected condition, not a fault: the defaults apply.
  }

  return Option.getOrElse(decodeSidebarState(stored), () => defaultSidebarState);
};

const writeSidebarState = (storageKey: string, state: SidebarState) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    // Without writable storage the state lasts for this visit only, which is the fallback.
  }
};

const keepOpen = () => {
  // A fixed sidebar ignores requests to collapse; the mobile drawer has its own state.
};

/* Closes the mobile drawer once a navigation lands on a new path, so links need no handler. */
const CloseDrawerOnNavigation = () => {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  React.useEffect(
    () =>
      router.subscribe("onResolved", (event) => {
        if (event.pathChanged) {
          setOpenMobile(false);
        }
      }),
    [router, setOpenMobile],
  );

  return null;
};

type AppShellProps = Omit<
  React.ComponentProps<typeof SidebarProvider>,
  "defaultOpen" | "open" | "onOpenChange" | "defaultWidth" | "width" | "onWidthChange"
> & {
  sidebar?: AppShellSidebarMode;
  /** Where a resizable sidebar remembers its open state and width. `null` remembers nothing. */
  storageKey?: string | null;
};

/**
 * The persistent frame of an application: sidebar, header, and a content surface. Render it
 * once in a layout route around `<Outlet />`, so navigating replaces only the content.
 */
const AppShell = ({
  sidebar = "resizable",
  storageKey = "app-shell",
  className,
  children,
  ...props
}: AppShellProps) => {
  const [state, setState] = React.useState(() =>
    storageKey === null ? defaultSidebarState : readSidebarState(storageKey),
  );

  const update = (next: SidebarState) => {
    setState(next);

    if (storageKey !== null) {
      writeSidebarState(storageKey, next);
    }
  };

  const context = React.useMemo(() => ({ sidebar }), [sidebar]);
  const fixed = sidebar === "fixed";

  return (
    <AppShellContext value={context}>
      <SidebarProvider
        data-slot="app-shell"
        data-sidebar-mode={sidebar}
        open={fixed || state.open}
        onOpenChange={
          fixed
            ? keepOpen
            : (open) => {
                update({ ...state, open });
              }
        }
        width={fixed ? undefined : state.width}
        onWidthChange={(width) => {
          update({ ...state, width });
        }}
        className={cn(
          "h-svh min-h-0 overflow-hidden [--app-shell-header-height:--spacing(12)]",
          className,
        )}
        {...props}
      >
        <CloseDrawerOnNavigation />
        {children}
      </SidebarProvider>
    </AppShellContext>
  );
};

const AppShellSidebar = ({
  children,
  ...props
}: Omit<React.ComponentProps<typeof Sidebar>, "variant" | "collapsible">) => {
  const { sidebar } = React.use(AppShellContext);

  return (
    <Sidebar data-slot="app-shell-sidebar" variant="inset" collapsible="offcanvas" {...props}>
      {children}
      {sidebar === "resizable" && <SidebarRail />}
    </Sidebar>
  );
};

const AppShellSidebarHeader = (props: React.ComponentProps<typeof SidebarHeader>) => (
  <SidebarHeader data-slot="app-shell-sidebar-header" {...props} />
);

const AppShellSidebarFooter = (props: React.ComponentProps<typeof SidebarFooter>) => (
  <SidebarFooter data-slot="app-shell-sidebar-footer" {...props} />
);

/** The scrolling navigation landmark between the sidebar's header and footer. */
const AppShellNav = ({
  label,
  className,
  children,
  ...props
}: React.ComponentProps<"nav"> & { label: string }) => (
  <SidebarContent>
    <nav
      data-slot="app-shell-nav"
      aria-label={label}
      className={cn("flex flex-col", className)}
      {...props}
    >
      {children}
    </nav>
  </SidebarContent>
);

/** A labelled group of navigation rows. */
const AppShellNavSection = ({
  label,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "role"> & { label?: string }) => {
  const labelId = React.useId();

  return (
    <SidebarGroup
      data-slot="app-shell-nav-section"
      role={label === undefined ? undefined : "group"}
      aria-labelledby={label === undefined ? undefined : labelId}
      className={className}
      {...props}
    >
      {label !== undefined && <SidebarGroupLabel id={labelId}>{label}</SidebarGroupLabel>}
      <SidebarMenu>{children}</SidebarMenu>
    </SidebarGroup>
  );
};

interface AppShellNavRowProps {
  label: string;
  icon?: React.ReactNode;
  /** Passive metadata such as a count. Not interactive. */
  badge?: React.ReactNode;
}

// Router's Link marks the active row with `data-status="active"` and `aria-current="page"`.
const activeRowClassName =
  "data-[status=active]:bg-sidebar-accent data-[status=active]:text-sidebar-accent-foreground";

/**
 * A navigation row. Takes Router's link options (`to`, `params`, `search`, `activeOptions`),
 * so destinations stay typed, preload ahead of the click, and mark themselves active.
 */
function AppShellNavLink<
  TRouter extends AnyRouter = RegisteredRouter,
  const TFrom extends string = string,
  const TTo extends string | undefined = undefined,
  const TMaskFrom extends string = TFrom,
  const TMaskTo extends string = "",
>(
  props: Omit<LinkComponentProps<"a", TRouter, TFrom, TTo, TMaskFrom, TMaskTo>, "children"> &
    AppShellNavRowProps,
): React.ReactElement;

// The implementation accepts the options of any link; the overload restores the generics.
function AppShellNavLink({
  label,
  icon,
  badge,
  className,
  ...linkProps
}: Omit<LinkComponentProps<"a", RegisteredRouter, string, string>, "children"> &
  AppShellNavRowProps) {
  return (
    <SidebarMenuItem data-slot="app-shell-nav-link">
      <SidebarMenuButton
        render={<Link {...linkProps} />}
        className={cn(activeRowClassName, className)}
      >
        {icon}
        <span>{label}</span>
      </SidebarMenuButton>
      {badge !== undefined && <SidebarMenuBadge>{badge}</SidebarMenuBadge>}
    </SidebarMenuItem>
  );
}

/** A row that runs an action instead of navigating, such as creating a project. */
const AppShellNavAction = ({
  label,
  icon,
  badge,
  ...props
}: Omit<React.ComponentProps<typeof SidebarMenuButton>, "children" | "isActive" | "render"> &
  AppShellNavRowProps) => (
  <SidebarMenuItem data-slot="app-shell-nav-action">
    <SidebarMenuButton type="button" {...props}>
      {icon}
      <span>{label}</span>
    </SidebarMenuButton>
    {badge !== undefined && <SidebarMenuBadge>{badge}</SidebarMenuBadge>}
  </SidebarMenuItem>
);

/** The raised surface beside the sidebar that holds the header and the routed content. */
const AppShellSurface = ({ className, ...props }: React.ComponentProps<typeof SidebarInset>) => (
  <SidebarInset
    data-slot="app-shell-surface"
    className={cn(
      "min-h-0 min-w-0 overflow-hidden md:peer-data-[variant=inset]:ring-1 md:peer-data-[variant=inset]:ring-sidebar-border",
      className,
    )}
    {...props}
  />
);

/* A thin bar along the header's bottom edge while a navigation resolves. The fade-in waits a
   moment, so navigations that resolve quickly never show it. */
const AppShellPendingBar = () => {
  const pending = useRouterPending();

  return (
    <div
      aria-hidden="true"
      data-pending={pending ? "" : undefined}
      className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-primary opacity-0 transition-opacity duration-300 data-pending:animate-pulse data-pending:opacity-100 data-pending:delay-150"
    />
  );
};

/**
 * The header at the top of the surface. It holds the sidebar trigger (mobile only for a fixed
 * sidebar) and the navigation progress bar; compose a breadcrumb trail or a title, and the
 * actions, inside it.
 */
const AppShellHeader = ({ className, children, ...props }: React.ComponentProps<"header">) => {
  const { sidebar } = React.use(AppShellContext);

  return (
    <header
      data-slot="app-shell-header"
      className={cn(
        "relative flex h-(--app-shell-header-height) shrink-0 items-center gap-related carve-bottom px-3",
        className,
      )}
      {...props}
    >
      <SidebarTrigger className={cn("-ms-1", sidebar === "fixed" && "md:hidden")} />
      {children}
      <AppShellPendingBar />
    </header>
  );
};

interface Crumb {
  id: string;
  label: string;
  pathname: string;
}

const trimTrailingSlash = (pathname: string) =>
  pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

/** The active route trail: each match's loader `crumb`, or else its `staticData.crumb`. */
const useAppShellCrumbs = (): readonly Crumb[] => {
  const matches = useMatches();

  return React.useMemo(() => {
    const crumbs: Crumb[] = [];

    for (const match of matches) {
      const label = crumbOf(match);

      if (label !== undefined && label !== "") {
        const pathname = trimTrailingSlash(match.pathname);
        const previous = crumbs.at(-1);

        // A layout and its index route share a path; the deeper route names it.
        if (previous?.pathname === pathname) {
          crumbs.pop();
        }

        crumbs.push({ id: match.id, label, pathname });
      }
    }

    return crumbs;
  }, [matches]);
};

/** The route trail as breadcrumbs: ancestors link back, the current route is the page. */
const AppShellBreadcrumbs = ({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Breadcrumb>, "items" | "currentPage" | "children">) => {
  const crumbs = useAppShellCrumbs();

  const items = React.useMemo(
    () =>
      crumbs.slice(0, -1).map((crumb): BreadcrumbDestination => ({
        id: crumb.id,
        label: crumb.label,
        // The path is already resolved, so it goes to Router as an href rather than a route.
        render: <Link to={crumb.pathname} />,
      })),
    [crumbs],
  );

  const current = crumbs.at(-1);

  if (current === undefined) {
    return null;
  }

  return (
    <Breadcrumb
      data-slot="app-shell-breadcrumbs"
      items={items}
      currentPage={current.label}
      className={cn("min-w-0 flex-1", className)}
      {...props}
    />
  );
};

/** The current route's crumb as the page heading. */
const AppShellTitle = ({ className, ...props }: Omit<React.ComponentProps<"h1">, "children">) => {
  const current = useAppShellCrumbs().at(-1);

  if (current === undefined) {
    return null;
  }

  return (
    <h1
      data-slot="app-shell-title"
      className={cn("min-w-0 flex-1 truncate text-control", className)}
      {...props}
    >
      {current.label}
    </h1>
  );
};

/**
 * The header's trailing controls: the deepest route's `staticData.actions`, then `children`
 * for actions every route shares.
 */
const AppShellActions = ({ className, children, ...props }: React.ComponentProps<"div">) => {
  const matches = useMatches();
  const match = matches.findLast((candidate) => candidate.staticData.actions !== undefined);
  const RouteActions = match?.staticData.actions;

  return (
    <div
      data-slot="app-shell-actions"
      className={cn("ms-auto flex shrink-0 items-center gap-related", className)}
      {...props}
    >
      {RouteActions !== undefined && match !== undefined && <RouteActions key={match.id} />}
      {children}
    </div>
  );
};

/**
 * The scrolling region for routed content. Router restores its scroll position per entry when
 * the router enables `scrollRestoration`.
 */
const AppShellContent = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="app-shell-content"
    data-scroll-restoration-id="app-shell-content"
    className={cn("relative min-h-0 flex-1 overflow-y-auto overscroll-contain", className)}
    {...props}
  />
);

export {
  AppShell,
  AppShellActions,
  AppShellBreadcrumbs,
  AppShellContent,
  AppShellHeader,
  AppShellNav,
  AppShellNavAction,
  AppShellNavLink,
  AppShellNavSection,
  AppShellSidebar,
  AppShellSidebarFooter,
  AppShellSidebarHeader,
  AppShellSurface,
  AppShellTitle,
  useAppShellCrumbs,
};

export type { AppShellProps, AppShellSidebarMode };
