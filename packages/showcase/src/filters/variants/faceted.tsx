import { useState } from "react";
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
import type { ColumnFiltersState } from "@tanstack/react-table";
import { DataTable, DataTableToolbar } from "@erbium/ui/blocks/data-table";
import { FilterFacets } from "@erbium/ui/blocks/filters";
import { Badge } from "@erbium/ui/components/badge";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@erbium/ui/components/empty";
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
  columnHelper.accessor("title", { header: "Title" }),
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
  columnHelper.accessor("estimate", {
    cell: (info) => <div className="text-end tabular-nums">{info.getValue()} h</div>,
    header: () => <div className="text-end">Estimate</div>,
    ...filterColumn({ label: "Estimate", step: 1, type: "number" }),
  }),
]);

export default function FiltersFacetedExample() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useTable({
    columns,
    data: tasks,
    features,
    getRowId: (row) => row.id,
    onColumnFiltersChange: setColumnFilters,
    state: { columnFilters },
  });

  const filters = useTableFilters(table);

  return (
    <div className="flex w-full min-w-72 max-w-4xl flex-col gap-group p-4">
      <DataTableToolbar>
        {/* One button per field; option counts follow the other active filters. */}
        <FilterFacets filters={filters} fields={["status", "priority", "labels", "estimate"]} />
      </DataTableToolbar>
      <div className="max-h-[28rem] overflow-y-auto">
        <DataTable
          table={table}
          columnWidths={{ estimate: "6.5rem", priority: "6.5rem" }}
          empty={
            <Empty className="border-0">
              <EmptyHeader>
                <EmptyTitle>No tasks match</EmptyTitle>
                <EmptyDescription>Change or reset the filters.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          }
        />
      </div>
    </div>
  );
}
