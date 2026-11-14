---
title: "Data Table"
description: "A server-backed table that loads, sorts, filters and pages without moving the layout."
---

## Usage

Import from `@erbium/ui/blocks/data-table`. Build the table with TanStack Table's `useTable` and pass it to `DataTable`, which renders the header and rows with Erbium's [Table](/docs/components/table) and owns the loading, empty and error states.

```tsx
import { DataTable } from "@erbium/ui/blocks/data-table";

const table = useTable({
  columns,
  data: query.data?.rows ?? SAMPLE_ROWS,
  features,
  manualPagination: true,
  manualSorting: true,
  rowCount: query.data?.total ?? 0,
  state: { pagination, sorting },
});

<DataTable
  table={table}
  loading={query.isFetching}
  error={query.error}
  id="invoices"
  label="Loading invoices"
  columnWidths={{ select: "2.5rem", amount: "7.5rem" }}
  empty={<Empty>…</Empty>}
/>;
```

## Loading

The skeleton is measured from the rows the table holds, so give the table sample rows until the first response. A refetch, page change, new sort order or search keeps the current rows on screen and draws the skeleton over them, then the new rows land in their place. Loads that answer within 150 ms show no skeleton. The header is known, so it stays readable throughout. Pass `id` so a return visit draws the table's last shape.

Set `columnWidths` (CSS lengths by column id) so the first load is flush. A table sized by its content gives the sample rows different column widths from the rows that replace them, so the columns jump at the reveal. With widths the table lays out at fixed widths, and columns left out share the remaining width.

`error` replaces the table: pass an `Error` to show its message in an error alert. `empty` is shown in the body when there are no rows.

## Parts

- `DataTable`: `table`, `loading`, `error`, `empty`, `id`, `label`, `columnWidths`, and `rowProps(row)` for per-row attributes such as `data-state="selected"`.
- `DataTableColumnHeader`: a header button that sorts its column and announces the order. Pass the header's `column`.
- `DataTableToolbar`: the row of filters and actions above the table.

Compose pagination with [Pagination](/docs/components/pagination)'s `PaginationControls`, driven by the table's pagination state.
