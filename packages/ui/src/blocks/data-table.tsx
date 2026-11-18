import * as React from "react";
import { useDebouncedCallback } from "@tanstack/react-pacer/debouncer";
import { FlexRender, Subscribe } from "@tanstack/react-table";
import type { CellContext, HeaderContext, Row, RowData } from "@tanstack/react-table";
import { Button } from "../components/button";
import { Checkbox } from "../components/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "../components/empty";
import { Icon } from "../components/icon";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../components/input-group";
import { Pagination, PaginationControls } from "../components/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/select";
import { Separator } from "../components/separator";
import { Skeleton } from "../components/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/table";
import { useDataTableContext } from "../hooks/use-data-table";
import type { DataTableFeatures, DataTableInstance } from "../hooks/use-data-table";
import { useTableFilters } from "../hooks/use-filters";
import { dataTablePageSizes } from "../lib/data-table-search";
import { skeletonKnown } from "../lib/skeleton-hints";
import { cn } from "../lib/utils";
import { FilterBar, FilterFacets } from "./filters";

/*
 * A data table is a table built by `useDataTable`, given to `DataTable`,
 * and composed from the parts below. Every part reads the table from context:
 *
 *   <DataTable table={table}>
 *     <DataTableToolbar>
 *       <DataTableSearch />
 *       <DataTableFilters />
 *       <DataTableViewOptions />
 *     </DataTableToolbar>
 *     <DataTableContent loading={query.isFetching} />
 *     <DataTablePagination />
 *     <DataTableActionBar>…</DataTableActionBar>
 *   </DataTable>
 */

type Column = ReturnType<DataTableInstance["getAllLeafColumns"]>[number];

type Header = ReturnType<DataTableInstance["getFlatHeaders"]>[number];

const isText = <TValue,>(value: TValue): value is TValue & string => typeof value === "string";

/** A column's name in menus: its `meta.label`, its string header, or its id. */
const columnLabel = (column: Column) => {
  const { header, meta } = column.columnDef;

  return meta?.label ?? meta?.filter?.label ?? (isText(header) ? header : column.id);
};

interface DataTableProps<TData extends RowData> extends React.ComponentProps<"div"> {
  table: DataTableInstance<TData>;
  /**
   * Opens a row, such as its detail page, when the row is clicked. Clicks on a control in the row
   * (a checkbox, a menu, a link) are left to that control. Rows are not focusable, so also render
   * a link to the row in one of its cells for keyboards and for opening it in a new tab.
   */
  onRowClick?: (row: Row<DataTableFeatures, TData>) => void;
}

/** Opens a row by id, when the table's rows can be opened. */
const RowClickContext = React.createContext<((rowId: string) => void) | undefined>(undefined);

/** The rows on screen are being replaced, so their selection is not shown. */
const LoadingContext = React.createContext(false);

const interactive =
  "a, button, input, label, select, textarea, [contenteditable], [role=button], [role=checkbox], [role=menuitem], [role=switch]";

/** A click on the row itself: not on a control inside it, nor in a menu it opened, nor a text selection. */
const isRowClick = ({ target, currentTarget }: React.MouseEvent<HTMLElement>) => {
  if (!(target instanceof Element) || !currentTarget.contains(target)) {
    return false;
  }

  const control = target.closest(interactive);

  return (
    (control === null || !currentTarget.contains(control)) &&
    globalThis.getSelection()?.type !== "Range"
  );
};

/** Provides the table to its parts, which read it from context. */
const DataTable = <TData extends RowData>({
  table,
  onRowClick,
  className,
  ...props
}: DataTableProps<TData>) => {
  const openRowById = React.useCallback(
    (rowId: string) => {
      onRowClick?.(table.getRow(rowId, true));
    },
    [onRowClick, table],
  );

  const openRow = onRowClick === undefined ? undefined : openRowById;

  return (
    <table.AppTable>
      <RowClickContext value={openRow}>
        <div
          data-slot="data-table"
          className={cn("flex w-full min-w-0 flex-col gap-group", className)}
          {...props}
        />
      </RowClickContext>
    </table.AppTable>
  );
};

/** The row of search, filters and view options above the table. Stays readable while rows load. */
const DataTableToolbar = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="data-table-toolbar"
    className={cn("flex flex-wrap items-center gap-related", className)}
    {...props}
  />
);

