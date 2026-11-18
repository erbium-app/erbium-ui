import {
  useFilterSearch as useCoreFilterSearch,
  useListFilters as useCoreListFilters,
  useTableFilters as useCoreTableFilters,
} from "@erbium-ui/react/filters";
import type {
  FilterableColumn,
  FilterableTable,
  FilterSearchOptions,
  FilterState,
  FilterStateUpdater,
  ListFilterField as CoreListFilterField,
  TableFiltersOptions,
} from "@erbium-ui/react/filters";
import type { FilterFieldExtra, FilterOptionExtra, Filters } from "../lib/filter-rules";

/*
 * Adapters from a data source to the `Filters` the filter components read, from the
 * @erbium-ui/react filter primitive, typed with Erbium's field settings. A TanStack table keeps the
 * rules in its own `columnFilters` state; a plain list keeps them here.
 */

/**
 * Filters for a TanStack table. Columns opt in with `filterColumn(…)`, or with a `meta.filter`
 * config and `filterFn: filterFn_rule`. Call this where `useTable` is called, so the filters
 * re-render with the table. Register `columnFacetingFeature` with `facetedUniqueValues` and
 * `facetedMinMaxValues` for option counts and number ranges that follow the other filters.
 */
const useTableFilters = (table: FilterableTable, options?: TableFiltersOptions): Filters =>
  useCoreTableFilters<FilterFieldExtra, FilterOptionExtra>(table, options);

/** A list field: a filter config plus how to read the field from an item. */
type ListFilterField<TItem> = CoreListFilterField<TItem, FilterFieldExtra, FilterOptionExtra>;

interface ListFiltersOptions<TItem> {
  items: readonly TItem[];
  /** The filterable fields by id. Keep the object stable (a module constant or a memo). */
  fields: Record<string, ListFilterField<TItem>>;
  /** The rules, when the caller owns them, such as rules kept in the URL. */
  columnFilters?: FilterState;
  onColumnFiltersChange?: (updater: FilterStateUpdater) => void;
  defaultColumnFilters?: FilterState;
}

/**
 * Filters for a plain list. Returns the `filters` to give the filter components and the `items`
 * that pass them. Option counts and number ranges follow the other active filters.
 */
const useListFilters = <TItem>({
  items,
  fields,
  columnFilters,
  onColumnFiltersChange,
  defaultColumnFilters,
}: ListFiltersOptions<TItem>): { filters: Filters; items: TItem[] } =>
  useCoreListFilters<TItem, FilterFieldExtra, FilterOptionExtra>({
    defaultValue: defaultColumnFilters,
    fields,
    items,
    onValueChange: onColumnFiltersChange,
    value: columnFilters,
  });

/**
 * Keeps column filters in the URL, so a filtered view is a link. Returns `columnFilters` and
 * `onColumnFiltersChange` to pass to `useTable` (in `state` and as the change handler) or to spread
 * into `useListFilters`. The search params are the only copy of the rules; the router owns them.
 */
const useFilterSearch = <TKey extends string>(options: FilterSearchOptions<TKey>) => {
  const { onValueChange, value } = useCoreFilterSearch(options);

  return { columnFilters: value, onColumnFiltersChange: onValueChange };
};

export { useFilterSearch, useListFilters, useTableFilters };

export type {
  FilterableColumn,
  FilterableTable,
  FilterSearchOptions,
  ListFilterField,
  ListFiltersOptions,
  TableFiltersOptions,
};
