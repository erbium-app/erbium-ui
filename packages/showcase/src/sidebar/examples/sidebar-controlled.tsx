import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import FrameIcon from "@hugeicons/core-free-icons/FrameIcon";
import LifebuoyIcon from "@hugeicons/core-free-icons/LifebuoyIcon";
import MapIcon from "@hugeicons/core-free-icons/MapIcon";
import PieChartIcon from "@hugeicons/core-free-icons/PieChartIcon";
import SendIcon from "@hugeicons/core-free-icons/SendIcon";

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
    name: "Design Engineering",
    url: "#",
    icon: FrameIcon,
  },
  {
    name: "Sales & Marketing",
    url: "#",
    icon: PieChartIcon,
  },
  {
    name: "Travel",
    url: "#",
    icon: MapIcon,
  },
  {
    name: "Support",
    url: "#",
    icon: LifebuoyIcon,
  },
  {
    name: "Feedback",
    url: "#",
    icon: SendIcon,
  },
];

function ControlledSidebarTrigger() {
  const { isMobile, open, openMobile } = useSidebar();
  const isOpen = isMobile ? openMobile : open;

  return (
    <SidebarTrigger size="sm">
      <span>{isOpen ? "Close" : "Open"} Sidebar</span>
    </SidebarTrigger>
  );
}

export default function AppSidebar() {
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
                      <HugeiconsIcon icon={project.icon} />
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
}
