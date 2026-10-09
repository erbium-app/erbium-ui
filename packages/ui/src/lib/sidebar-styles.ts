import { cva } from "class-variance-authority";

export const sidebarStyles = {
  header: "flex flex-col gap-related p-2",
  group: "relative flex w-full min-w-0 flex-col p-2",
  groupLabel:
    "flex min-h-control shrink-0 items-center rounded-md px-2 text-control-sm font-medium text-sidebar-foreground/70 outline-hidden focus-visible:bg-sidebar-accent focus-visible:text-sidebar-accent-foreground transition-[margin,opacity] duration-200 ease-linear group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 [&>svg]:size-4 [&>svg]:shrink-0",
  groupContent: "w-full text-control-sm",
  menu: "flex w-full min-w-0 flex-col gap-0",
  menuItem: "group/menu-item relative",
} as const;

const sidebarMenuButtonVariants = cva(
  "peer/menu-button group/menu-button flex w-full items-center gap-related overflow-hidden rounded-md p-2 text-start text-control-sm outline-hidden focus-visible:bg-sidebar-accent focus-visible:text-sidebar-accent-foreground transition-sidebar-size group-has-data-[sidebar=menu-action]/menu-item:pe-8 group-data-[collapsible=icon]:size-control! group-data-[collapsible=icon]:p-2! hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:font-medium data-active:text-sidebar-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-sidebar-outline hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-sidebar-outline-hover",
      },
      size: {
        default: "control-size control-adaptive text-control-sm",
        sm: "control-size-sm control-adaptive text-control-sm",
        lg: "control-size-lg control-adaptive text-control group-data-[collapsible=icon]:p-0!",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export { sidebarMenuButtonVariants };
