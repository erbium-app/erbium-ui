import { createContext, use, useMemo, useState } from "react";
import type { RefObject } from "react";
import {
  createMemoryHistory,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  Outlet,
  Link as RouterLink,
  RouterProvider,
  useLocation,
  useRouter,
} from "@tanstack/react-router";
import { Button } from "@erbium/ui/components/button";
import { Field, FieldLabel } from "@erbium/ui/components/field";
import { Link } from "@erbium/ui/components/link";
import { Switch } from "@erbium/ui/components/switch";
import { buttonVariants } from "@erbium/ui/lib/button-variants";

// Each page waits this long for its data, as a slow API would.
const loadTime = 900;

const wait = async (ms: number) => {
  // Browsers have no promise-based timer, so the delay wraps `setTimeout`.
  // oxlint-disable-next-line promise/avoid-new
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const pages = {
  invoices: "Invoices",
  reports: "Reports",
  settings: "Settings",
};

type PageId = keyof typeof pages;

const pageIds: PageId[] = ["reports", "invoices", "settings"];

const isPageId = (value: string): value is PageId => Object.hasOwn(pages, value);

const titleOf = (page: string) => (isPageId(page) ? pages[page] : page);

// When the latest click happened and when each page finished loading, so a page can
// report how long the user waited for it.
interface Timing {
  clickedAt: RefObject<number>;
  readyAt: Map<string, number>;
}

const TimingContext = createContext<Timing>({ clickedAt: { current: 0 }, readyAt: new Map() });

const Shell = () => {
  const router = useRouter();
  const { clickedAt } = use(TimingContext);
  const [predict, setPredict] = useState(true);
  const NavLink = predict ? Link : RouterLink;

  return (
    <div className="flex w-full max-w-md flex-col gap-group">
      <nav aria-label="Workspace" className="flex gap-related">
        {pageIds.map((page) => (
          <NavLink
            key={page}
            to="/$page"
            params={{ page }}
            className={buttonVariants({ size: "sm", variant: "ghost" })}
            activeProps={{ className: buttonVariants({ size: "sm", variant: "outline" }) }}
            onClick={() => {
              clickedAt.current = performance.now();
            }}
          >
            {pages[page]}
          </NavLink>
        ))}
      </nav>
      <div className="min-h-24 rounded-lg border border-border p-4">
        <Outlet />
      </div>
      <div className="flex items-center justify-between gap-group">
        <Field orientation="horizontal">
          <Switch checked={predict} onCheckedChange={setPredict} />
          <FieldLabel>Predict intent</FieldLabel>
        </Field>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            router.clearCache();
            void router.navigate({ to: "/" });
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

const Intro = () => (
  <p className="text-muted-foreground">
    Each page takes {loadTime} ms to load. Move to a page link and click it, then reset and try
    again with prediction off.
  </p>
);

const rootRoute = createRootRouteWithContext<Pick<Timing, "readyAt">>()({ component: Shell });

const indexRoute = createRoute({ component: Intro, getParentRoute: () => rootRoute, path: "/" });

const pageRoute = createRoute({
  getParentRoute: () => rootRoute,
  loader: async ({ context, params }) => {
    await wait(loadTime);
    context.readyAt.set(params.page, performance.now());
  },
  path: "/$page",
});

const useCurrentPage = () => useLocation({ select: (location) => location.pathname.slice(1) });

const PagePending = () => (
  <p className="text-muted-foreground">Loading {titleOf(useCurrentPage())}…</p>
);

const Page = () => {
  const page = useCurrentPage();
  const { clickedAt, readyAt } = use(TimingContext);
  const waited = Math.round((readyAt.get(page) ?? 0) - clickedAt.current);

  return (
    <div className="flex flex-col gap-related">
      <h3 className="text-subtitle">{titleOf(page)}</h3>
      <p className="text-caption text-muted-foreground" aria-live="polite">
        {waited > 0
          ? `Loaded ${waited} ms after the click.`
          : `Ready ${-waited} ms before the click, so it opened at once.`}
      </p>
    </div>
  );
};

pageRoute.update({ component: Page, pendingComponent: PagePending });

const routeTree = rootRoute.addChildren([indexRoute, pageRoute]);

const LinkDemo = () => {
  const timing = useMemo<Timing>(() => ({ clickedAt: { current: 0 }, readyAt: new Map() }), []);

  const router = useMemo(
    () =>
      createRouter({
        context: { readyAt: timing.readyAt },
        defaultPendingMs: 0,
        defaultPreload: "intent",
        history: createMemoryHistory({ initialEntries: ["/"] }),
        routeTree,
      }),
    [timing],
  );

  return (
    <TimingContext value={timing}>
      <RouterProvider router={router} />
    </TimingContext>
  );
};

export default LinkDemo;
