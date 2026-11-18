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
import type { SidebarMenuButtonProps } from "../components/sidebar";
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

/**
 * What scrolls. `content`: the shell fills the viewport and only `AppShellContent` scrolls, so
 * the header stays in place, as in an application. `page`: the document scrolls and the surface
 * grows with its content beside the fixed sidebar, as on a documentation site. The browser then
 * owns scrolling: scroll restoration, anchors, find in page, and the mobile toolbar that
 * collapses as the page scrolls.
 */
type AppShellScrollMode = "content" | "page";

const AppShellContext = React.createContext<{
  sidebar: AppShellSidebarMode;
  scroll: AppShellScrollMode;
}>({
  sidebar: "resizable",
  scroll: "content",
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
  scroll?: AppShellScrollMode;
  /** Where a resizable sidebar remembers its open state and width. `null` remembers nothing. */
  storageKey?: string | null;
};

/**
 * The persistent frame of an application: sidebar, header, and a content surface. Render it
 * once in a layout route around `<Outlet />`, so navigating replaces only the content.
 */
const AppShell = ({
  sidebar = "resizable",
  scroll = "content",
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

  const context = React.useMemo(() => ({ sidebar, scroll }), [sidebar, scroll]);
  const fixed = sidebar === "fixed";

  return (
    <AppShellContext value={context}>
      <SidebarProvider
        data-slot="app-shell"
        data-sidebar-mode={sidebar}
        data-scroll={scroll}
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
          "[--app-shell-header-height:--spacing(12)]",
          scroll === "content" && "h-svh min-h-0 overflow-hidden",
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

/*
 * Scrolls the current page's row into view when the shell mounts and after each navigation,
 * so a long navigation never hides where the reader is. Router links mark that row with
 * `aria-current="page"`; the frame waits for the links to render the new location.
 */
const useRevealCurrentRow = (nav: React.RefObject<HTMLElement | null>) => {
  const router = useRouter();

  React.useEffect(() => {
    let frame = 0;

    const reveal = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        nav.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: "nearest" });
      });
    };

    reveal();
    const unsubscribe = router.subscribe("onResolved", reveal);

    return () => {
      unsubscribe();
      cancelAnimationFrame(frame);
    };
  }, [nav, router]);
};

/**
 * The scrolling navigation landmark between the sidebar's header and footer. It keeps the
 * current page's row in view.
 */
const AppShellNav = ({
  label,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"nav">, "ref"> & { label: string }) => {
  const nav = React.useRef<HTMLElement>(null);
  useRevealCurrentRow(nav);

  return (
    <SidebarContent>
      <nav
        ref={nav}
        data-slot="app-shell-nav"
        aria-label={label}
        className={cn("flex flex-col", className)}
        {...props}
      >
        {children}
      </nav>
    </SidebarContent>
  );
};

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
  // An intersection rather than `Omit`, which would resolve Router's conditional types early
  // and stop `to` inferring from the value, so destinations built from data would not type.
  props: LinkComponentProps<"a", TRouter, TFrom, TTo, TMaskFrom, TMaskTo> &
    AppShellNavRowProps & { children?: never },
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
      <SidebarMenuButton {...linkProps} className={className}>
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
}: Omit<Extract<SidebarMenuButtonProps, { href?: never }>, "children" | "render"> &
  AppShellNavRowProps) => (
  <SidebarMenuItem data-slot="app-shell-nav-action">
    <SidebarMenuButton type="button" {...props}>
      {icon}
      <span>{label}</span>
    </SidebarMenuButton>
    {badge !== undefined && <SidebarMenuBadge>{badge}</SidebarMenuBadge>}
  </SidebarMenuItem>
);

/**
 * The raised surface beside the sidebar that holds the header and the routed content. On
 * desktop it is a `surface-panel` above the sidebar's canvas; on mobile, where the sidebar is
 * a drawer, it fills the screen with the same panel face, so content reads on one colour.
 * `overflow-clip` rounds its content without making it a scroll container, so sticky content
 * inside a page-scrolling shell sticks to the viewport.
 */
const AppShellSurface = ({ className, ...props }: React.ComponentProps<typeof SidebarInset>) => (
  <SidebarInset
    data-slot="app-shell-surface"
    className={cn("min-h-0 min-w-0 overflow-clip bg-surface-panel", className)}
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
 * The sidebar toggle. A fixed sidebar never collapses on desktop, so its trigger shows only
 * on mobile, where it opens the drawer. `AppShellHeader` renders one; a shell without a header
 * places this wherever its mobile layout needs it.
 */
const AppShellTrigger = ({ className, ...props }: React.ComponentProps<typeof SidebarTrigger>) => {
  const { sidebar } = React.use(AppShellContext);

  return (
    <SidebarTrigger
      data-slot="app-shell-trigger"
      className={cn(sidebar === "fixed" && "md:hidden", className)}
      {...props}
    />
  );
};

/**
 * The optional header at the top of the surface. It holds the sidebar trigger and the
 * navigation progress bar; compose a breadcrumb trail or a title, and the actions, inside it.
 * Leave it out for a surface that is all content, and render `AppShellTrigger` instead. When
 * the page scrolls, the header sticks to the top of the viewport.
 */
const AppShellHeader = ({ className, children, ...props }: React.ComponentProps<"header">) => {
  const { scroll } = React.use(AppShellContext);

  return (
    <header
      data-slot="app-shell-header"
      className={cn(
        "relative flex h-(--app-shell-header-height) shrink-0 items-center gap-related carve-bottom px-3",
        scroll === "page" && "sticky top-0 z-10 bg-surface-panel",
        className,
      )}
      {...props}
    >
      <AppShellTrigger className="-ms-1" />
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
        // The matched path is already resolved, so its params are filled in.
        to: crumb.pathname,
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
 * The region for routed content. In a content-scrolling shell it is the scroll container:
 * Router restores its scroll position per entry when the router enables `scrollRestoration`,
 * and listing `[data-slot="app-shell-content"]` in the router's `scrollToTopSelectors` starts a
 * new page at the top. In a page-scrolling shell the window scrolls and Router handles it
 * without either. The region is `aria-busy` while a navigation resolves, since the previous
 * page stays on screen until the next one is ready.
 */
const AppShellContent = ({ className, ...props }: React.ComponentProps<"div">) => {
  const { scroll } = React.use(AppShellContext);
  const pending = useRouterPending();
  const scrolls = scroll === "content";

  return (
    <div
      data-slot="app-shell-content"
      data-scroll-restoration-id={scrolls ? "app-shell-content" : undefined}
      aria-busy={pending || undefined}
      className={cn(
        "relative flex-1",
        scrolls && "min-h-0 overflow-y-auto overscroll-contain",
        className,
      )}
      {...props}
    />
  );
};

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
  AppShellTrigger,
  useAppShellCrumbs,
};

export type { AppShellProps, AppShellScrollMode, AppShellSidebarMode };
