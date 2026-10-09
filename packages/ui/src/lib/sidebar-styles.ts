import { cva } from "class-variance-authority";

export const sidebarStyles = {
  header: "flex flex-col gap-2 p-2",
  group: "relative flex w-full min-w-0 flex-col p-2",
  groupLabel:
    "flex h-8 shrink-0 items-center rounded-md px-2 text-control-sm font-medium text-sidebar-foreground/70 outline-hidden focus-visible:bg-sidebar-accent focus-visible:text-sidebar-accent-foreground transition-[margin,opacity] duration-200 ease-linear group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 [&>svg]:size-4 [&>svg]:shrink-0",
  groupContent: "w-full text-control",
  menu: "flex w-full min-w-0 flex-col gap-0",
  menuItem: "group/menu-item relative",
} as const;

const sidebarMenuButtonVariants = cva(
  "peer/menu-button group/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-start text-control outline-hidden focus-visible:bg-sidebar-accent focus-visible:text-sidebar-accent-foreground transition-sidebar-size group-has-data-[sidebar=menu-action]/menu-item:pe-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:font-medium data-active:text-sidebar-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-sidebar-outline hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-sidebar-outline-hover",
      },
      size: {
        default: "h-8 text-control",
        sm: "h-7 text-control-sm",
        lg: "h-12 text-control group-data-[collapsible=icon]:p-0!",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export { sidebarMenuButtonVariants };
