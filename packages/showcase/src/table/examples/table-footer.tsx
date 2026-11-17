import { cn } from "@erbium/ui/lib/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@erbium/ui/components/table";
import { createColumnHelper, metaHelper, tableFeatures, useTable } from "@tanstack/react-table";

interface Invoice {
  invoice: string;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: number;
}

const invoices: Invoice[] = [
  { invoice: "INV001", paymentMethod: "Credit Card", paymentStatus: "Paid", totalAmount: 250 },
  { invoice: "INV002", paymentMethod: "PayPal", paymentStatus: "Pending", totalAmount: 150 },
  { invoice: "INV003", paymentMethod: "Bank Transfer", paymentStatus: "Unpaid", totalAmount: 350 },
  { invoice: "INV004", paymentMethod: "Credit Card", paymentStatus: "Paid", totalAmount: 450 },
  { invoice: "INV005", paymentMethod: "PayPal", paymentStatus: "Paid", totalAmount: 550 },
  { invoice: "INV006", paymentMethod: "Bank Transfer", paymentStatus: "Pending", totalAmount: 200 },
  { invoice: "INV007", paymentMethod: "Credit Card", paymentStatus: "Unpaid", totalAmount: 300 },
];

const currency = new Intl.NumberFormat("en-US", { currency: "USD", style: "currency" });

// Column metadata describes alignment and width shared by the head, cells and footer.
const features = tableFeatures({
  columnMeta: metaHelper<{ alignment?: "end"; narrow?: boolean }>(),
});

const columnHelper = createColumnHelper<typeof features, Invoice>();

const columns = columnHelper.columns([
  columnHelper.accessor("invoice", {
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    footer: "Total",
    header: "Invoice",
    meta: { narrow: true },
  }),
  columnHelper.accessor("paymentStatus", { header: "Status" }),
  columnHelper.accessor("paymentMethod", { header: "Method" }),
  columnHelper.accessor("totalAmount", {
    cell: (info) => currency.format(info.getValue()),
    footer: ({ table }) =>
      currency.format(
        table.getRowModel().rows.reduce((sum, row) => sum + row.original.totalAmount, 0),
      ),
    header: "Amount",
    meta: { alignment: "end" },
  }),
]);

export default function TableFooterExample() {
  const table = useTable({ columns, data: invoices.slice(0, 3), features });

  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                className={cn(
                  header.column.columnDef.meta?.alignment === "end" && "text-end tabular-nums",
                  header.column.columnDef.meta?.narrow === true && "w-25",
                )}
                key={header.id}
              >
                {header.isPlaceholder ? null : <table.FlexRender header={header} />}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getAllCells().map((cell) => (
              <TableCell
                className={cn(
                  cell.column.columnDef.meta?.alignment === "end" && "text-end tabular-nums",
                  cell.column.columnDef.meta?.narrow === true && "w-25",
                )}
                key={cell.id}
              >
                <table.FlexRender cell={cell} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        {table.getFooterGroups().map((footerGroup) => (
          <TableRow key={footerGroup.id}>
            {footerGroup.headers.map((footer) => (
              <TableCell
                className={cn(
                  footer.column.columnDef.meta?.alignment === "end" && "text-end tabular-nums",
                  footer.column.columnDef.meta?.narrow === true && "w-25",
                )}
                key={footer.id}
              >
                <table.FlexRender footer={footer} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableFooter>
    </Table>
  );
}
