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
  useRouter,
} from "@tanstack/react-router";
import {
  columnFacetingFeature,
  columnFilteringFeature,
  createColumnHelper,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  metaHelper,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { DataTable, DataTableToolbar } from "@erbium/ui/blocks/data-table";
import { FilterBar } from "@erbium/ui/blocks/filters";
import { Badge } from "@erbium/ui/components/badge";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@erbium/ui/components/empty";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@erbium/ui/components/input-group";
import { Link } from "@erbium/ui/components/link";
import { useFilterSearch, useTableFilters } from "@erbium/ui/hooks/use-filters";
import { filterColumn } from "@erbium/ui/lib/filter-rules";
import type { FilterColumnMeta } from "@erbium/ui/lib/filter-rules";
import { getColumnFilterFields, validateFilterSearch } from "@erbium/ui/lib/filter-search";
import type { FilterSearch } from "@erbium/ui/lib/filter-search";
import { labelOf, priorityOptions, priorityVariant, statusOptions, tasks } from "../data";
import type { Task } from "../data";

const features = tableFeatures({
  columnFacetingFeature,
  columnFilteringFeature,
  columnMeta: metaHelper<FilterColumnMeta>(),
  facetedMinMaxValues: createFacetedMinMaxValues(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  filteredRowModel: createFilteredRowModel(),
});

const columnHelper = createColumnHelper<typeof features, Task>();

const columns = columnHelper.columns([
  columnHelper.accessor("title", {
    header: "Title",
    ...filterColumn({ icon: "file-text", label: "Title", type: "text" }),
  }),
  columnHelper.accessor("status", {
    cell: (info) => labelOf(statusOptions, info.getValue()),
    header: "Status",
    ...filterColumn({
      icon: "circle-check",
      label: "Status",
      options: statusOptions,
      type: "option",
    }),
  }),
  columnHelper.accessor("priority", {
    cell: (info) => (
      <Badge variant={priorityVariant[info.getValue()]}>
        {labelOf(priorityOptions, info.getValue())}
      </Badge>
    ),
    header: "Priority",
    ...filterColumn({
      icon: "arrow-up-down",
      label: "Priority",
      options: priorityOptions,
      type: "option",
    }),
  }),
  columnHelper.accessor("estimate", {
    cell: (info) => <div className="text-end tabular-nums">{info.getValue()} h</div>,
    header: () => <div className="text-end">Estimate</div>,
    ...filterColumn({ label: "Estimate", step: 1, type: "number" }),
  }),
]);

// The filterable columns by id and type: the params the URL holds.
const filterFields = getColumnFilterFields(columns);

// The return type breaks the inference cycle between the page and the route it reads from.
const Tasks = (): ReactElement => {
  const search = tasksRoute.useSearch<ExampleRouter>();
  const router = useRouter<ExampleRouter>();

  // The URL is the only copy of the rules. Each change replaces the history entry, so typing in
  // a text filter does not add a step to Back.
  const { columnFilters, onColumnFiltersChange } = useFilterSearch({
    fields: filterFields,
    onSearchChange: (next) => {
      void router.navigate({
        replace: true,
        search: (prev: FilterSearch) => ({ ...prev, ...next }),
        to: "/tasks",
      });
    },
    search,
  });

  const table = useTable({
    columns,
    data: tasks,
    features,
    getRowId: (row) => row.id,
    onColumnFiltersChange,
    state: { columnFilters },
  });

  const filters = useTableFilters(table);

  return (
    <>
      <DataTableToolbar>
        <FilterBar filters={filters} />
      </DataTableToolbar>
      <DataTable
        table={table}
        columnWidths={{ estimate: "6.5rem", priority: "6.5rem", status: "8rem" }}
        empty={
          <Empty className="border-0">
            <EmptyHeader>
              <EmptyTitle>No tasks match</EmptyTitle>
              <EmptyDescription>Change or clear the filters.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        }
      />
    </>
  );
};

// Shared links: each one is a filtered view of the same page.
const savedViews: { label: string; search: FilterSearch }[] = [
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
  // Only filter params that fit their field reach the page, written in their normal form.
  validateSearch: (search: FilterSearch) => validateFilterSearch(search, filterFields),
});

const routeTree = rootRoute.addChildren([tasksRoute]);

// A memory history keeps the example inside the page; an app's router uses the browser's URL.
const createExampleRouter = () =>
  createRouter({
    history: createMemoryHistory({ initialEntries: ["/tasks?status=todo,in-progress"] }),
    routeTree,
  });

// The example's router is not registered app-wide, so its hooks name it to stay typed.
type ExampleRouter = ReturnType<typeof createExampleRouter>;

export default function FiltersRouterExample() {
  const router = useMemo(() => createExampleRouter(), []);

  return <RouterProvider router={router} />;
}
