import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@erbium/ui/components/table";
import { createColumnHelper, tableFeatures, useTable } from "@tanstack/react-table";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { CheckboxInTable } from "../examples/upstream/checkbox-table";
import { TableActions } from "../examples/upstream/table-actions";
import { TableFooterExample } from "../examples/upstream/table-footer";
import Demo from "../examples/table-demo";
import TableRtl from "../examples/table-rtl";

const meta = {
  title: "UI/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A responsive table component.\n\n**Import:** `@erbium/ui/components/table`  \n\n**shadcn/ui page:** [Table](https://ui.shadcn.com/docs/components/base/table)\n\n### Usage\n\n```tsx\nimport {\n  Table,\n  TableBody,\n  TableCaption,\n  TableCell,\n  TableHead,\n  TableHeader,\n  TableRow,\n} from "@erbium/ui/components/table"\n```\n\n```tsx\n<Table>\n  <TableCaption>A list of your recent invoices.</TableCaption>\n  <TableHeader>\n    <TableRow>\n      <TableHead className="w-[100px]">Invoice</TableHead>\n      <TableHead>Status</TableHead>\n      <TableHead>Method</TableHead>\n      <TableHead className="text-right">Amount</TableHead>\n    </TableRow>\n  </TableHeader>\n  <TableBody>\n    <TableRow>\n      <TableCell className="font-medium">INV001</TableCell>\n      <TableCell>Paid</TableCell>\n      <TableCell>Credit Card</TableCell>\n      <TableCell className="text-right">$250.00</TableCell>\n    </TableRow>\n  </TableBody>\n</Table>\n```\n\n### Composition\n\nUse the following composition to build a `Table`:\n\n```text\nTable\n├── TableCaption\n├── TableHeader\n│   └── TableRow\n│       ├── TableHead\n│       ├── TableHead\n│       ├── TableHead\n│       └── TableHead\n├── TableBody\n│   ├── TableRow\n│   │   ├── TableCell\n│   │   ├── TableCell\n│   │   ├── TableCell\n│   │   └── TableCell\n│   └── TableRow\n│       ├── TableCell\n│       ├── TableCell\n│       ├── TableCell\n│       └── TableCell\n└── TableFooter\n```\n\n### TanStack Table\n\n`Table` renders markup only. The examples drive it with [TanStack Table v9](https://tanstack.com/table/latest): declare the features a table uses with `tableFeatures()`, define columns with `createColumnHelper()`, create the instance with `useTable()`, then map `getHeaderGroups()`, `getRowModel()` and `getFooterGroups()` onto `TableHead`, `TableCell` and `TableFooter` through `table.FlexRender`.\n\n```tsx\nimport { createColumnHelper, tableFeatures, useTable } from "@tanstack/react-table"\n\nconst features = tableFeatures({})\nconst columnHelper = createColumnHelper<typeof features, Invoice>()\nconst columns = columnHelper.columns([\n  columnHelper.accessor("invoice", { header: "Invoice" }),\n])\n\nconst table = useTable({ features, columns, data })\n```\n\nColumn `meta` (typed with `metaHelper`) carries per-column classes such as `text-end`. See the shadcn [Data Table](https://ui.shadcn.com/docs/components/base/data-table) guide for sorting, filtering and pagination.',
      },
    },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj;

type PlaygroundArgs = { rows: number; caption: string };
type PlaygroundRow = { item: string; value: number };

const playgroundFeatures = tableFeatures({});
const playgroundColumnHelper = createColumnHelper<typeof playgroundFeatures, PlaygroundRow>();
const playgroundColumns = playgroundColumnHelper.columns([
  playgroundColumnHelper.accessor("item", { header: "Item" }),
  playgroundColumnHelper.accessor("value", { header: "Value" }),
]);

