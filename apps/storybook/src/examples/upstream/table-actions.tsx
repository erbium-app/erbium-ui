import { HugeiconsIcon } from "@hugeicons/react";
import MoreHorizontalIcon from "@hugeicons/core-free-icons/MoreHorizontalIcon";

import { Button } from "@erbium/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@erbium/ui/components/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@erbium/ui/components/table";
import { createColumnHelper, metaHelper, tableFeatures, useTable } from "@tanstack/react-table";

type Product = {
  id: string;
  name: string;
  price: number;
};

const products: Product[] = [
  { id: "mouse", name: "Wireless Mouse", price: 29.99 },
  { id: "keyboard", name: "Mechanical Keyboard", price: 129.99 },
  { id: "hub", name: "USB-C Hub", price: 49.99 },
];

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const features = tableFeatures({ columnMeta: metaHelper<{ className?: string }>() });

const columnHelper = createColumnHelper<typeof features, Product>();

const columns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: "Product",
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
  }),
  columnHelper.accessor("price", {
    header: "Price",
    cell: (info) => currency.format(info.getValue()),
  }),
  // Display columns have no accessor; they render UI for each row.
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-8" />}>
          <HugeiconsIcon icon={MoreHorizontalIcon} />
          <span className="sr-only">Open menu for {row.original.name}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="error">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    meta: { className: "text-end" },
  }),
]);

export function TableActions() {
  const table = useTable({ features, columns, data: products, getRowId: (row) => row.id });

  return (
    <Table>
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
    </Table>
  );
}
