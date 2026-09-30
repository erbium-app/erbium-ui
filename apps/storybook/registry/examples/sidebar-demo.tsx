// @ts-nocheck
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../components/collapsible";
import { StatefulChevron } from "../components/stateful-icon";
import { Separator } from "../components/separator";
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
} from "../components/sidebar";
export default function Demo() {
  return (
    <SidebarProvider defaultOpen>
      <div className="relative h-64 w-80 overflow-hidden border">
        <Sidebar collapsible="none">
          <SidebarContent>
            <Collapsible defaultOpen className="group group/workspace">
              <SidebarGroup>
                <SidebarGroupLabel
                  className="hover:bg-sidebar-accent data-panel-open:rounded-b-none [&:has(+_[data-slot=collapsible-content]:not([hidden]))]:rounded-b-none"
                  render={<CollapsibleTrigger />}
                >
                  Workspace
                  <StatefulChevron className="ms-auto" />
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
