import {
  SidebarProvider,
  SidebarTrigger,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  Sidebar,
} from "@erbium/ui/components/sidebar";

export const defaultProps = {
  collapsible: "none",
  defaultOpen: true,
  side: "left",
  variant: "sidebar",
} satisfies {
  side: "left" | "right";
  variant: "sidebar" | "inset";
  collapsible: "offcanvas" | "icon" | "none";
  defaultOpen: boolean;
};

export default function SidebarPlaygroundExample(
  args: {
    side: "left" | "right";
    variant: "sidebar" | "inset";
    collapsible: "offcanvas" | "icon" | "none";
    defaultOpen: boolean;
  } = defaultProps,
) {
  return (
    <SidebarProvider key={String(args.defaultOpen)} defaultOpen={args.defaultOpen}>
      <SidebarTrigger side={args.side} />
      <div className="relative h-64 w-80 overflow-hidden rounded border">
        <Sidebar side={args.side} variant={args.variant} collapsible={args.collapsible}>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Workspace</SidebarGroupLabel>
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
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </div>
    </SidebarProvider>
  );
}
