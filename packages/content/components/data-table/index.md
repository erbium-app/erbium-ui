---
title: "Data Table"
description: "A table with search, filters, sorting, column visibility, selection and pages, kept in React state or the URL, for rows in the browser or on a server."
---

## Usage

A data table is TanStack Table v9 with Erbium's opinions built in. `useDataTable` builds the table with every feature registered, and the parts from `@erbium/ui/blocks/data-table` read it from context, so each part needs no props.

```tsx
import {
  DataTable,
  DataTableContent,
  DataTableFilters,
  DataTablePagination,
  DataTableSearch,
  DataTableToolbar,
  DataTableViewOptions,
} from "@erbium/ui/blocks/data-table";
import { createDataTableColumnHelper, useDataTable } from "@erbium/ui/hooks/use-data-table";

const columnHelper = createDataTableColumnHelper<Invoice>();

const columns = columnHelper.columns([
  columnHelper.accessor("customer", { header: "Customer" }),
  columnHelper.accessor("status", {
    header: "Status",
    meta: { filter: { label: "Status", options: statusOptions, type: "option" } },
  }),
  columnHelper.accessor("amount", { header: "Amount", meta: { align: "end" }, size: 120 }),
]);

function Invoices({ invoices }: { invoices: Invoice[] }) {
  const table = useDataTable({ columns, data: invoices });

  return (
    <DataTable table={table}>
      <DataTableToolbar>
        <DataTableSearch />
        <DataTableFilters />
        <DataTableViewOptions />
      </DataTableToolbar>
      <DataTableContent />
      <DataTablePagination />
    </DataTable>
  );
}
```

Keep `columns` at module scope or in a memo. Rows with an `id` keep their selection across pages and refetches.

## Opening rows

`onRowClick` on `DataTable` makes each row open something, such as its detail page. The row arrives typed, so `row.original` is the record:

```tsx
<DataTable table={table} onRowClick={(row) => navigate({ to: "/invoices/$id", params: row.original })}>
```

Clicks on a control inside the row, such as the selection checkbox, a row menu or a link, go to that control alone, so their handlers need no `stopPropagation`. Rows are not focusable, so also render a link to the row in one of its cells: keyboards reach the row through it, and it opens in a new tab.

## Columns

Columns are TanStack column definitions. A data table reads three more things from them:

- `meta.filter` makes the column filterable, with the same config as [Filters](/docs/blocks/filters). `DataTableFilters` offers every filterable column.
- `meta.align: "end"` right-aligns the header and cells, for numbers.
- `size` (in pixels) fixes the column's width. Once any column has a size, the table lays out at fixed widths and the columns without one share the rest. Fixed widths keep the first load flush: sample rows cannot size the columns differently from the rows that replace them.

Every header with a value can be sorted and hidden from its menu. Set `enableSorting: false` or `enableHiding: false` to take an action away. `meta.label` names the column in menus when its `header` is not a string.

Add a selection column with `DataTableSelectAll` and `DataTableSelectRow`:

```tsx
columnHelper.display({
  id: "select",
  header: DataTableSelectAll,
  cell: DataTableSelectRow,
  enableHiding: false,
  size: 40,
});
```

## Server tables

Give `rowCount` when a server searches, filters, sorts and pages, and pass the current page as `data`. The request needs the query before the rows exist, so lift the query out of the table with `useDataTableQuery` and send it with the request:

```tsx
const [query, setQuery] = useDataTableQuery({ columns, defaultSorting });
const page = useQuery({
  queryKey: ["invoices", query],
  queryFn: () => fetchInvoices(query),
  placeholderData: keepPreviousData,
});

const table = useDataTable({
  columns,
  data: page.data?.rows ?? SAMPLE_ROWS,
  rowCount: page.data?.total ?? 0,
  query,
  onQueryChange: setQuery,
});
```

The query holds `globalFilter`, `columnFilters` (Erbium filter rules, which `matchesRule` from `@erbium/ui/lib/filter-rules` evaluates), `sorting` and `pagination`. A server table holds one page, so pass option counts to `DataTableFilters counts={…}` when the filters should show them. The search and the filters wait for a 300 ms pause before they change a server table's query, so typing a search or picking several options asks for rows once. A filter added from the menu changes nothing until it has a value.

## URL state

`useDataTableSearchParams` keeps the query in the URL through TanStack Router, so every view of a table is a link. Share one config between the route and the table:

```tsx
const invoicesTable = { columns, defaultSorting: [{ id: "issued", desc: true }] };

export const Route = createFileRoute("/invoices")({
  validateSearch: validateDataTableSearch(invoicesTable),
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => fetchInvoices(parseDataTableSearch(deps, invoicesTable)),
  component: Invoices,
});

function Invoices() {
  const [query, setQuery] = useDataTableSearchParams(invoicesTable);
  const page = Route.useLoaderData();
  const table = useDataTable({
    ...invoicesTable,
    data: page.rows,
    rowCount: page.total,
    query,
    onQueryChange: setQuery,
  });
  // …
}
```

The URL reads `?q=erbium&sort=issued.desc,customer&page=2&size=20&status=paid,overdue`. `q` is the search, `sort` the sort order, `page` and `size` the page, and each filterable column keeps its rule under its id, so do not name a column `q`, `sort`, `page` or `size`. A route with more than one table gives each config a `prefix`: `prefix: "users"` writes `?users.q=acme&users.page=2`, so the tables keep separate params. Defaults are left out of the URL, and every change replaces the history entry. `validateDataTableSearch` drops params that do not fit the columns and passes other params through.

## Loading

`DataTableContent loading` draws the skeleton over the rows the table holds: the rows on screen during a refetch, or sample rows for the first load, so give the table a full page of sample rows (`query.pagination.pageSize` of them) until the first response. A shorter sample draws a shorter skeleton, and the table grows when the rows arrive. Loads that answer within 150 ms show no skeleton. The toolbar and header are known, so they stay readable. Pass `id` so a return visit draws the table's last shape.

`error` replaces the table: pass an `Error` to show its message in an error alert. With no rows, the table shows `empty`, or by default an empty state that offers to clear the search and filters when they hide every row.

## Parts

- `DataTable`: provides `table` to the parts inside it. `onRowClick` opens a row.
- `DataTableToolbar`: the row above the table.
- `DataTableSearch`: searches every column. `placeholder` names what it searches.
- `DataTableFilters`: filter chips for the filterable columns. `DataTableFacets` shows a button per column instead; pass `fields` to pick them.
- `DataTableViewOptions`: shows and hides columns.
- `DataTableContent`: the table, with `loading`, `error`, `empty`, `id` and `label`.
- `DataTablePagination`: the row count, page size and page controls. `pageSizes` sets the sizes it offers.
- `DataTableActionBar`: actions for the selected rows, shown while any are selected. Read the selection with `useDataTableContext().getSelectedRowModel()`.

`useDataTableContext` returns the table inside `DataTable`, for parts of your own.
