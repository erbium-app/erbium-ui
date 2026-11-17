import * as React from "react";
import { useDebouncedCallback } from "@tanstack/react-pacer/debouncer";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  columnFacetingFeature,
  columnFilteringFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  createTableHook,
  filterFn_includesString,
  functionalUpdate,
  globalFilteringFeature,
  metaHelper,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
} from "@tanstack/react-table";
import type { ColumnFiltersState, RowData, TableOptions, Updater } from "@tanstack/react-table";
import { parseDataTableSearch, toDataTableSearch } from "../lib/data-table-search";
import type { DataTableQuery, DataTableSearchConfig } from "../lib/data-table-search";
import { filterFn_rule, isFilterRule, isRuleEmpty } from "../lib/filter-rules";
import type { FilterColumnMeta } from "../lib/filter-rules";
import type { SearchParams } from "../lib/filter-search";

/** What a data table column says about itself, beyond TanStack's column definition. */
interface DataTableColumnMeta extends FilterColumnMeta {
  /** The column's name in menus. Left out, a string `header` is used, then the column id. */
  label?: string;
  /** Aligns the header and cells, such as `"end"` for numbers. */
  align?: "start" | "end";
}

/** Every feature a data table offers, with the row models a table needs to process rows itself. */
const dataTableFeatures = tableFeatures({
  columnFacetingFeature,
  columnFilteringFeature,
  columnMeta: metaHelper<DataTableColumnMeta>(),
  columnSizingFeature,
  columnVisibilityFeature,
  facetedMinMaxValues: createFacetedMinMaxValues(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  filteredRowModel: createFilteredRowModel(),
  globalFilteringFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  // The names `sortFn: "auto"` picks from.
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
});

type DataTableFeatures = typeof dataTableFeatures;

const hasRowId = <TRow>(row: TRow): row is TRow & { id: string | number } =>
  typeof row === "object" &&
  row !== null &&
  "id" in row &&
  (typeof row.id === "string" || typeof row.id === "number");

const {
  createAppColumnHelper: createDataTableColumnHelper,
  useAppTable,
  useTableContext: useDataTableContext,
} = createTableHook({
  // The page changes only when the query does, so a refetch keeps the reader on their page.
  autoResetPageIndex: false,
  // Columns are sized only when they set `size`; the rest share the remaining width, rather
  // than taking the sizing feature's 150px default.
  defaultColumn: { filterFn: filterFn_rule, size: undefined },
  features: dataTableFeatures,
  // Rows with an `id` keep their selection across pages and refetches.
  getRowId: (row: RowData, index: number) => (hasRowId(row) ? String(row.id) : String(index)),
  globalFilterFn: filterFn_includesString,
});

/** Changes a query, as React's state setter does with a function. */
type DataTableQueryChange = (update: (query: DataTableQuery) => DataTableQuery) => void;

/**
 * A table's query in React state. Lift it out of the table when the query must be known before
 * the rows, as a server table's request is: give the pair to `useDataTable`.
 */
const useDataTableQuery = (config: DataTableSearchConfig) => {
  const [query, setQuery] = React.useState(() => parseDataTableSearch({}, config));

  return [query, setQuery] as const;
};

// The router types search by the routes an app registers; the table reads whichever route it is on.
const readSearch = (search: SearchParams) => search;

/**
 * A table's query in the URL, so every view of the table is a link. Give the route
 * `validateSearch: validateDataTableSearch(config)` with the same config; a server table's loader
 * can read `parseDataTableSearch(search, config)` instead.
 */
const useDataTableSearchParams = (
  config: DataTableSearchConfig,
): readonly [DataTableQuery, DataTableQueryChange] => {
  const { columns, defaultSorting, defaultPageSize, prefix } = config;
  const search = useSearch({ select: readSearch, strict: false });
  const navigate = useNavigate();

  const query = React.useMemo(
    () => parseDataTableSearch(search, { columns, defaultPageSize, defaultSorting, prefix }),
    [search, columns, defaultPageSize, defaultSorting, prefix],
  );

  // Changes made before the router re-renders build on each other, not on the stale URL.
  const pending = React.useRef<{ from: DataTableQuery; next: DataTableQuery }>(undefined);

  const setQuery: DataTableQueryChange = (update) => {
    const last = pending.current?.from === query ? pending.current.next : query;
    const next = update(last);

    if (next === last) {
      return;
    }

    pending.current = { from: query, next };

    // Each change replaces the history entry, so typing a search does not add steps to Back.
    void navigate({
      replace: true,
      search: (prev: SearchParams) => ({
        ...prev,
        ...toDataTableSearch(next, { columns, defaultPageSize, defaultSorting, prefix }),
      }),
      to: ".",
    });
  };

  return [query, setQuery] as const;
};

type DataTableOptions<TData extends RowData> = Omit<
  TableOptions<DataTableFeatures, TData>,
  | "features"
  | "manualFiltering"
  | "manualPagination"
  | "manualSorting"
  | "onColumnFiltersChange"
  | "onGlobalFilterChange"
  | "onPaginationChange"
  | "onSortingChange"
> &
  Omit<DataTableSearchConfig, "columns"> & {
    /**
     * How many rows the server holds. Give it when the server searches, filters, sorts and pages:
     * the table then shows the rows it is given as the current page.
     */
    rowCount?: number;
    /** The query, from `useDataTableQuery` or `useDataTableSearchParams`. Left out, the table keeps its own. */
    query?: DataTableQuery;
    onQueryChange?: DataTableQueryChange;
  };

/** The rules that constrain rows: every filter except rules still waiting for a value. */
const committedRules = (filters: ColumnFiltersState) =>
  filters.filter(({ value }) => !isFilterRule(value) || !isRuleEmpty(value));

const sameValue = <TValue>(a: TValue, b: TValue) =>
  a === b || JSON.stringify(a) === JSON.stringify(b);

/**
 * A data table. It owns its search, filters, sort and page unless given a `query`. Search, filter
 * and sort changes return to the first page.
 *
 * Leave out `rowCount` to search, filter, sort and page the rows in the browser; give it when a
 * server answers the query and `data` is the current page.
 */
const useDataTable = <TData extends RowData>({
  query: givenQuery,
  onQueryChange,
  rowCount,
  state,
  defaultPageSize,
  defaultSorting,
  // Only the URL reads the prefix; it is taken here so one config can be spread into both hooks.
  prefix: _prefix,
  ...options
}: DataTableOptions<TData>) => {
  const [ownQuery, setOwnQuery] = useDataTableQuery({
    columns: options.columns,
    defaultPageSize,
    defaultSorting,
  });

  const query = givenQuery ?? ownQuery;
  const setQuery = onQueryChange ?? setOwnQuery;
  const server = rowCount !== undefined;

  const change =
    <TKey extends keyof DataTableQuery>(key: TKey) =>
    (updater: Updater<DataTableQuery[TKey]>) => {
      setQuery((last) => {
        // A reset to TanStack's blank state (`resetGlobalFilter(true)`) gives `undefined`, which
        // the types do not admit, so it becomes this table's blank value.
        const updated: DataTableQuery[TKey] | undefined = functionalUpdate(updater, last[key]);

        const value =
          updated ??
          parseDataTableSearch({}, { columns: options.columns, defaultPageSize, defaultSorting })[
            key
          ];

        if (sameValue(value, last[key])) {
          return last;
        }

        const next = { ...last, [key]: value };

        return key === "pagination"
          ? next
          : { ...next, pagination: { ...next.pagination, pageIndex: 0 } };
      });
    };

  /*
   * The filters on screen run ahead of the query. A rule without values is a chip the reader is
   * still filling in, so it never reaches the query, and a server table commits the rest after a
   * pause, so typing or picking several options asks for rows once. The draft holds while the
   * query is the one it started from or the one it committed; Back or a link replaces it.
   */
  const [draft, setDraft] = React.useState<{
    filters: ColumnFiltersState;
    from: ColumnFiltersState;
  }>();

  const columnFilters =
    draft !== undefined &&
    (sameValue(draft.from, query.columnFilters) ||
      sameValue(committedRules(draft.filters), query.columnFilters))
      ? draft.filters
      : query.columnFilters;

  const commitFilters = change("columnFilters");
  const commitFiltersLater = useDebouncedCallback(commitFilters, { wait: 300 });

  const changeColumnFilters = (updater: Updater<ColumnFiltersState>) => {
    const filters = functionalUpdate(updater, columnFilters);
    const committed = committedRules(filters);

    setDraft({ filters, from: query.columnFilters });

    if (server) {
      commitFiltersLater(committed);
    } else {
      commitFilters(committed);
    }
  };

  return useAppTable<TData>({
    ...options,
    manualFiltering: server,
    manualPagination: server,
    manualSorting: server,
    onColumnFiltersChange: changeColumnFilters,
    onGlobalFilterChange: change("globalFilter"),
    onPaginationChange: change("pagination"),
    onSortingChange: change("sorting"),
    rowCount,
    state: { ...state, ...query, columnFilters },
  });
};

/** A table built by `useDataTable`. */
type DataTableInstance<TData extends RowData = RowData> = ReturnType<typeof useAppTable<TData>>;

export {
  createDataTableColumnHelper,
  dataTableFeatures,
  useDataTable,
  useDataTableContext,
  useDataTableQuery,
  useDataTableSearchParams,
};

export type {
  DataTableColumnMeta,
  DataTableFeatures,
  DataTableInstance,
  DataTableOptions,
  DataTableQueryChange,
};
