import {
  DataTable,
  DataTableContent,
  DataTableFacets,
  DataTablePagination,
  DataTableToolbar,
} from "@erbium/ui/blocks/data-table";
import { Badge } from "@erbium/ui/components/badge";
import { createDataTableColumnHelper, useDataTable } from "@erbium/ui/hooks/use-data-table";
import {
  labelOf,
  labelOptions,
  priorityOptions,
  priorityVariant,
  statusOptions,
  tasks,
} from "../data";
import type { Task } from "../data";

const columnHelper = createDataTableColumnHelper<Task>();

const columns = columnHelper.columns([
  columnHelper.accessor("title", { header: "Title" }),
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
  columnHelper.accessor("labels", {
    cell: (info) =>
      info
        .getValue()
        .map((label) => labelOf(labelOptions, label))
        .join(", "),
    header: "Labels",
    meta: {
      filter: {
        icon: "tag-01",
        label: "Labels",
        options: labelOptions,
        type: "multiOption",
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

export default function FiltersFacetedExample() {
  const table = useDataTable({ columns, data: tasks });

  return (
    <div className="w-full min-w-72 max-w-4xl p-4">
      <DataTable table={table}>
        <DataTableToolbar>
          {/* One button per field; option counts follow the other active filters. */}
          <DataTableFacets fields={["status", "priority", "labels", "estimate"]} />
        </DataTableToolbar>
        <DataTableContent />
        <DataTablePagination />
      </DataTable>
    </div>
  );
}
