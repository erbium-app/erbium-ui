import { useHotkey } from "@tanstack/react-hotkeys";
import { useLocation, useRouter, useRouterState } from "@tanstack/react-router";
import { Fragment, useState } from "react";
import type { ReactNode } from "react";
import { Button } from "@erbium/ui/components/button";
import { buttonVariants } from "@erbium/ui/lib/button-variants";
import { Icon } from "@erbium/ui/components/icon";
import { Kbd } from "@erbium/ui/components/kbd";
import { ThemeToggleIcon, SidebarToggleIcon } from "@erbium/ui/components/stateful-icon";
import { Separator } from "@erbium/ui/components/separator";
import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@erbium/ui/components/sidebar";
import {
  Sheet,
  SheetTrigger,
  SheetPanel,
  SheetTitle,
  SheetDescription,
} from "@erbium/ui/components/sheet";
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
import { navigationGroups } from "@/content/catalog";
import { Link } from "@erbium/ui/components/link";
import { useTheme, toggleTheme } from "./theme";

const Brand = () => (
  <Link
    to="/"
    className="inline-flex items-center gap-related text-body font-semibold text-foreground"
    aria-label="Erbium UI home"
  >
    <img
      src="/brand/erbium-logo-light.svg"
      width={32}
      height={32}
      alt=""
      className="block shrink-0 dark:hidden"
    />
    <img
      src="/brand/erbium-logo-dark.svg"
      width={32}
      height={32}
      alt=""
      className="hidden shrink-0 dark:block"
    />
    <span
      className="inline-flex items-baseline gap-(--docs-tight-gap) text-subtitle whitespace-nowrap"
      aria-hidden="true"
    >
      Erbium <span className="text-link font-medium">UI</span>
    </span>
  </Link>
);

// Attached only to the current page's link, so React calls it whenever a link becomes current.
const revealCurrentLink = (link: HTMLAnchorElement | null) => {
  link?.scrollIntoView({ block: "nearest" });
};

const Navigation = ({ onNavigate }: { onNavigate?: () => void }) => {
  const path = useLocation({ select: (location) => location.pathname });

  return (
    <nav aria-label="Documentation">
      {navigationGroups.map((group, index) => (
        <Fragment key={group.title}>
          {index > 0 && <Separator className="my-3" variant="inset" role="presentation" />}
          <SidebarGroup className="py-2 px-0">
            <SidebarGroupLabel className="text-foreground text-metadata font-semibold px-(--docs-navigation-inset) mb-1">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((page) => (
                  <SidebarMenuItem key={page.href}>
                    <SidebarMenuButton
                      render={
                        <Link
                          ref={path === page.href ? revealCurrentLink : undefined}
                          to={page.href}
                          onClick={onNavigate}
                          aria-current={path === page.href ? "page" : undefined}
                        />
                      }
                      isActive={path === page.href}
                      className="text-muted-foreground"
                    >
                      {page.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </Fragment>
      ))}
    </nav>
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
  <SidebarFooter className="flex-row items-center justify-between py-3 ps-0 pe-(--docs-sidebar-inset)">
    <a
      href="https://github.com/erbium-app/erbium-ui"
      target="_blank"
      rel="noopener noreferrer"
      className={buttonVariants({ size: "icon", variant: "ghost" })}
      aria-label="Erbium UI on GitHub"
    >
      <Icon name="github" />
    </a>
    <ThemeToggle />
  </SidebarFooter>
);

const SearchTrigger = ({ onClick, mobile = false }: { onClick: () => void; mobile?: boolean }) => (
  <Button
    variant="outline"
    onClick={onClick}
    className="w-full justify-start text-muted-foreground"
  >
    <Icon name="search-01" />
    <span className="min-w-0 flex-1 truncate text-start">Search documentation…</span>
    {!mobile && <Kbd hotkey="Mod+K" />}
  </Button>
);

const searchGroups = navigationGroups.map((group) => ({
  items: group.items.map((page) => ({ ...page, label: page.title })),
  label: group.title,
}));

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

export const Shell = ({ children }: { children: ReactNode }) => {
  // The current page stays on screen while the next one loads; this flag drives a
  // thin progress bar instead of replacing the page with a loading state.
  const navigating = useRouterState({ select: (state) => state.status === "pending" });
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useHotkey("Mod+K", () => {
    setMobileOpen(false);
    setSearchOpen((open) => !open);
  });

  const openSearch = () => {
    setMobileOpen(false);
    setSearchOpen(true);
  };

  return (
    <>
      <div className="route-progress" data-active={navigating || undefined} aria-hidden="true" />
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <SidebarProvider className="contents [--sidebar-width:var(--docs-sidebar-width)]">
        <div className="site-shell">
          <header className="mobile-site-header">
            <Brand />
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={<Button variant="ghost" size="icon" aria-label="Open navigation" />}
              >
                <SidebarToggleIcon isOpen={mobileOpen} />
              </SheetTrigger>
              <SheetPanel side="left" className="docs-mobile-panel" showCloseButton={false}>
                <SheetTitle className="sr-only">Documentation navigation</SheetTitle>
                <SheetDescription className="sr-only">
                  Browse documentation and change the theme.
                </SheetDescription>
                <div className="mobile-sidebar-search">
                  <SearchTrigger onClick={openSearch} mobile />
                </div>
                <SidebarContent className="px-3 pb-4 overscroll-contain">
                  <Navigation
                    onNavigate={() => {
                      setMobileOpen(false);
                    }}
                  />
                </SidebarContent>
                <div className="mobile-sidebar-footer">
                  <SidebarActions />
                </div>
              </SheetPanel>
            </Sheet>
          </header>
          <div className="docs-frame">
            <Sidebar collapsible="none" className="docs-sidebar bg-transparent">
              <SidebarHeader className="sidebar-heading ps-0 pe-(--docs-sidebar-inset) pt-0 pb-4">
                <Brand />
                <SearchTrigger onClick={openSearch} />
              </SidebarHeader>
              <SidebarContent className="pe-(--docs-sidebar-inset) pb-8">
                <Navigation />
              </SidebarContent>
              <SidebarActions />
            </Sidebar>
            <div className="site-page-content" aria-busy={navigating || undefined}>
              {children}
            </div>
          </div>
        </div>
      </SidebarProvider>
      <Search open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
};
