import { useHotkey } from "@tanstack/react-hotkeys";
import { useRouter } from "@tanstack/react-router";
import { useRef, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import {
  AppShell,
  AppShellContent,
  AppShellNav,
  AppShellNavLink,
  AppShellNavSection,
  AppShellSidebar,
  AppShellSidebarFooter,
  AppShellSidebarHeader,
  AppShellSurface,
  AppShellTrigger,
} from "@erbium/ui/blocks/app-shell";
import { Button } from "@erbium/ui/components/button";
import { buttonVariants } from "@erbium/ui/lib/button-variants";
import { Icon } from "@erbium/ui/components/icon";
import { Kbd } from "@erbium/ui/components/kbd";
import { ThemeToggleIcon } from "@erbium/ui/components/stateful-icon";
import { useSidebar } from "@erbium/ui/components/sidebar";
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandCollection,
  CommandItem,
} from "@erbium/ui/components/command";
import { releases } from "virtual:docs-catalog";
import { releaseDay, wasRecentlyUpdated } from "@/content/release-date";
import { navigationGroups } from "@/content/catalog";
import { Link } from "@erbium/ui/components/link";
import { LogoLoader } from "@erbium/ui/components/logo-loader";
import type { LogoLoaderHandle } from "@erbium/ui/components/logo-loader";
import { useRouterPending } from "@erbium/ui/hooks/use-router-pending";
import { useTheme, toggleTheme } from "./theme";

// Navigations that resolve faster than this never move the logo.
const navigationIndicatorDelay = 150;

const Brand = () => {
  const logo = useRef<LogoLoaderHandle>(null);
  const navigating = useRouterPending();

  return (
    <Link
      to="/"
      className="inline-flex items-center gap-related px-2 text-body font-semibold text-foreground"
      aria-label="Erbium UI home"
      onPointerEnter={() => logo.current?.replay()}
    >
      {/* The logo doubles as the navigation indicator. */}
      <LogoLoader ref={logo} loading={navigating} delay={navigationIndicatorDelay} />
      <span
        className="inline-flex items-baseline gap-(--docs-tight-gap) text-subtitle whitespace-nowrap"
        aria-hidden="true"
      >
        Erbium <span className="text-link font-medium">UI</span>
      </span>
    </Link>
  );
};

const currentReleaseDay = () => releaseDay(Date.now());
const builtReleaseDay = () => releases.builtOn;

const subscribeReleaseDay = (notify: () => void) => {
  const timer = window.setInterval(notify, 60_000);

  return () => {
    window.clearInterval(timer);
  };
};

const RecentlyUpdated = () => (
  <>
    <span aria-hidden="true" className="size-1.5 rounded-full bg-link" />
    <span className="sr-only">Recently updated</span>
  </>
);

const Navigation = () => {
  const today = useSyncExternalStore(subscribeReleaseDay, currentReleaseDay, builtReleaseDay);

  return (
    <AppShellNav label="Documentation">
      {navigationGroups.map((group) => (
        <AppShellNavSection key={group.title} label={group.title}>
          {group.items.map((page) => (
            <AppShellNavLink
              key={page.href}
              to={page.href}
              // Every page is a leaf, and the home page's path prefixes all the others.
              activeOptions={{ exact: true }}
              label={page.title}
              badge={
                releases.changed[page.href]?.some((day) => wasRecentlyUpdated(day, today)) ===
                true ? (
                  <RecentlyUpdated />
                ) : undefined
              }
            />
          ))}
        </AppShellNavSection>
      ))}
    </AppShellNav>
  );
};

const ThemeToggle = () => {
  const dark = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={dark ? "Use light theme" : "Use dark theme"}
      aria-pressed={dark}
    >
      <ThemeToggleIcon theme={dark ? "dark" : "light"} />
    </Button>
  );
};

