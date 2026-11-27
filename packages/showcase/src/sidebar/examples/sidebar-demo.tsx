import { Icon } from "@erbium/ui/components/icon";
import type { IconProps } from "@erbium/ui/components/icon";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
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
} from "@erbium/ui/components/sidebar";

export interface SidebarExampleProps {
  side?: "left" | "right";
  variant?: "sidebar" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
  defaultOpen?: boolean;
}

const main = [
  { badge: 4, icon: "inbox", label: "Inbox" },
  { current: true, icon: "folder-open", label: "Projects" },
  { icon: "settings-01", label: "Settings" },
] satisfies { badge?: number; current?: boolean; icon: IconProps["name"]; label: string }[];

const projects = [
  { icon: "frame", label: "Design Engineering" },
  { icon: "pie-chart", label: "Sales & Marketing" },
  { icon: "map", label: "Travel" },
] satisfies { icon: IconProps["name"]; label: string }[];

export default function SidebarExample({
  side = "left",
  variant = "sidebar",
  collapsible = "icon",
  defaultOpen = true,
}: SidebarExampleProps) {
  return (
    // The provider fills the viewport by default. Here it fills its container, at least 24rem
    // tall, and the sidebar is positioned inside it instead of against the viewport.
    <SidebarProvider
      key={String(defaultOpen)}
      defaultOpen={defaultOpen}
      className="relative h-full min-h-96 overflow-hidden rounded-lg border contain-layout"
    >
      <Sidebar
        side={side}
        variant={variant}
        collapsible={collapsible}
        // A collapsible sidebar is fixed to the viewport by default; this one stays in the frame.
        className={collapsible === "none" ? undefined : "absolute h-full"}
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Erbium">
                <img
                  alt=""
                  src="https://ui.erbium.app/brand/erbium-logo-light.svg"
                  className="size-4 dark:hidden"
                />
                <img
                  alt=""
                  src="https://ui.erbium.app/brand/erbium-logo-dark.svg"
                  className="hidden size-4 dark:block"
                />
                <span>Erbium</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {main.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      tooltip={item.label}
                      aria-current={"current" in item ? "page" : undefined}
                    >
                      <Icon name={item.icon} />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                    {"badge" in item && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {projects.map((project) => (
                  <SidebarMenuItem key={project.label}>
                    <SidebarMenuButton tooltip={project.label}>
                      <Icon name={project.icon} />
                      <span>{project.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <span className="truncate px-2 text-control-sm text-muted-foreground">
            ada@erbium.app
          </span>
        </SidebarFooter>
        {collapsible !== "none" && <SidebarRail />}
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-related border-b px-3">
          {collapsible !== "none" && <SidebarTrigger side={side} />}
          <span className="text-control">Projects</span>
        </header>
        <div className="p-6 text-body text-muted-foreground">Three projects are on track.</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
