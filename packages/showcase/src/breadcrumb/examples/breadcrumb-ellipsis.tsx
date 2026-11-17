import { useId, useMemo, useState } from "react";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  useLocation,
} from "@tanstack/react-router";
import { Breadcrumb } from "@erbium/ui/components/breadcrumb";
import { Link } from "@erbium/ui/components/link";
import { Slider } from "@erbium/ui/components/slider";

const pages = [
  { label: "Home", path: "/" },
  { label: "Workspace", path: "/workspace" },
  { label: "Projects", path: "/workspace/projects" },
  { label: "Website", path: "/workspace/projects/website" },
  { label: "Settings", path: "/workspace/projects/website/settings" },
] as const;

const settings = pages[4].path;

const BreadcrumbDemoPage = () => {
  const path = useLocation({ select: (location) => location.pathname });
  const index = pages.findIndex((page) => page.path === path);
  const currentPage = pages[index]?.label ?? "Home";

  const items = pages.slice(0, index).map(({ label, path: to }) => ({
    id: to,
    label,
    render: <Link to={to} activeOptions={{ exact: true }} />,
  }));

  return (
    <div className="flex min-w-0 flex-col gap-related">
      <Breadcrumb items={items} currentPage={currentPage} />
      <div className="flex flex-wrap items-center justify-between gap-2 text-caption">
        <span aria-live="polite">Current page: {currentPage}</span>
        {path !== settings && (
          <Link to={settings} className="underline">
            Back to Settings
          </Link>
        )}
      </div>
    </div>
  );
};

const rootRoute = createRootRoute();

const routeTree = rootRoute.addChildren(
  pages.map(({ path }) =>
    createRoute({ component: BreadcrumbDemoPage, getParentRoute: () => rootRoute, path }),
  ),
);

const BreadcrumbDemoRouter = () => {
  const router = useMemo(
    () =>
      createRouter({
        history: createMemoryHistory({ initialEntries: [settings] }),
        routeTree,
      }),
    [],
  );

  return <RouterProvider router={router} />;
};

export default function BreadcrumbEllipsisExample() {
  const [width, setWidth] = useState(310);
  const widthId = useId();

  return (
    <div className="flex w-lg max-w-full flex-col gap-section">
      <div className="flex flex-col gap-2">
        <span id={widthId} className="text-caption">
          Breadcrumb width: {width} px
        </span>
        <Slider
          aria-labelledby={widthId}
          min={100}
          max={480}
          value={width}
          onValueChange={(value) => {
            const [next] = [value].flat();

            if (next !== undefined) {
              setWidth(next);
            }
          }}
        />
      </div>
      <div className="max-w-full rounded-lg border p-2" style={{ width: width + 18 }}>
        <BreadcrumbDemoRouter />
      </div>
    </div>
  );
}