const SidebarActions = () => (
  <AppShellSidebarFooter className="flex-row items-center justify-between">
    <div className="flex items-center gap-related">
      <a
        href="https://github.com/erbium-app/erbium-ui"
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({ size: "icon", variant: "ghost" })}
        aria-label="Erbium UI on GitHub"
      >
        <Icon name="github" />
      </a>
      {releases.version !== null && (
        <Link
          to="/docs/$"
          params={{ _splat: "changelog" }}
          className="inline-flex min-h-8 items-center rounded-md px-1 text-metadata text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
        >
          v{releases.version}
          <span className="sr-only"> changelog</span>
        </Link>
      )}
    </div>
    <ThemeToggle />
  </AppShellSidebarFooter>
);

// Inside the shell, so opening search from the mobile drawer also closes the drawer.
const SearchTrigger = ({ onOpenSearch }: { onOpenSearch: () => void }) => {
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <Button
      variant="outline"
      onClick={() => {
        setOpenMobile(false);
        onOpenSearch();
      }}
      className="w-full justify-start text-muted-foreground"
    >
      <Icon name="search-01" />
      <span className="min-w-0 flex-1 truncate text-start">Search documentation…</span>
      {!isMobile && <Kbd hotkey="Mod+K" />}
    </Button>
  );
};

const searchGroups = navigationGroups.map((group) => ({
  items: group.items.map((page) => ({ ...page, label: page.title })),
  label: group.title,
}));

// The dialog suspends the page's hotkeys while it is open, so the shortcut that opened
// it is registered again inside it to close it.
const CloseSearchHotkey = ({ onClose }: { onClose: () => void }) => {
  useHotkey("Mod+K", onClose);

  return null;
};

const Search = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const router = useRouter();

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search documentation"
      description="Find a component, guide, hook, or foundation."
      className="sm:max-w-xl"
    >
      <CloseSearchHotkey
        onClose={() => {
          onOpenChange(false);
        }}
      />
      <Command
        items={searchGroups}
        itemToStringValue={(item) => `${item.title} ${item.section} ${item.description}`}
      >
        <CommandInput aria-label="Search documentation" placeholder="Search documentation…" />
        <CommandEmpty>No matching documentation.</CommandEmpty>
        <CommandList>
          {(group: (typeof searchGroups)[number]) => (
            <CommandGroup key={group.label} items={group.items}>
              <CommandGroupLabel>{group.label}</CommandGroupLabel>
              <CommandCollection>
                {(item: (typeof searchGroups)[number]["items"][number]) => (
                  <CommandItem
                    key={item.href}
                    value={item}
                    onClick={() => {
                      onOpenChange(false);
                      void router.navigate({ to: item.href });
                    }}
                  >
                    <span>{item.title}</span>
                  </CommandItem>
                )}
              </CommandCollection>
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
};

/*
 * The documentation site's frame: the app shell with a fixed sidebar, so the navigation
 * neither collapses nor resizes on desktop and becomes a drawer on mobile. Pages render inside
 * the shell's scrolling content region, under a header that carries the breadcrumb trail.
 */
export const Shell = ({ children }: { children: ReactNode }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  useHotkey("Mod+K", () => {
    setSearchOpen((open) => !open);
  });

  const openSearch = () => {
    setSearchOpen(true);
  };

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <AppShell sidebar="fixed" scroll="page" storageKey={null} className="docs-shell">
        <AppShellSidebar className="docs-sidebar">
          <AppShellSidebarHeader className="gap-3 pt-3">
            <Brand />
            <SearchTrigger onOpenSearch={openSearch} />
          </AppShellSidebarHeader>
          <Navigation />
          <SidebarActions />
        </AppShellSidebar>
        <AppShellSurface>
          {/* No header: pages carry their own title. On mobile, where the sidebar is a
              drawer, a bar keeps the brand and the drawer's trigger. */}
          <div className="flex shrink-0 items-center justify-between px-2 pt-2 md:hidden">
            <Brand />
            <AppShellTrigger size="icon" />
          </div>
          <AppShellContent className="flex flex-col">{children}</AppShellContent>
        </AppShellSurface>
      </AppShell>
      <Search open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
};
