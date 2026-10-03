import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@erbium/ui/components/navigation-menu";

const Example = (args: {
  orientation: "horizontal" | "vertical";
  align: "start" | "center" | "end";
}) => (
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

export default Example;
