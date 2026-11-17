import type { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { getColumnFilterFields, parseFilterSearch, toFilterSearch } from "./filter-search";
import type { FilterSearchColumn, FilterSearchFields, SearchParams } from "./filter-search";

/*
 * The URL form of a data table's query, so a sorted, filtered page of a table is a link:
 *
 *   ?q=acme&sort=issued.desc,customer&page=2&size=20&status=paid,overdue
 *
 * `q` is the search, `sort` the sort order (`.desc` marks a descending column), `page` the
 * 1-based page, `size` the page size, and each filterable column keeps its rule under its id.
 * Defaults are left out of the URL. These functions are pure, so a route loader can parse the
 * same search the table reads.
 */

/** The page sizes a table offers. */
const dataTablePageSizes = [10, 20, 30, 50, 100] as const;

/** Everything a server needs to answer for one page of a table. */
interface DataTableQuery {
  globalFilter: string;
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
}

/** The parts of a column definition the codec reads. */
interface DataTableSearchColumn extends FilterSearchColumn {
  enableSorting?: boolean;
  /** Only its presence is read: a column with an accessor holds a value it can sort by. */
  accessorFn?: (row: never, index: number) => void;
  columns?: readonly DataTableSearchColumn[];
}

/** A table's columns and defaults. Share one object between the route and the table. */
interface DataTableSearchConfig {
  columns: readonly DataTableSearchColumn[];
  /** The order rows have when the URL names none. */
  defaultSorting?: SortingState;
  /** The page size when the URL names none. */
  defaultPageSize?: number;
}

type ParamValue = SearchParams[string];

/** A route's search params, with the table's own in their normal form. */
type DataTableSearchParams = Partial<Record<string, string | number | boolean>>;

const noSorting: SortingState = [];
const fallbackPageSize = 10;

/** What the codec derives from a column list, kept per list since columns are module constants. */
interface Schema {
  filterFields: FilterSearchFields;
  sortable: Set<string>;
}

const schemas = new WeakMap<readonly DataTableSearchColumn[], Schema>();

const collectSortable = (columns: readonly DataTableSearchColumn[], ids: Set<string>) => {
  for (const column of columns) {
    // TanStack makes an id from an accessor key, writing nested keys' dots as underscores.
    const id = column.id ?? column.accessorKey?.toString().replaceAll(".", "_");
    const hasValue = column.accessorKey !== undefined || column.accessorFn !== undefined;

    if (id !== undefined && hasValue && column.enableSorting !== false) {
      ids.add(id);
    }

    if (column.columns !== undefined) {
      collectSortable(column.columns, ids);
    }
  }

  return ids;
};

const getSchema = (columns: readonly DataTableSearchColumn[]): Schema => {
  const cached = schemas.get(columns);

  if (cached !== undefined) {
    return cached;
  }

  const schema = {
    filterFields: getColumnFilterFields(columns),
    sortable: collectSortable(columns, new Set()),
  };

  schemas.set(columns, schema);

  return schema;
};

const toText = (value: ParamValue) => (value === null || value === undefined ? "" : String(value));

const toPositiveInteger = (value: ParamValue) => {
  const number = Number(value);

  return Number.isInteger(number) && number > 0 ? number : undefined;
};

const parseSorting = (value: ParamValue, sortable: Set<string>): SortingState =>
  toText(value)
    .split(",")
    .flatMap((part) => {
      const [id = "", direction] = part.split(".");

      return sortable.has(id) ? [{ desc: direction === "desc", id }] : [];
    });

const encodeSorting = (sorting: SortingState) =>
  sorting.map(({ id, desc }) => (desc ? `${id}.desc` : id)).join(",");

const getDefaultPageSize = (config: DataTableSearchConfig) =>
  config.defaultPageSize ?? fallbackPageSize;

const isPageSize = (size: number, config: DataTableSearchConfig) =>
  size === getDefaultPageSize(config) || dataTablePageSizes.some((option) => option === size);

/** The query a search holds, with the table's defaults where the URL names none. */
const parseDataTableSearch = (
  search: SearchParams,
  config: DataTableSearchConfig,
): DataTableQuery => {
  const { filterFields, sortable } = getSchema(config.columns);
  const size = toPositiveInteger(search.size);
  const sorting = parseSorting(search.sort, sortable);

  return {
    columnFilters: parseFilterSearch(search, filterFields),
    globalFilter: toText(search.q),
    pagination: {
      pageIndex: (toPositiveInteger(search.page) ?? 1) - 1,
      pageSize: size !== undefined && isPageSize(size, config) ? size : getDefaultPageSize(config),
    },
    sorting: sorting.length > 0 ? sorting : (config.defaultSorting ?? noSorting),
  };
};

/**
 * The search params for a query: one entry per param the table owns, `undefined` where the
 * query holds the default. Merge it into the current search so other params are kept. An empty
 * sort goes back to the default sort.
 */
const toDataTableSearch = (query: DataTableQuery, config: DataTableSearchConfig) => {
  const { filterFields } = getSchema(config.columns);
  const sort = encodeSorting(query.sorting);
  const { pageIndex, pageSize } = query.pagination;

  return {
    ...toFilterSearch(query.columnFilters, filterFields),
    page: pageIndex > 0 ? pageIndex + 1 : undefined,
    q: query.globalFilter === "" ? undefined : query.globalFilter,
    size: pageSize === getDefaultPageSize(config) ? undefined : pageSize,
    sort:
      sort === "" || sort === encodeSorting(config.defaultSorting ?? noSorting) ? undefined : sort,
  };
};

/**
 * A route's `validateSearch` for a table: writes the table's params in their normal form, drops
 * the ones that do not fit its columns or hold a default, and keeps every other param.
 *
 * ```ts
 * createFileRoute("/invoices")({ validateSearch: validateDataTableSearch(invoicesTable) })
 * ```
 */
const validateDataTableSearch =
  (config: DataTableSearchConfig) =>
  (search: SearchParams): DataTableSearchParams => {
    const params = toDataTableSearch(parseDataTableSearch(search, config), config);

    return Object.fromEntries(
      Object.entries({ ...search, ...params }).filter(
        (entry) => entry[1] !== undefined && entry[1] !== null,
      ),
    );
  };

export { dataTablePageSizes, parseDataTableSearch, toDataTableSearch, validateDataTableSearch };

export type { DataTableQuery, DataTableSearchColumn, DataTableSearchConfig, DataTableSearchParams };
