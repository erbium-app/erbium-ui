import { useMemo } from "react";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@erbium/ui/components/breadcrumb";
import { Link } from "@erbium/ui/components/link";

const Settings = () => (
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink render={<Link to="/projects" activeOptions={{ exact: true }} />}>
          Projects
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Settings</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
);

const Projects = () => (
  <div className="flex flex-col gap-related">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>Projects</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <Link to="/projects/settings" className="text-caption underline">
      Open settings
    </Link>
  </div>
);

const rootRoute = createRootRoute();

const routeTree = rootRoute.addChildren([
  createRoute({ component: Projects, getParentRoute: () => rootRoute, path: "/projects" }),
  createRoute({
    component: Settings,
    getParentRoute: () => rootRoute,
    path: "/projects/settings",
  }),
]);

export const BreadcrumbLinkDemo = () => {
  const router = useMemo(
    () =>
      createRouter({
        defaultPreload: "intent",
        history: createMemoryHistory({ initialEntries: ["/projects/settings"] }),
        routeTree,
      }),
    [],
  );

  return <RouterProvider router={router} />;
};
