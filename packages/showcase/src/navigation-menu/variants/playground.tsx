import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@erbium/ui/components/navigation-menu";

export const defaultProps = { align: "start", orientation: "horizontal" } satisfies {
  orientation: "horizontal" | "vertical";
  align: "start" | "center" | "end";
};

export default function NavigationMenuPlaygroundExample(
  args: {
    orientation: "horizontal" | "vertical";
    align: "start" | "center" | "end";
  } = defaultProps,
) {
  return (
    <NavigationMenu orientation={args.orientation} align={args.align}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="#">Overview</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Guides</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="#">Getting started</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
