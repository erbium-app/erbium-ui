import { useMemo } from "react";
import type { ReactElement } from "react";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
  useLocation,
} from "@tanstack/react-router";
import {
  DataTable,
  DataTableContent,
  DataTableFilters,
  DataTableToolbar,
} from "@erbium/ui/blocks/data-table";
import { Badge } from "@erbium/ui/components/badge";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@erbium/ui/components/input-group";
import { Link } from "@erbium/ui/components/link";
import {
  createDataTableColumnHelper,
  useDataTable,
  useDataTableSearchParams,
} from "@erbium/ui/hooks/use-data-table";
import { validateDataTableSearch } from "@erbium/ui/lib/data-table-search";
import type { DataTableSearchParams } from "@erbium/ui/lib/data-table-search";
import { labelOf, priorityOptions, priorityVariant, statusOptions, tasks } from "../data";
import type { Task } from "../data";

const columnHelper = createDataTableColumnHelper<Task>();

const columns = columnHelper.columns([
  columnHelper.accessor("title", {
    header: "Title",
    meta: { filter: { icon: "file-text", label: "Title", type: "text" } },
  }),
  columnHelper.accessor("status", {
    cell: (info) => labelOf(statusOptions, info.getValue()),
    header: "Status",
    meta: {
      filter: {
        icon: "circle-check",
        label: "Status",
        options: statusOptions,
        type: "option",
      },
    },
  }),
  columnHelper.accessor("priority", {
    cell: (info) => (
      <Badge variant={priorityVariant[info.getValue()]}>
        {labelOf(priorityOptions, info.getValue())}
      </Badge>
    ),
    header: "Priority",
    meta: {
      filter: {
        icon: "arrow-up-down",
        label: "Priority",
        options: priorityOptions,
        type: "option",
      },
    },
  }),
  columnHelper.accessor("estimate", {
    cell: (info) => <span className="tabular-nums">{info.getValue()} h</span>,
    header: "Estimate",
    meta: { align: "end", filter: { label: "Estimate", step: 1, type: "number" } },
    size: 104,
  }),
]);

// One config for the route and the table, so both read the URL the same way.
const tasksTable = { columns };

// The return type breaks the inference cycle between the page and the route it reads from.
const Tasks = (): ReactElement => {
  // The URL is the only copy of the query. Each change replaces the history entry, so typing in
  // a text filter does not add a step to Back.
  const [query, setQuery] = useDataTableSearchParams(tasksTable);
  const table = useDataTable({ columns, data: tasks, onQueryChange: setQuery, query });

  return (
    <DataTable table={table}>
      <DataTableToolbar>
        <DataTableFilters />
      </DataTableToolbar>
      <DataTableContent />
    </DataTable>
  );
};

// Shared links: each one is a filtered view of the same page.
const savedViews: { label: string; search: DataTableSearchParams }[] = [
  { label: "Open high priority", search: { priority: "high", status: "todo,in-progress" } },
  {
    label: "Quick wins",
    search: { estimate: "lessThanOrEqual.3", status: "isNoneOf.done,canceled" },
  },
  { label: "Docs work", search: { title: "document" } },
];

const Shell = () => {
  const href = useLocation({ select: (location) => location.href });

  return (
    <div className="flex w-full min-w-72 max-w-4xl flex-col gap-group p-4">
      <InputGroup>
        <InputGroupAddon>
          <span className="text-caption text-muted-foreground">URL</span>
        </InputGroupAddon>
        <InputGroupInput aria-label="Current URL" readOnly value={decodeURIComponent(href)} />
      </InputGroup>
      <nav aria-label="Saved views" className="flex flex-wrap gap-group text-caption">
        {savedViews.map((view) => (
          <Link key={view.label} to="/tasks" search={view.search}>
            {view.label}
          </Link>
        ))}
      </nav>
      <Outlet />
    </div>
  );
};

const rootRoute = createRootRoute({ component: Shell });

const tasksRoute = createRoute({
  component: Tasks,
  getParentRoute: () => rootRoute,
  path: "/tasks",
  // Only params that fit the columns reach the page, written in their normal form.
  validateSearch: validateDataTableSearch(tasksTable),
});

const routeTree = rootRoute.addChildren([tasksRoute]);

// A memory history keeps the example inside the page; an app's router uses the browser's URL.
const createExampleRouter = () =>
  createRouter({
    history: createMemoryHistory({ initialEntries: ["/tasks?status=todo,in-progress"] }),
    routeTree,
  });

export default function FiltersRouterExample() {
  const router = useMemo(() => createExampleRouter(), []);

  return <RouterProvider router={router} />;
}
