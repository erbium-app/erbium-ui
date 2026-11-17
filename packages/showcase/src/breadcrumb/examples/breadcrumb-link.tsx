import { useMemo } from "react";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
  trimPathRight,
  useMatches,
} from "@tanstack/react-router";
import { Breadcrumb } from "@erbium/ui/components/breadcrumb";
import { Link } from "@erbium/ui/components/link";

declare module "@tanstack/react-router" {
  interface StaticDataRouteOption {
    breadcrumb?: string;
  }
}

const RouteBreadcrumb = () => {
  const matches = useMatches();
  const labels = new Map<string, string>();

  for (const match of matches) {
    const label = match.staticData.breadcrumb;

    if (label !== undefined) {
      labels.set(trimPathRight(match.pathname), label);
    }
  }

  const leaf = matches.at(-1);

  if (!leaf) {
    return null;
  }

  const currentPath = trimPathRight(leaf.pathname);
  const currentPage = labels.get(currentPath);

  if (currentPage === undefined) {
    return null;
  }

  labels.delete(currentPath);

  return (
    <Breadcrumb
      items={[...labels].map(([to, label]) => ({
        id: to,
        label,
        render: <Link to={to} activeOptions={{ exact: true }} />,
      }))}
      currentPage={currentPage}
    />
  );
};

const Layout = () => (
  <div className="flex min-w-0 flex-col gap-related">
    <RouteBreadcrumb />
    <Outlet />
  </div>
);

const ProjectsIndex = () => (
  <Link to="/projects/settings" className="text-caption underline">
    Open settings
  </Link>
);

const rootRoute = createRootRoute({ component: Layout });

const projectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "projects",
  staticData: { breadcrumb: "Projects" },
});

const routeTree = rootRoute.addChildren([
  projectsRoute.addChildren([
    createRoute({ component: ProjectsIndex, getParentRoute: () => projectsRoute, path: "/" }),
    createRoute({
      getParentRoute: () => projectsRoute,
      path: "settings",
      staticData: { breadcrumb: "Settings" },
    }),
  ]),
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
