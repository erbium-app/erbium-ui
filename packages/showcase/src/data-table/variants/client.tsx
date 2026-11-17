import { useState } from "react";
import {
  DataTable,
  DataTableContent,
  DataTableFilters,
  DataTablePagination,
  DataTableSearch,
  DataTableToolbar,
  DataTableViewOptions,
} from "@erbium/ui/blocks/data-table";
import { useDataTable } from "@erbium/ui/hooks/use-data-table";
import { invoiceColumns, invoiceSorting, invoices } from "../helpers";

export default function DataTableClientExample() {
  const [opened, setOpened] = useState<string>();

  // Every row is in the browser, so the table searches, filters, sorts and pages them itself.
  const table = useDataTable({
    columns: invoiceColumns,
    data: invoices,
    defaultSorting: invoiceSorting,
  });

  return (
    <div className="flex w-full min-w-72 max-w-4xl flex-col gap-related p-4">
      <DataTable
        table={table}
        onRowClick={(row) => {
          setOpened(row.original.id);
        }}
      >
        <DataTableToolbar>
          <DataTableSearch placeholder="Search invoices" />
          <DataTableFilters />
          <DataTableViewOptions />
        </DataTableToolbar>
        <DataTableContent />
        <DataTablePagination />
      </DataTable>
      <p aria-live="polite" className="text-caption text-muted-foreground">
        {opened === undefined ? "Click a row to open it." : `Opened ${opened}.`}
      </p>
    </div>
  );
}
