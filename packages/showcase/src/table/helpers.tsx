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

export interface PlaygroundArgs {
  rows: number;
  caption: string;
}

interface PlaygroundRow {
  item: string;
  value: number;
}

const playgroundFeatures = tableFeatures({});

const playgroundColumnHelper = createColumnHelper<typeof playgroundFeatures, PlaygroundRow>();

const playgroundColumns = playgroundColumnHelper.columns([
  playgroundColumnHelper.accessor("item", { header: "Item" }),
  playgroundColumnHelper.accessor("value", { header: "Value" }),
]);

export const PlaygroundTable = ({ rows, caption }: PlaygroundArgs) => {
  const data = Array.from({ length: rows }, (_, index) => ({
    item: `Item ${index + 1}`,
    value: index + 1,
  }));

  const table = useTable({ columns: playgroundColumns, data, features: playgroundFeatures });

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
};
