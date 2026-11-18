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
  DataTablePagination,
  DataTableSearch,
  DataTableToolbar,
  DataTableViewOptions,
} from "@erbium/ui/blocks/data-table";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@erbium/ui/components/input-group";
import { Link } from "@erbium/ui/components/link";
import { useDataTable, useDataTableSearchParams } from "@erbium/ui/hooks/use-data-table";
import { validateDataTableSearch } from "@erbium/ui/lib/data-table-search";
import type { DataTableSearchParams } from "@erbium/ui/lib/data-table-search";
import { invoiceColumns, invoiceSorting, invoices } from "../helpers";

// One config for the route and the table, so both read the URL the same way.
const invoicesTable = { columns: invoiceColumns, defaultSorting: invoiceSorting };

// The return type breaks the inference cycle between the page and the route it reads from.
const Invoices = (): ReactElement => {
  const [query, setQuery] = useDataTableSearchParams(invoicesTable);

  const table = useDataTable({
    ...invoicesTable,
    data: invoices,
    onQueryChange: setQuery,
    query,
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar>
        <DataTableSearch placeholder="Search invoices" />
        <DataTableFilters />
        <DataTableViewOptions />
      </DataTableToolbar>
      <DataTableContent />
      <DataTablePagination />
    </DataTable>
  );
};

// Shared links: each one is a view of the same table.
const savedViews: { label: string; search: DataTableSearchParams }[] = [
  { label: "Overdue", search: { status: "overdue" } },
  { label: "Largest first", search: { sort: "amount.desc" } },
  { label: "Maya's paid invoices", search: { q: "maya", status: "paid" } },
];

const Shell = () => {
  const href = useLocation({ select: (location) => location.href });

  return (
    <div className="flex w-full min-w-72 flex-col gap-group p-4">
      <InputGroup>
        <InputGroupAddon>
          <span className="text-caption text-muted-foreground">URL</span>
        </InputGroupAddon>
        <InputGroupInput aria-label="Current URL" readOnly value={decodeURIComponent(href)} />
      </InputGroup>
      <nav aria-label="Saved views" className="flex flex-wrap gap-group text-caption">
        {savedViews.map((view) => (
          <Link key={view.label} to="/invoices" search={view.search}>
            {view.label}
          </Link>
        ))}
      </nav>
      <Outlet />
    </div>
  );
};

const rootRoute = createRootRoute({ component: Shell });

const invoicesRoute = createRoute({
  component: Invoices,
  getParentRoute: () => rootRoute,
  path: "/invoices",
  validateSearch: validateDataTableSearch(invoicesTable),
});

const routeTree = rootRoute.addChildren([invoicesRoute]);

// A memory history keeps the example inside the page; an app's router uses the browser's URL.
const createExampleRouter = () =>
  createRouter({
    history: createMemoryHistory({ initialEntries: ["/invoices?status=pending,overdue"] }),
    routeTree,
  });

export default function DataTableRouterExample() {
  const router = useMemo(() => createExampleRouter(), []);

  return <RouterProvider router={router} />;
}