/**
 * Searches every column. A server table waits for a pause in typing before it asks for rows;
 * a browser table filters on each keystroke.
 */
const DataTableSearch = ({
  placeholder = "Search",
  className,
}: {
  placeholder?: string;
  className?: string;
}) => {
  const table = useDataTableContext();
  const value = String(table.state.globalFilter ?? "");
  const [draft, setDraft] = React.useState(value);
  const [seen, setSeen] = React.useState(value);

  // The search changed elsewhere, such as Back or a cleared filter: show it.
  if (value !== seen) {
    setSeen(value);
    setDraft(value);
  }

  const commit = useDebouncedCallback(
    (next: string) => {
      table.setGlobalFilter(next);
    },
    { wait: table.options.manualFiltering === true ? 300 : 0 },
  );

  const change = (next: string) => {
    setDraft(next);
    commit(next);
  };

  return (
    <InputGroup data-slot="data-table-search" className={cn("w-full sm:max-w-64", className)}>
      <InputGroupAddon>
        <Icon name="search-01" aria-hidden="true" />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        aria-label={placeholder}
        placeholder={placeholder}
        value={draft}
        onChange={(event) => {
          change(event.target.value);
        }}
      />
      {draft === "" ? null : (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            aria-label="Clear search"
            onClick={() => {
              change("");
            }}
          >
            <Icon name="x" aria-hidden="true" />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
};

interface DataTableFiltersProps extends Omit<React.ComponentProps<"div">, "children"> {
  /**
   * Option counts by column id, for a server table: it holds one page, so counts it derives would
   * describe that page rather than every row.
   */
  counts?: Partial<Record<string, Map<string, number>>>;
}

/** Filter chips for the columns with a `meta.filter` config: an add-filter menu, then a chip per rule. */
const DataTableFilters = ({ counts, ...props }: DataTableFiltersProps) => {
  const filters = useTableFilters(useDataTableContext(), { counts });

  return <FilterBar filters={filters} {...props} />;
};

/** A filter button per filterable column, for tables with a few fixed filters. */
const DataTableFacets = ({
  counts,
  fields,
  ...props
}: DataTableFiltersProps & { fields?: string[] }) => {
  const filters = useTableFilters(useDataTableContext(), { counts });

  return <FilterFacets filters={filters} fields={fields} {...props} />;
};

/** Shows and hides columns. Lists every data column that can be hidden. */
const DataTableViewOptions = ({ className }: { className?: string }) => {
  const table = useDataTableContext();

  const columns = table
    .getAllLeafColumns()
    .filter((column) => column.accessorFn !== undefined && column.getCanHide());

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline" size="sm" className={cn("ms-auto", className)} />}
      >
        <Icon name="settings-01" aria-hidden="true" data-icon="inline-start" />
        View
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Columns</DropdownMenuLabel>
          {columns.map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.getIsVisible()}
              onCheckedChange={(checked) => {
                column.toggleVisibility(checked);
              }}
            >
              {columnLabel(column)}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ariaSort = { asc: "ascending", desc: "descending" } as const;

/**
 * A header cell's content. A column that can be sorted or hidden opens a menu with those actions;
 * the current sort shows as an arrow.
 */
const DataTableColumnHeader = ({ header }: { header: Header }) => {
  const { column } = header;
  const canSort = column.getCanSort();
  const canHide = column.accessorFn !== undefined && column.getCanHide();
  const sorted = column.getIsSorted();
  const content = <FlexRender header={header} />;

  if (!canSort && !canHide) {
    return content;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="xs" className="-mx-2 font-medium" />}
      >
        {content}
        {sorted === false ? null : (
          <Icon
            name={sorted === "asc" ? "arrow-up-01" : "arrow-down-01"}
            aria-hidden="true"
            data-icon="inline-end"
          />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={column.columnDef.meta?.align === "end" ? "end" : "start"}>
        {canSort ? (
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                column.toggleSorting(false);
              }}
            >
              <Icon name="arrow-up-01" aria-hidden="true" />
              Sort ascending
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                column.toggleSorting(true);
              }}
            >
              <Icon name="arrow-down-01" aria-hidden="true" />
              Sort descending
            </DropdownMenuItem>
            {sorted === false ? null : (
              <DropdownMenuItem
                onClick={() => {
                  column.clearSorting();
                }}
              >
                <Icon name="x" aria-hidden="true" />
                Clear sort
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        ) : null}
        {canSort && canHide ? <DropdownMenuSeparator /> : null}
        {canHide ? (
          <DropdownMenuItem
            onClick={() => {
              column.toggleVisibility(false);
            }}
          >
            <Icon name="eye-off" aria-hidden="true" />
            Hide column
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/** The empty state: offers to clear the search and filters when they hide every row. */
const DataTableEmpty = () => {
  const table = useDataTableContext();
  const filtered = table.state.columnFilters.length > 0 || table.state.globalFilter !== "";

  return (
    <Empty className="border-0">
      <EmptyHeader>
        <EmptyTitle>{filtered ? "No matching rows" : "No rows yet"}</EmptyTitle>
        <EmptyDescription>
          {filtered ? "Change the search or filters." : "Rows appear here once they are added."}
        </EmptyDescription>
      </EmptyHeader>
      {filtered ? (
        <EmptyContent>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.resetColumnFilters(true);
              table.resetGlobalFilter(true);
            }}
          >
            Clear filters
          </Button>
        </EmptyContent>
      ) : null}
    </Empty>
  );
};

interface DataTableContentProps extends React.ComponentProps<"table"> {
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
  error?: React.ReactNode | Error;
  /** Shown in the body when there are no rows. Defaults to `DataTableEmpty`. */
  empty?: React.ReactNode;
}

/**
 * The table itself. Columns with a `size` (in pixels) get that width and the table lays out at
 * fixed widths, so sample rows cannot size the columns differently from the rows that replace
 * them; columns without one share the remaining width.
 */
const DataTableContent = ({
  loading = false,
  id,
  label = "Loading rows",
  error,
  empty,
  className,
  ...props
}: DataTableContentProps) => {
  const table = useDataTableContext();
  const openRow = React.use(RowClickContext);
  const columns = table.getVisibleLeafColumns();
  const { rows } = table.getRowModel();
  const sized = columns.some((column) => column.columnDef.size !== undefined);

  return (
    <Skeleton loading={loading} id={id} label={label} error={error}>
      <LoadingContext value={loading}>
        <Table className={cn(sized && "table-fixed", className)} {...props}>
          {sized ? (
            <colgroup>
              {columns.map((column) => (
                <col key={column.id} style={{ width: column.columnDef.size }} />
              ))}
            </colgroup>
          ) : null}
          <TableHeader {...skeletonKnown}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sorted = header.column.getIsSorted();

                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      aria-sort={sorted === false ? undefined : ariaSort[sorted]}
                      data-align={header.column.columnDef.meta?.align}
                      className="data-[align=end]:text-end"
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center in-data-[align=end]:justify-end">
                          <DataTableColumnHeader header={header} />
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length === 0 && !loading ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="p-0 whitespace-normal">
                  {empty ?? <DataTableEmpty />}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  // The selected tint is a cell background, which the skeleton would draw as a
                  // block over the row, so loading rows show plain; it returns with the rows.
                  data-state={!loading && row.getIsSelected() ? "selected" : undefined}
                  className={cn(openRow !== undefined && "cursor-pointer")}
                  onClick={
                    openRow === undefined
                      ? undefined
                      : (event) => {
                          if (isRowClick(event)) {
                            openRow(row.id);
                          }
                        }
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      data-align={cell.column.columnDef.meta?.align}
                      className="data-[align=end]:text-end"
                    >
                      <FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </LoadingContext>
    </Skeleton>
  );
};

/**
 * The row count, the page size and the page controls. Counts selected rows while any are
 * selected.
 */
const DataTablePagination = ({
  pageSizes = dataTablePageSizes,
  className,
  ...props
}: React.ComponentProps<"div"> & { pageSizes?: readonly number[] }) => {
  const table = useDataTableContext();
  const { pageIndex, pageSize } = table.state.pagination;
  const rowCount = table.getRowCount();
  const selected = table.getSelectedRowIds().length;
  const sizes = pageSizes.includes(pageSize) ? pageSizes : [pageSize, ...pageSizes];

  return (
    <div
      data-slot="data-table-pagination"
      className={cn(
        "flex flex-wrap items-center justify-between gap-related text-caption text-muted-foreground",
        className,
      )}
      {...props}
    >
      <span aria-live="polite" className="tabular-nums">
        {selected > 0
          ? `${selected.toLocaleString()} of ${rowCount.toLocaleString()} selected`
          : `${rowCount.toLocaleString()} ${rowCount === 1 ? "row" : "rows"}`}
      </span>
      <div className="flex flex-wrap items-center gap-related">
        <Select
          value={pageSize}
          items={sizes.map((size) => ({ label: `${size} per page`, value: size }))}
          onValueChange={(size) => {
            if (size !== null) {
              table.setPageSize(size);
            }
          }}
        >
          <SelectTrigger size="sm" aria-label="Rows per page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sizes.map((size) => (
              <SelectItem key={size} value={size}>
                {size} per page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Pagination className="mx-0 w-auto">
          <PaginationControls
            page={pageIndex + 1}
            pageCount={Math.max(table.getPageCount(), 1)}
            onPageChange={(page) => {
              table.setPageIndex(page - 1);
            }}
          />
        </Pagination>
      </div>
    </div>
  );
};

/** Actions for the selected rows. Shown while rows are selected; read them with `useDataTableContext`. */
const DataTableActionBar = ({ className, children, ...props }: React.ComponentProps<"div">) => {
  const table = useDataTableContext();
  const selected = table.getSelectedRowIds().length;

  if (selected === 0) {
    return null;
  }

  return (
    <div
      role="toolbar"
      aria-label="Selected rows"
      data-slot="data-table-action-bar"
      className={cn(
        "sticky bottom-4 z-10 mx-auto flex w-fit items-center gap-related rounded-xl surface-overlay p-1 ps-3 text-caption animate-in fade-in-0 slide-in-from-bottom-2 motion-reduce:animate-none",
        className,
      )}
      {...props}
    >
      <span className="tabular-nums">{selected.toLocaleString()} selected</span>
      <Separator orientation="vertical" className="h-4" />
      {children}
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Clear selection"
        onClick={() => {
          table.resetRowSelection(true);
        }}
      >
        <Icon name="x" aria-hidden="true" />
      </Button>
    </div>
  );
};

/**
 * The header of a selection column: selects every row on the page. Checked when every row on the
 * page is selected, and mixed while any row is selected, on this page or another, so a selection
 * made elsewhere stays in view.
 */
const DataTableSelectAll = <TData extends RowData>({
  table,
}: HeaderContext<DataTableFeatures, TData>) => {
  // While rows load, the page they belong to is not on screen yet, so the header cannot say
  // whether all of them are selected, nor select the rows being replaced.
  const loading = React.use(LoadingContext);

  return (
    // Rows and the table keep their identity when the selection changes, so the checkbox
    // subscribes to the selection to render again.
    <Subscribe source={table.atoms.rowSelection}>
      {() => {
        const all = !loading && table.getIsAllPageRowsSelected();

        return (
          <Checkbox
            aria-label="Select all rows on this page"
            checked={all}
            indeterminate={!all && table.getSelectedRowIds().length > 0}
            disabled={loading}
            onCheckedChange={(checked) => {
              table.toggleAllPageRowsSelected(checked);
            }}
          />
        );
      }}
    </Subscribe>
  );
};

/** The cell of a selection column: selects its row. */
const DataTableSelectRow = <TData extends RowData>({
  row,
  table,
}: CellContext<DataTableFeatures, TData>) => (
  <Subscribe source={table.atoms.rowSelection}>
    {() => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(checked) => {
          row.toggleSelected(checked);
        }}
      />
    )}
  </Subscribe>
);

export {
  DataTable,
  DataTableActionBar,
  DataTableColumnHeader,
  DataTableContent,
  DataTableEmpty,
  DataTableFacets,
  DataTableFilters,
  DataTablePagination,
  DataTableSearch,
  DataTableSelectAll,
  DataTableSelectRow,
  DataTableToolbar,
  DataTableViewOptions,
};

export type { DataTableContentProps, DataTableFiltersProps, DataTableProps };
