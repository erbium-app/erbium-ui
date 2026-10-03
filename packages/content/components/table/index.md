---
title: "Table"
description: "Display data in rows and columns."
---

## Usage

Display tabular data in a responsive layout.

**Import:** `@erbium/ui/components/table`

## Usage

```tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@erbium/ui/components/table";
```

```tsx
<Table>
  <TableCaption>A list of your recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Method</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">INV001</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell>Credit Card</TableCell>
      <TableCell className="text-right">$250.00</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## Composition

Use the following composition to build a `Table`:

```text
Table
├── TableCaption
├── TableHeader
│   └── TableRow
│       ├── TableHead
│       ├── TableHead
│       ├── TableHead
│       └── TableHead
├── TableBody
│   ├── TableRow
│   │   ├── TableCell
│   │   ├── TableCell
│   │   ├── TableCell
│   │   └── TableCell
│   └── TableRow
│       ├── TableCell
│       ├── TableCell
│       ├── TableCell
│       └── TableCell
└── TableFooter
```

## TanStack Table

`Table` renders markup only. The examples drive it with [TanStack Table v9](https://tanstack.com/table/latest): declare the features a table uses with `tableFeatures()`, define columns with `createColumnHelper()`, create the instance with `useTable()`, then map `getHeaderGroups()`, `getRowModel()` and `getFooterGroups()` onto `TableHead`, `TableCell` and `TableFooter` through `table.FlexRender`.

```tsx
import { createColumnHelper, tableFeatures, useTable } from "@tanstack/react-table";

const features = tableFeatures({});
const columnHelper = createColumnHelper<typeof features, Invoice>();
const columns = columnHelper.columns([columnHelper.accessor("invoice", { header: "Invoice" })]);

const table = useTable({ features, columns, data });
```

Column `meta` (typed with `metaHelper`) carries per-column classes such as `text-end`. See the shadcn [Data Table](https://ui.shadcn.com/docs/components/base/data-table) guide for sorting, filtering and pagination.
