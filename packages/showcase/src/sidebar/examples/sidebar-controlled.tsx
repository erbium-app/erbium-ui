import { Icon } from "@erbium/ui/components/icon";
import type { IconProps } from "@erbium/ui/components/icon";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@erbium/ui/components/sidebar";

const projects = [
  {
    icon: "frame",
    name: "Design Engineering",
    url: "#",
  },
  {
    icon: "pie-chart",
    name: "Sales & Marketing",
    url: "#",
  },
  {
    icon: "map",
    name: "Travel",
    url: "#",
  },
  {
    icon: "lifebuoy",
    name: "Support",
    url: "#",
  },
  {
    icon: "send",
    name: "Feedback",
    url: "#",
  },
] satisfies ({ icon: IconProps["name"] } & Record<string, unknown>)[];

const ControlledSidebarTrigger = () => {
  const { isMobile, open, openMobile } = useSidebar();
  const isOpen = isMobile ? openMobile : open;

  return (
    <SidebarTrigger size="sm">
      <span>{isOpen ? "Close" : "Open"} Sidebar</span>
    </SidebarTrigger>
  );
};

const AppSidebar = () => {
  const [open, setOpen] = React.useState(true);

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {projects.map((project) => (
                  <SidebarMenuItem key={project.name}>
                    <SidebarMenuButton render={<a href={project.url} />}>
                      <Icon name={project.icon} />
                      <span>{project.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center justify-between px-4">
          <ControlledSidebarTrigger />
        </header>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppSidebar;
