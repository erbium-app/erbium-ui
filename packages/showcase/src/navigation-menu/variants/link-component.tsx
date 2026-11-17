import { useMemo } from "react";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { Link } from "@erbium/ui/components/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@erbium/ui/components/navigation-menu";

const Navigation = () => (
  <div className="flex flex-col items-center gap-related">
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink render={<Link to="/" activeOptions={{ exact: true }} />}>
            Home
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink render={<Link to="/docs" />}>Documentation</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
    <Outlet />
  </div>
);

const rootRoute = createRootRoute({ component: Navigation });

const routeTree = rootRoute.addChildren([
  createRoute({ component: () => <p>Home page</p>, getParentRoute: () => rootRoute, path: "/" }),
  createRoute({
    component: () => <p>Documentation page</p>,
    getParentRoute: () => rootRoute,
    path: "/docs",
  }),
]);

export default function NavigationMenuLinkComponentExample() {
  const router = useMemo(
    () => createRouter({ defaultPreload: "intent", history: createMemoryHistory(), routeTree }),
    [],
  );

  return <RouterProvider router={router} />;
}
