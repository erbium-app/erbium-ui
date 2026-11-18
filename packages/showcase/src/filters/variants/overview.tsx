import { useState } from "react";
import {
  DataTable,
  DataTableContent,
  DataTableFilters,
  DataTablePagination,
  DataTableToolbar,
} from "@erbium/ui/blocks/data-table";
import { Badge } from "@erbium/ui/components/badge";
import { createDataTableColumnHelper, useDataTable } from "@erbium/ui/hooks/use-data-table";
import type { DataTableQuery } from "@erbium/ui/lib/data-table-search";
import {
  areaOptions,
  labelOf,
  labelOptions,
  priorityOptions,
  priorityVariant,
  statusOptions,
  tasks,
} from "../data";
import type { Task } from "../data";

const columnHelper = createDataTableColumnHelper<Task>();

// `meta.filter` makes a column filterable and is the config its filter UI reads.
const columns = columnHelper.columns([
  columnHelper.accessor("id", {
    cell: (info) => <span className="font-medium tabular-nums">{info.getValue()}</span>,
    enableColumnFilter: false,
    header: "Task",
  }),
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
  // An option tree: Platform opens API, which opens REST and GraphQL, in the same menu.
  columnHelper.accessor("area", {
    cell: (info) => labelOf(areaOptions, info.getValue()),
    header: "Area",
    meta: {
      filter: { icon: "cube", label: "Area", options: areaOptions, type: "option" },
    },
  }),
  // No `options`: the choices and their counts come from the rows.
  columnHelper.accessor("assignee", {
    header: "Assignee",
    meta: { filter: { icon: "user", label: "Assignee", type: "option" } },
  }),
  columnHelper.accessor("estimate", {
    cell: (info) => <span className="tabular-nums">{info.getValue()} h</span>,
    header: "Estimate",
    meta: {
      align: "end",
      filter: { icon: "calculator", label: "Estimate", step: 1, type: "number" },
    },
    size: 104,
  }),
  columnHelper.accessor("due", {
    cell: (info) => <span className="tabular-nums">{info.getValue()}</span>,
    header: "Due",
    meta: { filter: { icon: "calendar-01", label: "Due", type: "date" } },
  }),
]);

// Each rule is a column filter value, so a query can start with rules in place.
const initialQuery: DataTableQuery = {
  columnFilters: [
    {
      id: "status",
      value: { operator: "isAnyOf", type: "option", values: ["todo", "in-progress"] },
    },
  ],
  globalFilter: "",
  pagination: { pageIndex: 0, pageSize: 8 },
  sorting: [],
};

export default function FiltersOverviewExample() {
  const [query, setQuery] = useState(initialQuery);
  const table = useDataTable({ columns, data: tasks, onQueryChange: setQuery, query });

  return (
    <div className="w-full min-w-72 max-w-4xl p-4">
      <DataTable table={table}>
        <DataTableToolbar>
          <DataTableFilters />
        </DataTableToolbar>
        <DataTableContent />
        <DataTablePagination pageSizes={[8, 20]} />
      </DataTable>
    </div>
  );
}
