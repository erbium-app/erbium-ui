// @ts-nocheck
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/table";
import { createColumnHelper, metaHelper, tableFeatures, useTable } from "@tanstack/react-table";

type Invoice = {
  invoice: string;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: number;
};

const invoices: Invoice[] = [
  { invoice: "INV001", paymentStatus: "مدفوع", paymentMethod: "بطاقة ائتمانية", totalAmount: 250 },
  { invoice: "INV002", paymentStatus: "قيد الانتظار", paymentMethod: "PayPal", totalAmount: 150 },
  { invoice: "INV003", paymentStatus: "غير مدفوع", paymentMethod: "تحويل بنكي", totalAmount: 350 },
  { invoice: "INV004", paymentStatus: "مدفوع", paymentMethod: "بطاقة ائتمانية", totalAmount: 450 },
];

const currency = new Intl.NumberFormat("ar", { style: "currency", currency: "USD" });

const features = tableFeatures({ columnMeta: metaHelper<{ className?: string }>() });

const columnHelper = createColumnHelper<typeof features, Invoice>();

// Logical classes (`text-end`) follow the reading direction, so the same
// columns lay out correctly in both LTR and RTL.
const columns = columnHelper.columns([
  columnHelper.accessor("invoice", {
    header: "الفاتورة",
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    footer: "المجموع",
    meta: { className: "w-[100px]" },
  }),
  columnHelper.accessor("paymentStatus", { header: "الحالة" }),
  columnHelper.accessor("paymentMethod", { header: "الطريقة" }),
  columnHelper.accessor("totalAmount", {
    header: "المبلغ",
    cell: (info) => currency.format(info.getValue()),
    footer: ({ table }) =>
      currency.format(
        table.getRowModel().rows.reduce((sum, row) => sum + row.original.totalAmount, 0),
      ),
    meta: { className: "text-end" },
  }),
]);

export default function TableRtl() {
  const table = useTable({ features, columns, data: invoices });

  return (
    <Table dir="rtl">
      <TableCaption>قائمة بفواتيرك الأخيرة.</TableCaption>
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
