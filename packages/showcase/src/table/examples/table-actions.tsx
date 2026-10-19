import { cn } from "@erbium/ui/lib/utils";
import { Icon } from "@erbium/ui/components/icon";

import { Button } from "@erbium/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuList,
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

interface Product {
  id: string;
  name: string;
  price: number;
}

const products: Product[] = [
  { id: "mouse", name: "Wireless Mouse", price: 29.99 },
  { id: "keyboard", name: "Mechanical Keyboard", price: 129.99 },
  { id: "hub", name: "USB-C Hub", price: 49.99 },
];

const currency = new Intl.NumberFormat("en-US", { currency: "USD", style: "currency" });

const features = tableFeatures({
  columnMeta: metaHelper<{ alignment?: "end"; narrow?: boolean }>(),
});

const columnHelper = createColumnHelper<typeof features, Product>();

const columns = columnHelper.columns([
  columnHelper.accessor("name", {
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    header: "Product",
  }),
  columnHelper.accessor("price", {
    cell: (info) => currency.format(info.getValue()),
    header: "Price",
  }),
  // Display columns have no accessor; they render UI for each row.
  columnHelper.display({
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
          <Icon name="more-horizontal" />
          <span className="sr-only">Open menu for {row.original.name}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuList>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="error">Delete</DropdownMenuItem>
          </DropdownMenuList>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    header: "Actions",
    id: "actions",
    meta: { alignment: "end" },
  }),
]);

export function TableActions() {
  const table = useTable({ columns, data: products, features, getRowId: (row) => row.id });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                className={cn(
                  header.column.columnDef.meta?.alignment === "end" && "text-end",
                  header.column.columnDef.meta?.narrow && "w-25",
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
                  cell.column.columnDef.meta?.alignment === "end" && "text-end",
                  cell.column.columnDef.meta?.narrow && "w-25",
                )}
                key={cell.id}
              >
                <table.FlexRender cell={cell} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
