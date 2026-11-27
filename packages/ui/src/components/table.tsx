import * as React from "react";
import { tableStyles } from "../lib/table-styles";
import { cn } from "../lib/utils";

const Table = ({
  className,
  containerProps,
  ...props
}: React.ComponentProps<"table"> & { containerProps?: React.ComponentProps<"div"> }) => (
  <div
    {...containerProps}
    data-slot="table-container"
    className={cn("relative w-full overflow-x-auto", containerProps?.className)}
  >
    <table data-slot="table" className={cn(tableStyles.table, className)} {...props} />
  </div>
);

const TableHeader = ({ className, ...props }: React.ComponentProps<"thead">) => (
  <thead data-slot="table-header" className={cn(tableStyles.tableHeader, className)} {...props} />
);

const TableBody = ({ className, ...props }: React.ComponentProps<"tbody">) => (
  <tbody data-slot="table-body" className={cn(tableStyles.tableBody, className)} {...props} />
);

const TableFooter = ({ className, ...props }: React.ComponentProps<"tfoot">) => (
  <tfoot data-slot="table-footer" className={cn(tableStyles.tableFooter, className)} {...props} />
);

const TableRow = ({ className, ...props }: React.ComponentProps<"tr">) => (
  <tr data-slot="table-row" className={cn(tableStyles.tableRow, className)} {...props} />
);

const TableHead = ({ className, ...props }: React.ComponentProps<"th">) => (
  <th data-slot="table-head" className={cn(tableStyles.tableHead, className)} {...props} />
);

const TableCell = ({ className, ...props }: React.ComponentProps<"td">) => (
  <td data-slot="table-cell" className={cn(tableStyles.tableCell, className)} {...props} />
);

const TableCaption = ({ className, ...props }: React.ComponentProps<"caption">) => (
  <caption
    data-slot="table-caption"
    className={cn(tableStyles.tableCaption, className)}
    {...props}
  />
);

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };

/** TanStack Table's headless hook used with the Erbium Table primitives. */
export { useTable } from "@tanstack/react-table";
