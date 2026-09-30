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

type Invoice = {
  invoice: string;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: number;
};

const invoices: Invoice[] = [
  { invoice: "INV001", paymentStatus: "Paid", paymentMethod: "Credit Card", totalAmount: 250 },
  { invoice: "INV002", paymentStatus: "Pending", paymentMethod: "PayPal", totalAmount: 150 },
  { invoice: "INV003", paymentStatus: "Unpaid", paymentMethod: "Bank Transfer", totalAmount: 350 },
  { invoice: "INV004", paymentStatus: "Paid", paymentMethod: "Credit Card", totalAmount: 450 },
  { invoice: "INV005", paymentStatus: "Paid", paymentMethod: "PayPal", totalAmount: 550 },
  { invoice: "INV006", paymentStatus: "Pending", paymentMethod: "Bank Transfer", totalAmount: 200 },
  { invoice: "INV007", paymentStatus: "Unpaid", paymentMethod: "Credit Card", totalAmount: 300 },
];

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

// Column meta carries the classes shared by a column's head, cells and footer.
const features = tableFeatures({ columnMeta: metaHelper<{ className?: string }>() });

const columnHelper = createColumnHelper<typeof features, Invoice>();

const columns = columnHelper.columns([
  columnHelper.accessor("invoice", {
    header: "Invoice",
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    footer: "Total",
    meta: { className: "w-[100px]" },
  }),
  columnHelper.accessor("paymentStatus", { header: "Status" }),
  columnHelper.accessor("paymentMethod", { header: "Method" }),
  columnHelper.accessor("totalAmount", {
    header: "Amount",
    cell: (info) => currency.format(info.getValue()),
    footer: ({ table }) =>
      currency.format(
        table.getRowModel().rows.reduce((sum, row) => sum + row.original.totalAmount, 0),
      ),
    meta: { className: "text-end" },
  }),
]);

export function TableFooterExample() {
  const table = useTable({ features, columns, data: invoices.slice(0, 3) });

  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead className={header.column.columnDef.meta?.className} key={header.id}>
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
              <TableCell className={cell.column.columnDef.meta?.className} key={cell.id}>
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
              <TableCell className={footer.column.columnDef.meta?.className} key={footer.id}>
                <table.FlexRender footer={footer} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableFooter>
    </Table>
  );
}
