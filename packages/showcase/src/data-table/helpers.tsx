import { useMemo, useState } from "react";
import { useDebouncedValue } from "@tanstack/react-pacer/debouncer";
import {
  createColumnHelper,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import type { PaginationState, RowSelectionState, SortingState } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader, DataTableToolbar } from "@erbium/ui/blocks/data-table";
import { Badge } from "@erbium/ui/components/badge";
import { Checkbox } from "@erbium/ui/components/checkbox";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@erbium/ui/components/empty";
import { Icon } from "@erbium/ui/components/icon";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@erbium/ui/components/input-group";
import { Pagination, PaginationControls } from "@erbium/ui/components/pagination";
import { LoadingControls, useSimulatedFetch } from "../loading";

/*
 * A server-backed table: the example "server" searches, sorts and pages the invoices, and the
 * table only renders the page it gets back. Each change of query is a refetch, so the skeleton is
 * drawn over the rows on screen and the next page lands in their place.
 */

type Status = "Paid" | "Pending" | "Overdue";

interface Invoice {
  id: string;
  customer: string;
  email: string;
  status: Status;
  amount: number;
  issued: string;
}

const customers = [
  ["Maya Okafor", "maya@example.com"],
  ["Leo Brandt", "leo@example.com"],
  ["Sana Rahimi", "sana@example.com"],
  ["Tomás Ferreira", "tomas@example.com"],
  ["Aiko Tanaka", "aiko@example.com"],
  ["Noah Lindqvist", "noah@example.com"],
  ["Priya Patel", "priya@example.com"],
  ["Omar Haddad", "omar@example.com"],
] as const;

const statuses: Status[] = ["Paid", "Pending", "Paid", "Overdue", "Paid"];

const invoices: Invoice[] = Array.from({ length: 46 }, (_, index) => {
  const [customer, email] = customers[index % customers.length] ?? customers[0];

  return {
    amount: ((index * 7919) % 4200) + 120,
    customer,
    email,
    id: `INV-${String(1040 + index)}`,
    issued: new Date(Date.UTC(2026, 9, 30 - (index % 28))).toISOString().slice(0, 10),
    status: statuses[index % statuses.length] ?? "Paid",
  };
});

interface InvoiceQuery {
  pagination: PaginationState;
  sorting: SortingState;
  search: string;
}

interface InvoicePage {
  rows: Invoice[];
  total: number;
}

// The sortable columns and how the "server" orders each.
type CompareInvoices = (a: Invoice, b: Invoice) => number;

const comparators = new Map<string, CompareInvoices>([
  ["amount", (a, b) => a.amount - b.amount],
  ["customer", (a, b) => a.customer.localeCompare(b.customer)],
  ["id", (a, b) => a.id.localeCompare(b.id)],
  ["issued", (a, b) => a.issued.localeCompare(b.issued)],
]);

// Stands in for the API: filters, sorts and slices on the "server".
const queryInvoices = ({ pagination, sorting, search }: InvoiceQuery): InvoicePage => {
  const term = search.trim().toLowerCase();

  const matching = invoices.filter(
    (invoice) =>
      term === "" ||
      invoice.customer.toLowerCase().includes(term) ||
      invoice.id.toLowerCase().includes(term),
  );

  const [sort] = sorting;

  const compare = sort === undefined ? undefined : comparators.get(sort.id);

  const sorted =
    compare === undefined
      ? matching
      : matching.toSorted((a, b) => (sort?.desc ? compare(b, a) : compare(a, b)));

  const start = pagination.pageIndex * pagination.pageSize;

  return { rows: sorted.slice(start, start + pagination.pageSize), total: sorted.length };
};

// The skeleton for the first load is drawn from a page of these.
const sampleInvoices: Invoice[] = Array.from({ length: 6 }, (_, index) => ({
  amount: 1000,
  customer: "Customer Name",
  email: "name@example.com",
  id: `INV-000${index}`,
  issued: "2026-01-01",
  status: "Pending",
}));

const currency = new Intl.NumberFormat("en-US", { currency: "USD", style: "currency" });

const statusVariant = { Overdue: "error", Paid: "success", Pending: "warning" } as const;

const features = tableFeatures({ rowPaginationFeature, rowSelectionFeature, rowSortingFeature });

const columnHelper = createColumnHelper<typeof features, Invoice>();

