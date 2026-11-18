import { useMemo } from "react";
import {
  createMemoryHistory,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import {
  AppShell,
  AppShellActions,
  AppShellBreadcrumbs,
  AppShellContent,
  AppShellHeader,
  AppShellNav,
  AppShellNavAction,
  AppShellNavLink,
  AppShellNavSection,
  AppShellSidebar,
  AppShellSidebarFooter,
  AppShellSidebarHeader,
  AppShellSurface,
} from "@erbium/ui/blocks/app-shell";
import type { AppShellSidebarMode } from "@erbium/ui/blocks/app-shell";
import { Button } from "@erbium/ui/components/button";
import { Icon } from "@erbium/ui/components/icon";
import { Link } from "@erbium/ui/components/link";

// Each project waits this long for its data, as a slow API would.
const loadTime = 600;

interface Project {
  id: string;
  name: string;
}

interface ShellContext {
  sidebar: AppShellSidebarMode;
}

// The example's router is not registered, so its hooks read through typed selectors.
const selectSidebar = (context: ShellContext) => context.sidebar;
const selectProject = (data: { project: Project }) => data.project;

const projects: readonly [Project, ...Project[]] = [
  { id: "atlas", name: "Atlas redesign" },
  { id: "beacon", name: "Beacon onboarding" },
  { id: "comet", name: "Comet billing" },
];

const wait = async (ms: number) => {
  // Browsers have no promise-based timer, so the delay wraps `setTimeout`.
  // oxlint-disable-next-line promise/avoid-new
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const Page = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col gap-group p-6">{children}</div>
);

const Navigation = () => (
  <AppShellSidebar className="h-full">
    <AppShellSidebarHeader>
      <span className="px-2 text-control">Acme</span>
    </AppShellSidebarHeader>
    <AppShellNav label="Main">
      <AppShellNavSection>
        <AppShellNavLink
          to="/"
          activeOptions={{ exact: true }}
          icon={<Icon name="inbox" />}
          label="Inbox"
          badge={4}
        />
        <AppShellNavLink to="/projects" icon={<Icon name="folder-open" />} label="Projects" />
      </AppShellNavSection>
      <AppShellNavSection label="Workspace">
        <AppShellNavLink to="/settings" icon={<Icon name="settings-01" />} label="Settings" />
        <AppShellNavAction icon={<Icon name="plus" />} label="New project" />
      </AppShellNavSection>
    </AppShellNav>
    <AppShellSidebarFooter>
      <span className="px-2 text-control-sm text-muted-foreground">ada@acme.dev</span>
    </AppShellSidebarFooter>
  </AppShellSidebar>
);

const ProjectActions = () => (
  <Button variant="outline" size="sm">
    <Icon name="share-01" />
    Share
  </Button>
);

const Shell = (): React.ReactElement => {
  const sidebar = shellRoute.useRouteContext({ select: selectSidebar });

  return (
    // The frame contains the shell for this preview. In an app, the shell fills the viewport.
    <div className="relative h-144 w-full overflow-hidden rounded-lg border contain-layout">
      <AppShell sidebar={sidebar} storageKey={null} className="h-full min-h-0">
        <Navigation />
        <AppShellSurface>
          <AppShellHeader>
            <AppShellBreadcrumbs />
            <AppShellActions />
          </AppShellHeader>
          <AppShellContent>
            <Outlet />
          </AppShellContent>
        </AppShellSurface>
      </AppShell>
    </div>
  );
};

const ProjectPage = (): React.ReactElement => {
  const project = projectRoute.useLoaderData({ select: selectProject });

  return (
    <Page>
      <p className="text-body">{project.name} is on track.</p>
    </Page>
  );
};

const rootRoute = createRootRouteWithContext<ShellContext>()({
  component: Outlet,
});

const shellRoute = createRoute({
  component: Shell,
  getParentRoute: () => rootRoute,
  id: "shell",
});

const inboxRoute = createRoute({
  component: () => (
    <Page>
      <p className="text-body">Four unread messages.</p>
    </Page>
  ),
  getParentRoute: () => shellRoute,
  path: "/",
  staticData: { crumb: "Inbox" },
});

const projectsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "projects",
  staticData: { crumb: "Projects" },
});

const projectsIndexRoute = createRoute({
  component: () => (
    <Page>
      <ul className="flex flex-col gap-related">
        {projects.map((project) => (
          <li key={project.id}>
            <Link
              to="/projects/$projectId"
              params={{ projectId: project.id }}
              className="text-link underline-offset-4 hover:underline"
            >
              {project.name}
            </Link>
          </li>
        ))}
      </ul>
    </Page>
  ),
  getParentRoute: () => projectsRoute,
  path: "/",
});

const projectRoute = createRoute({
  component: ProjectPage,
  getParentRoute: () => projectsRoute,
  // Returning `crumb` names the route from its data, so the header shows the project's name.
  loader: async ({ params }) => {
    await wait(loadTime);

    const project = projects.find(({ id }) => id === params.projectId) ?? projects[0];

    return { crumb: project.name, project };
  },
  path: "$projectId",
  staticData: { actions: ProjectActions },
});

const settingsRoute = createRoute({
  component: () => (
    <Page>
      <p className="text-body">Workspace settings.</p>
    </Page>
  ),
  getParentRoute: () => shellRoute,
  path: "settings",
  staticData: { crumb: "Settings" },
});

const routeTree = rootRoute.addChildren([
  shellRoute.addChildren([
    inboxRoute,
    projectsRoute.addChildren([projectsIndexRoute, projectRoute]),
    settingsRoute,
  ]),
]);

export default function AppShellExample({
  sidebar = "resizable",
}: {
  sidebar?: AppShellSidebarMode;
}) {
  const router = useMemo(
    () =>
      createRouter({
        context: { sidebar },
        defaultPreload: "intent",
        history: createMemoryHistory({ initialEntries: ["/projects/atlas"] }),
        routeTree,
      }),
    [sidebar],
  );

  return <RouterProvider router={router} />;
}