function PlaygroundTable({ rows, caption }: PlaygroundArgs) {
  const data = Array.from({ length: rows }, (_, index) => ({
    item: `Item ${index + 1}`,
    value: index + 1,
  }));
  const table = useTable({ features: playgroundFeatures, columns: playgroundColumns, data });

  return (
    <Table className="w-80">
      <TableCaption>{caption}</TableCaption>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                <table.FlexRender header={header} />
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getAllCells().map((cell) => (
              <TableCell key={cell.id}>
                <table.FlexRender cell={cell} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export const Playground: StoryObj<PlaygroundArgs> = {
  args: { rows: 3, caption: "Example data" },
  argTypes: {
    rows: { control: { type: "number", min: 1, max: 10 } },
    caption: { control: "text" },
  },
  render: (args) => <PlaygroundTable {...args} />,
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import {\n  Table,\n  TableBody,\n  TableCaption,\n  TableCell,\n  TableFooter,\n  TableHead,\n  TableHeader,\n  TableRow,\n} from "@erbium/ui/components/table";\nimport { createColumnHelper, metaHelper, tableFeatures, useTable } from "@tanstack/react-table";\n\ntype Invoice = {\n  invoice: string;\n  paymentStatus: string;\n  paymentMethod: string;\n  totalAmount: number;\n};\n\nconst invoices: Invoice[] = [\n  { invoice: "INV001", paymentStatus: "Paid", paymentMethod: "Credit Card", totalAmount: 250 },\n  { invoice: "INV002", paymentStatus: "Pending", paymentMethod: "PayPal", totalAmount: 150 },\n  { invoice: "INV003", paymentStatus: "Unpaid", paymentMethod: "Bank Transfer", totalAmount: 350 },\n  { invoice: "INV004", paymentStatus: "Paid", paymentMethod: "Credit Card", totalAmount: 450 },\n  { invoice: "INV005", paymentStatus: "Paid", paymentMethod: "PayPal", totalAmount: 550 },\n  { invoice: "INV006", paymentStatus: "Pending", paymentMethod: "Bank Transfer", totalAmount: 200 },\n  { invoice: "INV007", paymentStatus: "Unpaid", paymentMethod: "Credit Card", totalAmount: 300 },\n];\n\nconst currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });\n\n// Column meta carries the classes shared by a column\'s head, cells and footer.\nconst features = tableFeatures({ columnMeta: metaHelper<{ className?: string }>() });\n\nconst columnHelper = createColumnHelper<typeof features, Invoice>();\n\nconst columns = columnHelper.columns([\n  columnHelper.accessor("invoice", {\n    header: "Invoice",\n    cell: (info) => <span className="font-medium">{info.getValue()}</span>,\n    footer: "Total",\n    meta: { className: "w-[100px]" },\n  }),\n  columnHelper.accessor("paymentStatus", { header: "Status" }),\n  columnHelper.accessor("paymentMethod", { header: "Method" }),\n  columnHelper.accessor("totalAmount", {\n    header: "Amount",\n    cell: (info) => currency.format(info.getValue()),\n    footer: ({ table }) =>\n      currency.format(\n        table.getRowModel().rows.reduce((sum, row) => sum + row.original.totalAmount, 0),\n      ),\n    meta: { className: "text-end" },\n  }),\n]);\n\nexport default function TableDemo() {\n  const table = useTable({ features, columns, data: invoices });\n\n  return (\n    <Table>\n      <TableCaption>A list of your recent invoices.</TableCaption>\n      <TableHeader>\n        {table.getHeaderGroups().map((headerGroup) => (\n          <TableRow key={headerGroup.id}>\n            {headerGroup.headers.map((header) => (\n              <TableHead className={header.column.columnDef.meta?.className} key={header.id}>\n                {header.isPlaceholder ? null : <table.FlexRender header={header} />}\n              </TableHead>\n            ))}\n          </TableRow>\n        ))}\n      </TableHeader>\n      <TableBody>\n        {table.getRowModel().rows.map((row) => (\n          <TableRow key={row.id}>\n            {row.getAllCells().map((cell) => (\n              <TableCell className={cell.column.columnDef.meta?.className} key={cell.id}>\n                <table.FlexRender cell={cell} />\n              </TableCell>\n            ))}\n          </TableRow>\n        ))}\n      </TableBody>\n      <TableFooter>\n        {table.getFooterGroups().map((footerGroup) => (\n          <TableRow key={footerGroup.id}>\n            {footerGroup.headers.map((footer) => (\n              <TableCell className={footer.column.columnDef.meta?.className} key={footer.id}>\n                <table.FlexRender footer={footer} />\n              </TableCell>\n            ))}\n          </TableRow>\n        ))}\n      </TableFooter>\n    </Table>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Footer: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Define `footer` on a column and render `getFooterGroups()` inside `<TableFooter />`. The total is computed from the row model, so it stays correct as rows change.",
      },
      source: {
        code: 'import {\n  Table,\n  TableBody,\n  TableCaption,\n  TableCell,\n  TableFooter,\n  TableHead,\n  TableHeader,\n  TableRow,\n} from "@erbium/ui/components/table";\nimport { createColumnHelper, metaHelper, tableFeatures, useTable } from "@tanstack/react-table";\n\ntype Invoice = {\n  invoice: string;\n  paymentStatus: string;\n  paymentMethod: string;\n  totalAmount: number;\n};\n\nconst invoices: Invoice[] = [\n  { invoice: "INV001", paymentStatus: "Paid", paymentMethod: "Credit Card", totalAmount: 250 },\n  { invoice: "INV002", paymentStatus: "Pending", paymentMethod: "PayPal", totalAmount: 150 },\n  { invoice: "INV003", paymentStatus: "Unpaid", paymentMethod: "Bank Transfer", totalAmount: 350 },\n  { invoice: "INV004", paymentStatus: "Paid", paymentMethod: "Credit Card", totalAmount: 450 },\n  { invoice: "INV005", paymentStatus: "Paid", paymentMethod: "PayPal", totalAmount: 550 },\n  { invoice: "INV006", paymentStatus: "Pending", paymentMethod: "Bank Transfer", totalAmount: 200 },\n  { invoice: "INV007", paymentStatus: "Unpaid", paymentMethod: "Credit Card", totalAmount: 300 },\n];\n\nconst currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });\n\n// Column meta carries the classes shared by a column\'s head, cells and footer.\nconst features = tableFeatures({ columnMeta: metaHelper<{ className?: string }>() });\n\nconst columnHelper = createColumnHelper<typeof features, Invoice>();\n\nconst columns = columnHelper.columns([\n  columnHelper.accessor("invoice", {\n    header: "Invoice",\n    cell: (info) => <span className="font-medium">{info.getValue()}</span>,\n    footer: "Total",\n    meta: { className: "w-[100px]" },\n  }),\n  columnHelper.accessor("paymentStatus", { header: "Status" }),\n  columnHelper.accessor("paymentMethod", { header: "Method" }),\n  columnHelper.accessor("totalAmount", {\n    header: "Amount",\n    cell: (info) => currency.format(info.getValue()),\n    footer: ({ table }) =>\n      currency.format(\n        table.getRowModel().rows.reduce((sum, row) => sum + row.original.totalAmount, 0),\n      ),\n    meta: { className: "text-end" },\n  }),\n]);\n\nexport function TableFooterExample() {\n  const table = useTable({ features, columns, data: invoices.slice(0, 3) });\n\n  return (\n    <Table>\n      <TableCaption>A list of your recent invoices.</TableCaption>\n      <TableHeader>\n        {table.getHeaderGroups().map((headerGroup) => (\n          <TableRow key={headerGroup.id}>\n            {headerGroup.headers.map((header) => (\n              <TableHead className={header.column.columnDef.meta?.className} key={header.id}>\n                {header.isPlaceholder ? null : <table.FlexRender header={header} />}\n              </TableHead>\n            ))}\n          </TableRow>\n        ))}\n      </TableHeader>\n      <TableBody>\n        {table.getRowModel().rows.map((row) => (\n          <TableRow key={row.id}>\n            {row.getAllCells().map((cell) => (\n              <TableCell className={cell.column.columnDef.meta?.className} key={cell.id}>\n                <table.FlexRender cell={cell} />\n              </TableCell>\n            ))}\n          </TableRow>\n        ))}\n      </TableBody>\n      <TableFooter>\n        {table.getFooterGroups().map((footerGroup) => (\n          <TableRow key={footerGroup.id}>\n            {footerGroup.headers.map((footer) => (\n              <TableCell className={footer.column.columnDef.meta?.className} key={footer.id}>\n                <table.FlexRender footer={footer} />\n              </TableCell>\n            ))}\n          </TableRow>\n        ))}\n      </TableFooter>\n    </Table>\n  );\n}\n',
      },
    },
  },
  render: () => <TableFooterExample />,
};
export const Actions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A display column (`columnHelper.display`) renders a `<DropdownMenu />` of actions for each row.",
      },
      source: {
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport MoreHorizontalIcon from "@hugeicons/core-free-icons/MoreHorizontalIcon";\n\n\nimport { Button } from "@erbium/ui/components/button";\nimport {\n  DropdownMenu,\n  DropdownMenuContent,\n  DropdownMenuItem,\n  DropdownMenuSeparator,\n  DropdownMenuTrigger,\n} from "@erbium/ui/components/dropdown-menu";\nimport {\n  Table,\n  TableBody,\n  TableCell,\n  TableHead,\n  TableHeader,\n  TableRow,\n} from "@erbium/ui/components/table";\nimport { createColumnHelper, metaHelper, tableFeatures, useTable } from "@tanstack/react-table";\n\ntype Product = {\n  id: string;\n  name: string;\n  price: number;\n};\n\nconst products: Product[] = [\n  { id: "mouse", name: "Wireless Mouse", price: 29.99 },\n  { id: "keyboard", name: "Mechanical Keyboard", price: 129.99 },\n  { id: "hub", name: "USB-C Hub", price: 49.99 },\n];\n\nconst currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });\n\nconst features = tableFeatures({ columnMeta: metaHelper<{ className?: string }>() });\n\nconst columnHelper = createColumnHelper<typeof features, Product>();\n\nconst columns = columnHelper.columns([\n  columnHelper.accessor("name", {\n    header: "Product",\n    cell: (info) => <span className="font-medium">{info.getValue()}</span>,\n  }),\n  columnHelper.accessor("price", {\n    header: "Price",\n    cell: (info) => currency.format(info.getValue()),\n  }),\n  // Display columns have no accessor; they render UI for each row.\n  columnHelper.display({\n    id: "actions",\n    header: "Actions",\n    cell: ({ row }) => (\n      <DropdownMenu>\n        <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-8" />}>\n          <HugeiconsIcon icon={MoreHorizontalIcon} />\n          <span className="sr-only">Open menu for {row.original.name}</span>\n        </DropdownMenuTrigger>\n        <DropdownMenuContent align="end">\n          <DropdownMenuItem>Edit</DropdownMenuItem>\n          <DropdownMenuItem>Duplicate</DropdownMenuItem>\n          <DropdownMenuSeparator />\n          <DropdownMenuItem variant="error">Delete</DropdownMenuItem>\n        </DropdownMenuContent>\n      </DropdownMenu>\n    ),\n    meta: { className: "text-end" },\n  }),\n]);\n\nexport function TableActions() {\n  const table = useTable({ features, columns, data: products, getRowId: (row) => row.id });\n\n  return (\n    <Table>\n      <TableHeader>\n        {table.getHeaderGroups().map((headerGroup) => (\n          <TableRow key={headerGroup.id}>\n            {headerGroup.headers.map((header) => (\n              <TableHead className={header.column.columnDef.meta?.className} key={header.id}>\n                {header.isPlaceholder ? null : <table.FlexRender header={header} />}\n              </TableHead>\n            ))}\n          </TableRow>\n        ))}\n      </TableHeader>\n      <TableBody>\n        {table.getRowModel().rows.map((row) => (\n          <TableRow key={row.id}>\n            {row.getAllCells().map((cell) => (\n              <TableCell className={cell.column.columnDef.meta?.className} key={cell.id}>\n                <table.FlexRender cell={cell} />\n              </TableCell>\n            ))}\n          </TableRow>\n        ))}\n      </TableBody>\n    </Table>\n  );\n}\n',
      },
    },
  },
  render: () => <TableActions />,
};

