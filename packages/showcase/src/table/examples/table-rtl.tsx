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
  { invoice: "INV001", paymentMethod: "بطاقة ائتمانية", paymentStatus: "مدفوع", totalAmount: 250 },
  { invoice: "INV002", paymentMethod: "PayPal", paymentStatus: "قيد الانتظار", totalAmount: 150 },
  { invoice: "INV003", paymentMethod: "تحويل بنكي", paymentStatus: "غير مدفوع", totalAmount: 350 },
  { invoice: "INV004", paymentMethod: "بطاقة ائتمانية", paymentStatus: "مدفوع", totalAmount: 450 },
];

const currency = new Intl.NumberFormat("ar", { currency: "USD", style: "currency" });

const features = tableFeatures({
  columnMeta: metaHelper<{ alignment?: "end"; narrow?: boolean }>(),
});

const columnHelper = createColumnHelper<typeof features, Invoice>();

// Logical classes (`text-end`) follow the reading direction, so the same
// columns lay out correctly in both LTR and RTL.
const columns = columnHelper.columns([
  columnHelper.accessor("invoice", {
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    footer: "المجموع",
    header: "الفاتورة",
    meta: { narrow: true },
  }),
  columnHelper.accessor("paymentStatus", { header: "الحالة" }),
  columnHelper.accessor("paymentMethod", { header: "الطريقة" }),
  columnHelper.accessor("totalAmount", {
    cell: (info) => currency.format(info.getValue()),
    footer: ({ table }) =>
      currency.format(
        table.getRowModel().rows.reduce((sum, row) => sum + row.original.totalAmount, 0),
      ),
    header: "المبلغ",
    meta: { alignment: "end" },
  }),
]);

const TableRtl = () => {
  const table = useTable({ columns, data: invoices, features });

  return (
    <Table dir="rtl">
      <TableCaption>قائمة بفواتيرك الأخيرة.</TableCaption>
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
};

export default TableRtl;
