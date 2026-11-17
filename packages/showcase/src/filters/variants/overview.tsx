import { useState } from "react";
import {
  columnFacetingFeature,
  columnFilteringFeature,
  createColumnHelper,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  metaHelper,
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import type { ColumnFiltersState, PaginationState } from "@tanstack/react-table";
import { DataTable, DataTableToolbar } from "@erbium/ui/blocks/data-table";
import { FilterBar } from "@erbium/ui/blocks/filters";
import { Badge } from "@erbium/ui/components/badge";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@erbium/ui/components/empty";
import { Pagination, PaginationControls } from "@erbium/ui/components/pagination";
import { useTableFilters } from "@erbium/ui/hooks/use-filters";
import { filterColumn } from "@erbium/ui/lib/filter-rules";
import type { FilterColumnMeta } from "@erbium/ui/lib/filter-rules";
import {
  labelOf,
  labelOptions,
  priorityOptions,
  priorityVariant,
  statusOptions,
  tasks,
} from "../data";
import type { Task } from "../data";

// Filtering, faceting (option counts and number ranges) and pagination, all on the client.
const features = tableFeatures({
  columnFacetingFeature,
  columnFilteringFeature,
  columnMeta: metaHelper<FilterColumnMeta>(),
  facetedMinMaxValues: createFacetedMinMaxValues(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  rowPaginationFeature,
});

const columnHelper = createColumnHelper<typeof features, Task>();

// `filterColumn` sets each column's filter function and the config its filter UI reads.
const columns = columnHelper.columns([
  columnHelper.accessor("id", {
    cell: (info) => <span className="font-medium tabular-nums">{info.getValue()}</span>,
    enableColumnFilter: false,
    header: "Task",
  }),
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
  columnHelper.accessor("labels", {
    cell: (info) =>
      info
        .getValue()
        .map((label) => labelOf(labelOptions, label))
        .join(", "),
    header: "Labels",
    ...filterColumn({
      icon: "tag-01",
      label: "Labels",
      options: labelOptions,
      type: "multiOption",
    }),
  }),
  // No `options`: the choices and their counts come from the rows.
  columnHelper.accessor("assignee", {
    header: "Assignee",
    ...filterColumn({ icon: "user", label: "Assignee", type: "option" }),
  }),
  columnHelper.accessor("estimate", {
    cell: (info) => <div className="text-end tabular-nums">{info.getValue()} h</div>,
    header: () => <div className="text-end">Estimate</div>,
    ...filterColumn({ label: "Estimate", step: 1, type: "number" }),
  }),
  columnHelper.accessor("due", {
    cell: (info) => <span className="tabular-nums">{info.getValue()}</span>,
    header: "Due",
    ...filterColumn({ icon: "calendar-01", label: "Due", type: "date" }),
  }),
]);

// Each rule is a column filter value, so the state is plain `ColumnFiltersState`.
const initialFilters: ColumnFiltersState = [
  { id: "status", value: { operator: "isAnyOf", type: "option", values: ["todo", "in-progress"] } },
];

export default function FiltersOverviewExample() {
  const [columnFilters, setColumnFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 8 });

  const table = useTable({
    columns,
    data: tasks,
    features,
    getRowId: (row) => row.id,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    state: { columnFilters, pagination },
  });

  const filters = useTableFilters(table);

  return (
    <div className="flex w-full min-w-72 max-w-4xl flex-col gap-group p-4">
      <DataTableToolbar>
        <FilterBar filters={filters} />
      </DataTableToolbar>
      <DataTable
        table={table}
        columnWidths={{ estimate: "6.5rem", id: "6.5rem", priority: "6.5rem" }}
        empty={
          <Empty className="border-0">
            <EmptyHeader>
              <EmptyTitle>No tasks match</EmptyTitle>
              <EmptyDescription>Change or clear the filters.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        }
      />
      <div className="flex flex-wrap items-center justify-between gap-related text-caption text-muted-foreground">
        <span aria-live="polite">
          {table.getFilteredRowModel().rows.length} of {tasks.length} tasks
        </span>
        <Pagination className="mx-0 w-auto">
          <PaginationControls
            page={pagination.pageIndex + 1}
            pageCount={Math.max(table.getPageCount(), 1)}
            onPageChange={(target) => {
              setPagination((last) => ({ ...last, pageIndex: target - 1 }));
            }}
          />
        </Pagination>
      </div>
    </div>
  );
}
