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
  // Every row is in the browser, so the table searches, filters, sorts and pages them itself.
  const table = useDataTable({
    columns: invoiceColumns,
    data: invoices,
    defaultSorting: invoiceSorting,
  });

  return (
    <div className="w-full min-w-72 max-w-4xl p-4">
      <DataTable table={table}>
        <DataTableToolbar>
          <DataTableSearch placeholder="Search invoices" />
          <DataTableFilters />
          <DataTableViewOptions />
        </DataTableToolbar>
        <DataTableContent />
        <DataTablePagination />
      </DataTable>
    </div>
  );
}
