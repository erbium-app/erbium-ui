import { createContext, use, useMemo, useState } from "react";
import {
  createMemoryHistory,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  Link as RouterLink,
  RouterProvider,
  useLocation,
} from "@tanstack/react-router";
import { Field, FieldLabel } from "@erbium/ui/components/field";
import { Link } from "@erbium/ui/components/link";
import { Pagination, PaginationControls } from "@erbium/ui/components/pagination";
import { Switch } from "@erbium/ui/components/switch";

// Each page waits this long for its data, as a slow API would.
const loadTime = 900;
const pageSize = 4;
const rowCount = 42;
const pageCount = Math.ceil(rowCount / pageSize);

const wait = async (ms: number) => {
  // Browsers have no promise-based timer, so the delay wraps `setTimeout`.
  // oxlint-disable-next-line promise/avoid-new
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const toPage = (value: number) => (Number.isInteger(value) && value >= 1 ? value : 1);

const rowsOf = (page: number) =>
  Array.from({ length: pageSize }, (_, index) => (page - 1) * pageSize + index + 1)
    .filter((row) => row <= rowCount)
    .map((row) => `INV${String(row).padStart(3, "0")}`);

// When the latest click happened and when each page finished loading, so a page can
// report how long the user waited for it.
interface Timing {
  clickedAt: () => number;
  markClick: () => void;
  readyAt: Map<number, number>;
}

const createTiming = (): Timing => {
  let clickedAt = 0;

  return {
    clickedAt: () => clickedAt,
    markClick: () => {
      clickedAt = performance.now();
    },
    readyAt: new Map(),
  };
};

const TimingContext = createContext<Timing>(createTiming());

const statusOf = (page: number, { clickedAt, readyAt }: Timing) => {
  if (clickedAt() === 0) {
    return `Each page takes ${loadTime} ms to load.`;
  }

  const waited = Math.round((readyAt.get(page) ?? 0) - clickedAt());

  return waited > 0
    ? `Page ${page} loaded ${waited} ms after the click.`
    : `Page ${page} was ready ${-waited} ms before the click.`;
};

const PredictContext = createContext(true);

const useCurrentPage = () =>
  useLocation({
    select: (location) => toPage(Number(new URLSearchParams(location.searchStr).get("page") ?? 1)),
  });

const Controls = () => {
  const page = useCurrentPage();
  const predict = use(PredictContext);
  const { markClick } = use(TimingContext);
  const PageLink = predict ? Link : RouterLink;

  return (
    <Pagination onClickCapture={markClick}>
      <PaginationControls
        page={page}
        pageCount={pageCount}
        renderLink={(target) => <PageLink to="/" search={{ page: target }} />}
      />
    </Pagination>
  );
};

const Invoices = () => {
  const page = useCurrentPage();
  const timing = use(TimingContext);

  return (
    <div className="flex flex-col gap-group">
      <ul className="flex flex-col gap-related rounded-lg border border-border p-4 tabular-nums">
        {rowsOf(page).map((invoice) => (
          <li key={invoice}>{invoice}</li>
        ))}
      </ul>
      <Controls />
      <p className="text-center text-caption text-muted-foreground" aria-live="polite">
        {statusOf(page, timing)}
      </p>
    </div>
  );
};

const InvoicesPending = () => (
  <div className="flex flex-col gap-group">
    <p className="rounded-lg border border-border p-4 text-muted-foreground">Loading…</p>
    <Controls />
  </div>
);

const rootRoute = createRootRouteWithContext<Pick<Timing, "readyAt">>()({});

const invoicesRoute = createRoute({
  component: Invoices,
  getParentRoute: () => rootRoute,
  // The page is a search param, so each page is its own loader entry and cache key.
  loader: async ({ context, deps }) => {
    await wait(loadTime);
    context.readyAt.set(deps.page, performance.now());
  },
  loaderDeps: ({ search }: { search: { page: number } }) => ({ page: search.page }),
  path: "/",
  pendingComponent: InvoicesPending,
  validateSearch: ({ page }: { page?: number }) => ({ page: toPage(page ?? 1) }),
});

const routeTree = rootRoute.addChildren([invoicesRoute]);

export default function PaginationRouterExample() {
  const [predict, setPredict] = useState(true);
  const timing = useMemo(() => createTiming(), []);

  const router = useMemo(
    () =>
      createRouter({
        context: { readyAt: timing.readyAt },
        defaultPendingMs: 0,
        defaultPreload: "intent",
        history: createMemoryHistory({ initialEntries: ["/?page=1"] }),
        routeTree,
      }),
    [timing],
  );

  return (
    <div className="flex w-full max-w-md flex-col gap-group">
      <TimingContext value={timing}>
        <PredictContext value={predict}>
          <RouterProvider router={router} />
        </PredictContext>
      </TimingContext>
      <Field orientation="horizontal" className="justify-center">
        <Switch checked={predict} onCheckedChange={setPredict} />
        <FieldLabel>Predict intent</FieldLabel>
      </Field>
    </div>
  );
}
