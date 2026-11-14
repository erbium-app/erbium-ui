import type { ReactTable, RowData, TableFeatures } from "@tanstack/react-table";
import type { ComponentProps, ReactNode } from "react";
import { Button } from "../components/button";
import { Icon } from "../components/icon";
import { Skeleton } from "../components/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/table";
import { skeletonKnown } from "../lib/skeleton-hints";
import { cn } from "../lib/utils";

type DataTableProps<TFeatures extends TableFeatures, TData extends RowData, TSelected> = Omit<
  ComponentProps<"div">,
  "children"
> & {
  table: ReactTable<TFeatures, TData, TSelected>;
  /**
   * The rows are loading. Their skeleton is measured from the rows the table holds: the rows on
   * screen during a refetch, or sample rows (give the table sample data) for the first load. The
   * header is known, so it stays readable.
   */
  loading?: boolean;
  /** Remembers the table's shape across visits under this key, so a reload draws it exactly. */
  id?: string;
  /** Read to screen readers while the rows load. */
  label?: string;
  /** Shown in place of the table when the rows could not load. */
  error?: ReactNode | Error;
  /** Shown in the body when there are no rows. */
  empty?: ReactNode;
  /**
   * Column widths by column id, as CSS lengths. With them the table lays out at fixed widths, so the
   * sample rows of the first load cannot size the columns differently from the rows that replace
   * them; columns left out share the remaining width.
   */
  columnWidths?: Partial<Record<string, string>>;
  /** Props for each body row, such as `data-state="selected"` for a selected row. */
  rowProps?: (
    row: ReturnType<ReactTable<TFeatures, TData, TSelected>["getRowModel"]>["rows"][number],
  ) => ComponentProps<"tr"> & Partial<Record<`data-${string}`, string>>;
};

const DataTable = <TFeatures extends TableFeatures, TData extends RowData, TSelected>({
  table,
  loading = false,
  id,
  label = "Loading rows",
  error,
  empty,
  rowProps,
  columnWidths,
  className,
  ...props
}: DataTableProps<TFeatures, TData, TSelected>) => {
  const { rows } = table.getRowModel();
  const columns = table.getAllLeafColumns();

  return (
    <div data-slot="data-table" className={cn("w-full min-w-0", className)} {...props}>
      <Skeleton loading={loading} id={id} label={label} error={error}>
        <Table className={columnWidths === undefined ? undefined : "table-fixed"}>
          {columnWidths === undefined ? null : (
            <colgroup>
              {columns.map((column) => (
                <col key={column.id} style={{ width: columnWidths[column.id] }} />
              ))}
            </colgroup>
          )}
          <TableHeader {...skeletonKnown}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length === 0 && !loading ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="p-0 whitespace-normal">
                  {empty}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id} {...rowProps?.(row)}>
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Skeleton>
    </div>
  );
};

/** The parts of a sortable column a header needs; any column with `rowSortingFeature` has them. */
interface SortableColumn {
  getCanSort: () => boolean;
  getIsSorted: () => false | "asc" | "desc";
  toggleSorting: (desc?: boolean) => void;
}

const sortIcon = { asc: "arrow-up-01", desc: "arrow-down-01", none: "arrow-up-down" } as const;

/** A column header that sorts its column, announcing the current order. */
const DataTableColumnHeader = ({
  column,
  children,
  className,
}: {
  column: SortableColumn;
  children: ReactNode;
  className?: string;
}) => {
  if (!column.getCanSort()) {
    return <span className={className}>{children}</span>;
  }

  const sorted = column.getIsSorted();

  return (
    <Button
      variant="ghost"
      size="xs"
      className={cn("-ms-2", className)}
      onClick={() => {
        column.toggleSorting(sorted === "asc");
      }}
    >
      {children}
      <Icon
        name={sortIcon[sorted === false ? "none" : sorted]}
        data-icon="inline-end"
        aria-hidden="true"
        className={sorted === false ? "text-muted-foreground" : undefined}
      />
      <span className="sr-only">
        {sorted === false
          ? ", not sorted"
          : `, sorted ${sorted === "asc" ? "ascending" : "descending"}`}
      </span>
    </Button>
  );
};

/** The row of filters and actions above a data table. It is known content, so it stays readable while rows load. */
const DataTableToolbar = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    data-slot="data-table-toolbar"
    className={cn("flex flex-wrap items-center justify-between gap-related", className)}
    {...props}
  />
);

export { DataTable, DataTableColumnHeader, DataTableToolbar };

export type { DataTableProps, SortableColumn };