export const RowSelection: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Register `rowSelectionFeature` and add a display column of checkboxes. Mark each selected `TableRow` with `data-state=selected`; the table joins adjacent selected rows automatically. The header is checked when `getIsAllRowsSelected()` and indeterminate when `getIsSomeRowsSelected()` is true but not all rows are, because in v9 `getIsSomeRowsSelected()` also counts a full selection.",
      },
      source: {
        code: 'import { Checkbox } from "@erbium/ui/components/checkbox";\nimport {\n  Table,\n  TableBody,\n  TableCell,\n  TableHead,\n  TableHeader,\n  TableRow,\n} from "@erbium/ui/components/table";\nimport {\n  createColumnHelper,\n  metaHelper,\n  rowSelectionFeature,\n  tableFeatures,\n  useTable,\n} from "@tanstack/react-table";\n\ntype User = {\n  id: string;\n  name: string;\n  email: string;\n  role: string;\n};\n\nconst tableData: User[] = [\n  { id: "1", name: "Sarah Chen", email: "sarah.chen@example.com", role: "Admin" },\n  { id: "2", name: "Marcus Rodriguez", email: "marcus.rodriguez@example.com", role: "User" },\n  { id: "3", name: "Priya Patel", email: "priya.patel@example.com", role: "User" },\n  { id: "4", name: "David Kim", email: "david.kim@example.com", role: "Editor" },\n];\n\nconst features = tableFeatures({\n  rowSelectionFeature,\n  columnMeta: metaHelper<{ className?: string }>(),\n});\n\nconst columnHelper = createColumnHelper<typeof features, User>();\n\nconst columns = columnHelper.columns([\n  columnHelper.display({\n    id: "select",\n    header: ({ table }) => (\n      <Checkbox\n        aria-label="Select all rows"\n        checked={table.getIsAllRowsSelected()}\n        // v9\'s getIsSomeRowsSelected() is also true when every row is selected.\n        indeterminate={table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}\n        onCheckedChange={(checked) => table.toggleAllRowsSelected(checked)}\n      />\n    ),\n    cell: ({ row }) => (\n      <Checkbox\n        aria-label={`Select ${row.original.name}`}\n        checked={row.getIsSelected()}\n        disabled={!row.getCanSelect()}\n        onCheckedChange={(checked) => row.toggleSelected(checked)}\n      />\n    ),\n    meta: { className: "w-8" },\n  }),\n  columnHelper.accessor("name", {\n    header: "Name",\n    cell: (info) => <span className="font-medium">{info.getValue()}</span>,\n  }),\n  columnHelper.accessor("email", { header: "Email" }),\n  columnHelper.accessor("role", { header: "Role" }),\n]);\n\nexport function CheckboxInTable() {\n  const table = useTable({\n    features,\n    columns,\n    data: tableData,\n    getRowId: (row) => row.id,\n    initialState: { rowSelection: { "1": true } },\n  });\n\n  return (\n    <Table>\n      <TableHeader>\n        {table.getHeaderGroups().map((headerGroup) => (\n          <TableRow key={headerGroup.id}>\n            {headerGroup.headers.map((header) => (\n              <TableHead className={header.column.columnDef.meta?.className} key={header.id}>\n                {header.isPlaceholder ? null : <table.FlexRender header={header} />}\n              </TableHead>\n            ))}\n          </TableRow>\n        ))}\n      </TableHeader>\n      <TableBody>\n        {table.getRowModel().rows.map((row) => (\n          <TableRow data-state={row.getIsSelected() ? "selected" : undefined} key={row.id}>\n            {row.getAllCells().map((cell) => (\n              <TableCell className={cell.column.columnDef.meta?.className} key={cell.id}>\n                <table.FlexRender cell={cell} />\n              </TableCell>\n            ))}\n          </TableRow>\n        ))}\n      </TableBody>\n    </Table>\n  );\n}\n',
      },
    },
  },
  render: () => <CheckboxInTable />,
};

