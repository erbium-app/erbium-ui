import { useMemo } from "react";
import {
  DataTable,
  DataTableActionBar,
  DataTableContent,
  DataTableFilters,
  DataTablePagination,
  DataTableSearch,
  DataTableSelectAll,
  DataTableSelectRow,
  DataTableToolbar,
  DataTableViewOptions,
} from "@erbium/ui/blocks/data-table";
import { Badge } from "@erbium/ui/components/badge";
import { Button } from "@erbium/ui/components/button";
import {
  createDataTableColumnHelper,
  useDataTable,
  useDataTableQuery,
} from "@erbium/ui/hooks/use-data-table";
import type { DataTableQuery } from "@erbium/ui/lib/data-table-search";
import { isFilterRule, matchesRule } from "@erbium/ui/lib/filter-rules";
import type { FilterOption } from "@erbium/ui/lib/filter-rules";
import { useSimulatedFetch } from "../loading";

/*
 * Invoices for the data table examples, and a stand-in server that searches, filters, sorts and
 * pages them. The table only renders the page the server returns.
 */

type Status = "paid" | "pending" | "overdue";

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

const statuses: Status[] = ["paid", "pending", "paid", "overdue", "paid"];

const invoices: Invoice[] = Array.from({ length: 46 }, (_, index) => {
  const [customer, email] = customers[index % customers.length] ?? customers[0];

  return {
    amount: ((index * 7919) % 4200) + 120,
    customer,
    email,
    id: `INV-${String(1040 + index)}`,
    issued: new Date(Date.UTC(2026, 9, 30 - (index % 28))).toISOString().slice(0, 10),
    status: statuses[index % statuses.length] ?? "paid",
  };
});

const statusOptions: FilterOption[] = [
  { icon: "circle-check", label: "Paid", value: "paid" },
  { icon: "circle-fading-arrow-up", label: "Pending", value: "pending" },
  { icon: "triangle-alert", label: "Overdue", value: "overdue" },
];

const statusLabel = { overdue: "Overdue", paid: "Paid", pending: "Pending" } as const;
const statusVariant = { overdue: "error", paid: "success", pending: "warning" } as const;
const currency = new Intl.NumberFormat("en-US", { currency: "USD", style: "currency" });

const columnHelper = createDataTableColumnHelper<Invoice>();

const columns = columnHelper.columns([
  columnHelper.display({
    cell: DataTableSelectRow,
    enableHiding: false,
    header: DataTableSelectAll,
    id: "select",
    size: 40,
  }),
  columnHelper.accessor("id", {
    cell: (info) => <span className="font-medium tabular-nums">{info.getValue()}</span>,
    header: "Invoice",
    size: 112,
  }),
  columnHelper.accessor("customer", {
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span>{row.original.customer}</span>
        <span className="text-muted-foreground">{row.original.email}</span>
      </div>
    ),
    header: "Customer",
    meta: { filter: { icon: "user", label: "Customer", type: "text" } },
  }),
  columnHelper.accessor("status", {
    cell: (info) => (
      <Badge variant={statusVariant[info.getValue()]} statusIcon>
        {statusLabel[info.getValue()]}
      </Badge>
    ),
    enableSorting: false,
    header: "Status",
    meta: { filter: { label: "Status", options: statusOptions, type: "option" } },
    size: 120,
  }),
  columnHelper.accessor("issued", {
    cell: (info) => <span className="tabular-nums">{info.getValue()}</span>,
    header: "Issued",
    meta: { filter: { label: "Issued", type: "date" } },
    size: 112,
  }),
  columnHelper.accessor("amount", {
    cell: (info) => <span className="tabular-nums">{currency.format(info.getValue())}</span>,
    header: "Amount",
    meta: {
      align: "end",
      filter: { format: { currency: "USD", style: "currency" }, label: "Amount", type: "number" },
    },
    size: 120,
  }),
]);

// The sortable columns and how the "server" orders each.
const comparators = new Map<string, (a: Invoice, b: Invoice) => number>([
  ["amount", (a, b) => a.amount - b.amount],
  ["customer", (a, b) => a.customer.localeCompare(b.customer)],
  ["id", (a, b) => a.id.localeCompare(b.id)],
  ["issued", (a, b) => a.issued.localeCompare(b.issued)],
]);

// The filterable fields of an invoice, by column id.
const filterable = new Set<string>(["amount", "customer", "issued", "status"]);

const isFilterable = (id: string): id is "amount" | "customer" | "issued" | "status" =>
  filterable.has(id);

// Stands in for the API: the same query a route loader would pass on.
const queryInvoices = (
  { globalFilter, columnFilters, sorting, pagination }: DataTableQuery,
  rows: Invoice[],
) => {
  const term = globalFilter.trim().toLowerCase();

  const matching = rows.filter(
    (invoice) =>
      (term === "" ||
        invoice.customer.toLowerCase().includes(term) ||
        invoice.id.toLowerCase().includes(term)) &&
      columnFilters.every(
        ({ id, value }) =>
          !isFilterable(id) || !isFilterRule(value) || matchesRule(invoice[id], value),
      ),
  );

  const sorted = matching.toSorted((a, b) => {
    for (const { id, desc } of sorting) {
      const order = comparators.get(id)?.(a, b) ?? 0;

      if (order !== 0) {
        return desc ? -order : order;
      }
    }

    return 0;
  });

  const start = pagination.pageIndex * pagination.pageSize;

  return { rows: sorted.slice(start, start + pagination.pageSize), total: sorted.length };
};

// The skeleton of the first load is drawn from a full page of these, so it is as tall as the page
// that replaces it.
const sampleInvoice = (index: number): Invoice => ({
  amount: 1000,
  customer: "Customer Name",
  email: "name@example.com",
  id: `INV-${String(index).padStart(4, "0")}`,
  issued: "2026-01-01",
  status: "pending",
});

const defaultSorting = [{ desc: true, id: "issued" }];

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
  pageSize = 10,
}: InvoicesTableProps) => {
  // The query is lifted out of the table: the request needs it before the rows exist.
  const [query, setQuery] = useDataTableQuery({
    columns,
    defaultPageSize: pageSize,
    defaultSorting,
  });

  const page = useMemo(() => queryInvoices(query, empty ? noInvoices : invoices), [query, empty]);
  const request = useSimulatedFetch(page, { fail, latency });

  const samples = useMemo(
    () => Array.from({ length: query.pagination.pageSize }, (_, index) => sampleInvoice(index)),
    [query.pagination.pageSize],
  );

  const table = useDataTable({
    columns,
    data: request.data?.rows ?? samples,
    defaultPageSize: pageSize,
    onQueryChange: setQuery,
    query,
    rowCount: request.data?.total ?? 0,
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar>
        <DataTableSearch placeholder="Search invoices" />
        <DataTableFilters />
        <DataTableViewOptions />
      </DataTableToolbar>
      <DataTableContent
        loading={request.loading}
        error={request.error}
        id="data-table-invoices"
        label="Loading invoices"
      />
      <DataTablePagination pageSizes={[pageSize, 20, 50]} />
      <DataTableActionBar>
        <Button variant="ghost" size="sm">
          Send reminders
        </Button>
      </DataTableActionBar>
    </DataTable>
  );
};

export { columns as invoiceColumns, defaultSorting as invoiceSorting, invoices, InvoicesTable };

export type { Invoice, InvoicesTableProps };
