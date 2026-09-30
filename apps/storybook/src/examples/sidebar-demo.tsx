import { HugeiconsIcon } from "@hugeicons/react";
import ChevronDownIcon from "@hugeicons/core-free-icons/ChevronDownIcon";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@erbium/ui/components/collapsible";
import { Separator } from "@erbium/ui/components/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@erbium/ui/components/sidebar";
export default function Demo() {
  return (
    <SidebarProvider defaultOpen>
      <div className="relative h-64 w-80 overflow-hidden border">
        <Sidebar collapsible="none">
          <SidebarContent>
            <Collapsible defaultOpen className="group/workspace">
              <SidebarGroup>
                <SidebarGroupLabel
                  className="hover:bg-sidebar-accent data-panel-open:rounded-b-none [&:has(+_[data-slot=collapsible-content]:not([hidden]))]:rounded-b-none"
                  render={<CollapsibleTrigger />}
                >
                  Workspace
                  <HugeiconsIcon
                    icon={ChevronDownIcon}
                    aria-hidden="true"
                    className="ms-auto transition-transform duration-200 group-data-open/workspace:rotate-180 motion-reduce:transition-none"
                  />
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <Separator />
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton>Overview</SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton>Settings</SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          </SidebarContent>
        </Sidebar>
      </div>
    </SidebarProvider>
  );
}