const columns = columnHelper.columns([
  columnHelper.display({
    cell: ({ row }) => (
      <Checkbox
        aria-label={`Select ${row.original.id}`}
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => {
          row.toggleSelected(checked);
        }}
      />
    ),
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all rows on this page"
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
        onCheckedChange={(checked) => {
          table.toggleAllPageRowsSelected(checked);
        }}
      />
    ),
    id: "select",
  }),
  columnHelper.accessor("id", {
    cell: (info) => <span className="font-medium tabular-nums">{info.getValue()}</span>,
    header: ({ column }) => <DataTableColumnHeader column={column}>Invoice</DataTableColumnHeader>,
  }),
  columnHelper.accessor("customer", {
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span>{row.original.customer}</span>
        <span className="text-muted-foreground">{row.original.email}</span>
      </div>
    ),
    header: ({ column }) => <DataTableColumnHeader column={column}>Customer</DataTableColumnHeader>,
  }),
  columnHelper.accessor("status", {
    cell: (info) => (
      <Badge variant={statusVariant[info.getValue()]} statusIcon>
        {info.getValue()}
      </Badge>
    ),
    enableSorting: false,
    header: "Status",
  }),
  columnHelper.accessor("issued", {
    cell: (info) => <span className="tabular-nums">{info.getValue()}</span>,
    header: ({ column }) => <DataTableColumnHeader column={column}>Issued</DataTableColumnHeader>,
  }),
  columnHelper.accessor("amount", {
    cell: (info) => <div className="text-end tabular-nums">{currency.format(info.getValue())}</div>,
    header: ({ column }) => (
      <div className="flex justify-end">
        <DataTableColumnHeader column={column}>Amount</DataTableColumnHeader>
      </div>
    ),
  }),
]);

// Fixed widths, so the first page sizes nothing differently from the sample rows it replaces.
const columnWidths = {
  amount: "7.5rem",
  id: "7rem",
  issued: "7rem",
  select: "2.5rem",
  status: "7.5rem",
};

interface InvoicesTableProps {
  latency?: number;
  /** The server rejects every request. */
  fail?: boolean;
  /** The server has no invoices. */
  empty?: boolean;
  pageSize?: number;
}

const noInvoices: Invoice[] = [];

const InvoicesTable = ({
  latency,
  fail = false,
  empty = false,
  pageSize = 6,
}: InvoicesTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([{ desc: true, id: "issued" }]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, { wait: 300 });

  // The response for the current query, memoized so it changes only when the query does.
  const page = useMemo(
    () =>
      empty
        ? { rows: noInvoices, total: 0 }
        : queryInvoices({ pagination, search: debouncedSearch, sorting }),
    [empty, pagination, debouncedSearch, sorting],
  );

  const request = useSimulatedFetch(page, { fail, latency });

  const table = useTable({
    columns,
    data: request.data?.rows ?? sampleInvoices,
    features,
    getRowId: (row) => row.id,
    manualPagination: true,
    manualSorting: true,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onSortingChange: (updater) => {
      setSorting(updater);
      setPagination((last) => ({ ...last, pageIndex: 0 }));
    },
    rowCount: request.data?.total ?? 0,
    state: { pagination, rowSelection, sorting },
  });

  const selected = Object.keys(rowSelection).length;

  return (
    <div className="flex w-full flex-col gap-group">
      <DataTableToolbar>
        <InputGroup className="max-w-64">
          <InputGroupAddon>
            <Icon name="search-01" aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            aria-label="Search invoices"
            placeholder="Search invoices"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPagination((last) => ({ ...last, pageIndex: 0 }));
            }}
          />
        </InputGroup>
        <LoadingControls {...request} />
      </DataTableToolbar>
      <DataTable
        table={table}
        loading={request.loading}
        error={request.error}
        id="data-table-invoices"
        label="Loading invoices"
        columnWidths={columnWidths}
        rowProps={(row) => ({ "data-state": row.getIsSelected() ? "selected" : undefined })}
        empty={
          <Empty className="border-0">
            <EmptyHeader>
              <EmptyTitle>No invoices found</EmptyTitle>
              <EmptyDescription>
                {debouncedSearch === "" ? "Invoices you send appear here." : "Try another search."}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        }
      />
      <div className="flex flex-wrap items-center justify-between gap-related text-caption text-muted-foreground">
        <span aria-live="polite">
          {selected > 0 ? `${selected} selected · ` : ""}
          {request.data === undefined ? "Loading invoices…" : `${request.data.total} invoices`}
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
};

export { InvoicesTable };

export type { InvoicesTableProps };