export const RTL: Story = {
  name: "RTL",
  parameters: {
    docs: {
      description: {
        story:
          'Set `dir="rtl"` on the table. Columns use logical classes such as `text-end`, so alignment follows the reading direction.',
      },
      source: {
        code: 'import {\n  Table,\n  TableBody,\n  TableCaption,\n  TableCell,\n  TableFooter,\n  TableHead,\n  TableHeader,\n  TableRow,\n} from "@erbium/ui/components/table";\nimport { createColumnHelper, metaHelper, tableFeatures, useTable } from "@tanstack/react-table";\n\ntype Invoice = {\n  invoice: string;\n  paymentStatus: string;\n  paymentMethod: string;\n  totalAmount: number;\n};\n\nconst invoices: Invoice[] = [\n  { invoice: "INV001", paymentStatus: "مدفوع", paymentMethod: "بطاقة ائتمانية", totalAmount: 250 },\n  { invoice: "INV002", paymentStatus: "قيد الانتظار", paymentMethod: "PayPal", totalAmount: 150 },\n  { invoice: "INV003", paymentStatus: "غير مدفوع", paymentMethod: "تحويل بنكي", totalAmount: 350 },\n  { invoice: "INV004", paymentStatus: "مدفوع", paymentMethod: "بطاقة ائتمانية", totalAmount: 450 },\n];\n\nconst currency = new Intl.NumberFormat("ar", { style: "currency", currency: "USD" });\n\nconst features = tableFeatures({ columnMeta: metaHelper<{ className?: string }>() });\n\nconst columnHelper = createColumnHelper<typeof features, Invoice>();\n\n// Logical classes (`text-end`) follow the reading direction, so the same\n// columns lay out correctly in both LTR and RTL.\nconst columns = columnHelper.columns([\n  columnHelper.accessor("invoice", {\n    header: "الفاتورة",\n    cell: (info) => <span className="font-medium">{info.getValue()}</span>,\n    footer: "المجموع",\n    meta: { className: "w-[100px]" },\n  }),\n  columnHelper.accessor("paymentStatus", { header: "الحالة" }),\n  columnHelper.accessor("paymentMethod", { header: "الطريقة" }),\n  columnHelper.accessor("totalAmount", {\n    header: "المبلغ",\n    cell: (info) => currency.format(info.getValue()),\n    footer: ({ table }) =>\n      currency.format(\n        table.getRowModel().rows.reduce((sum, row) => sum + row.original.totalAmount, 0),\n      ),\n    meta: { className: "text-end" },\n  }),\n]);\n\nexport default function TableRtl() {\n  const table = useTable({ features, columns, data: invoices });\n\n  return (\n    <Table dir="rtl">\n      <TableCaption>قائمة بفواتيرك الأخيرة.</TableCaption>\n      <TableHeader>\n        {table.getHeaderGroups().map((headerGroup) => (\n          <TableRow key={headerGroup.id}>\n            {headerGroup.headers.map((header) => (\n              <TableHead className={header.column.columnDef.meta?.className} key={header.id}>\n                {header.isPlaceholder ? null : <table.FlexRender header={header} />}\n              </TableHead>\n            ))}\n          </TableRow>\n        ))}\n      </TableHeader>\n      <TableBody>\n        {table.getRowModel().rows.map((row) => (\n          <TableRow key={row.id}>\n            {row.getAllCells().map((cell) => (\n              <TableCell className={cell.column.columnDef.meta?.className} key={cell.id}>\n                <table.FlexRender cell={cell} />\n              </TableCell>\n            ))}\n          </TableRow>\n        ))}\n      </TableBody>\n      <TableFooter>\n        {table.getFooterGroups().map((footerGroup) => (\n          <TableRow key={footerGroup.id}>\n            {footerGroup.headers.map((footer) => (\n              <TableCell className={footer.column.columnDef.meta?.className} key={footer.id}>\n                <table.FlexRender footer={footer} />\n              </TableCell>\n            ))}\n          </TableRow>\n        ))}\n      </TableFooter>\n    </Table>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <TableRtl />
    </div>
  ),
};
