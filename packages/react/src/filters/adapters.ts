import * as React from "react";
import { createFilters, hasFilterConfig, isFilterRule, isNumber, matchesRule } from "./rules";
import type {
  FilterCell,
  FilterFieldConfig,
  FilterSource,
  FilterState,
  FilterStateUpdate,
  Filters,
} from "./rules";
import { parseFilterSearch, toFilterSearch } from "./search";
import type { FilterSearch, FilterSearchFields, SearchParams } from "./search";

/*
 * Adapters from a data source to the `Filters` that filter parts read. A TanStack table keeps the
 * rules in its own column filter state and filters its rows itself; a plain list keeps the rules
 * here and filters its items with the same matcher. The table is read structurally, so this
 * package does not depend on TanStack Table.
 */

/** A new state, or a function from the latest state to a new one, as TanStack Table passes. */
type FilterStateUpdater = FilterState | FilterStateUpdate;

const applyUpdate = (updater: FilterStateUpdater, last: FilterState): FilterState =>
  Array.isArray(updater) ? updater : updater(last);

/** The parts of a filterable column the adapter reads; TanStack Table columns have them. */
interface FilterableColumn {
  id: string;
  columnDef: { meta?: unknown };
  getCanFilter: () => boolean;
  getFacetedUniqueValues?: () => Map<FilterCell, number>;
  getFacetedMinMaxValues?: () => undefined | [number, number];
}

/** The parts of a table the adapter reads and changes. */
interface FilterableTable {
  atoms: { columnFilters?: { get: () => FilterState } };
  getAllLeafColumns: () => FilterableColumn[];
  setColumnFilters: (updater: FilterStateUpdate) => void;
}

interface TableFiltersOptions {
  /**
   * Option counts by column id. Pass them when the server filters the rows: the table holds one
   * page, so counts it derives would describe that page rather than every row.
   */
  counts?: Partial<Record<string, Map<string, number>>>;
}

const noFilters: FilterState = [];

/**
 * Filters for a TanStack table. Columns opt in with `filterColumn(…)`, or with a `meta.filter`
 * config and `filterFn: filterFn_rule`. Rules live in the table's column filter state; call this
 * where the table is created, so the filters re-render with it.
 *
 * Register faceting with unique values and min/max values for option counts and number ranges
 * that follow the other active filters.
 */
const useTableFilters = <TExtra extends object = object, TOptionExtra extends object = object>(
  table: FilterableTable,
  { counts }: TableFiltersOptions = {},
): Filters<TExtra, TOptionExtra> => {
  const sources = table
    .getAllLeafColumns()
    .flatMap((column): FilterSource<TExtra, TOptionExtra>[] => {
      const { meta } = column.columnDef;

      if (!hasFilterConfig<TExtra, TOptionExtra>(meta) || !column.getCanFilter()) {
        return [];
      }

      const config = meta.filter;
      const serverCounts = counts?.[column.id];

      return [
        {
          config,
          facets:
            serverCounts === undefined ? column.getFacetedUniqueValues?.() : new Map(serverCounts),
          id: column.id,
          range: config.type === "number" ? column.getFacetedMinMaxValues?.() : undefined,
        },
      ];
    });

  return createFilters(sources, table.atoms.columnFilters?.get() ?? noFilters, (update) => {
    table.setColumnFilters(update);
  });
};

/** A list field: a filter config plus how to read the field from an item. */
type ListFilterField<
  TItem,
  TExtra extends object = object,
  TOptionExtra extends object = object,
> = FilterFieldConfig<TExtra, TOptionExtra> & {
  /** Reads the field's value from an item, such as `(task) => task.status`. */
  value: (item: TItem) => FilterCell;
};

interface ListFiltersOptions<
  TItem,
  TExtra extends object = object,
  TOptionExtra extends object = object,
> {
  items: readonly TItem[];
  /** The filterable fields by id. Keep the object stable (a module constant or a memo). */
  fields: Record<string, ListFilterField<TItem, TExtra, TOptionExtra>>;
  /** The rules, when the caller owns them, such as rules kept in the URL. */
  value?: FilterState;
  onValueChange?: (updater: FilterStateUpdater) => void;
  defaultValue?: FilterState;
}

const widen = (range: [number, number] | undefined, value: number): [number, number] =>
  range === undefined ? [value, value] : [Math.min(range[0], value), Math.max(range[1], value)];

/**
 * Filters for a plain list. Returns the `filters` to give the filter parts and the `items` that
 * pass them. Option counts and number ranges follow the other active filters, as a table's facets
 * do.
 */
const useListFilters = <
  TItem,
  TExtra extends object = object,
  TOptionExtra extends object = object,
>({
  items,
  fields,
  value,
  onValueChange,
  defaultValue = noFilters,
}: ListFiltersOptions<TItem, NoInfer<TExtra>, NoInfer<TOptionExtra>>): {
  filters: Filters<TExtra, TOptionExtra>;
  items: TItem[];
} => {
  const [ownState, setOwnState] = React.useState(defaultValue);
  const state = value ?? ownState;

  const setState = React.useCallback(
    (update: FilterStateUpdate) => {
      if (onValueChange === undefined) {
        setOwnState(update);
      } else {
        onValueChange(update);
      }
    },
    [onValueChange],
  );

  return React.useMemo(() => {
    const entries = Object.entries(fields);

    const rules = state.flatMap((filter) =>
      isFilterRule(filter.value) && filter.id in fields
        ? [{ id: filter.id, rule: filter.value }]
        : [],
    );

    // Each item's field values, read once.
    const rows = items.map((item) => ({
      cells: new Map(entries.map(([id, field]) => [id, field.value(item)])),
      item,
    }));

    const passes = (cells: Map<string, FilterCell>, except?: string) =>
      rules.every(({ id, rule }) => id === except || matchesRule(cells.get(id), rule));

    const sources = entries.map(([id, config]): FilterSource<TExtra, TOptionExtra> => {
      const facets = new Map<FilterCell, number>();
      let range: [number, number] | undefined;

      for (const { cells } of rows) {
        const cell = cells.get(id);

        if (passes(cells, id) && cell !== null && cell !== undefined) {
          facets.set(cell, (facets.get(cell) ?? 0) + 1);
          range = isNumber(cell) ? widen(range, cell) : range;
        }
      }

      return { config, facets, id, range: config.type === "number" ? range : undefined };
    });

    return {
      filters: createFilters(sources, state, setState),
      items: rows.filter(({ cells }) => passes(cells)).map(({ item }) => item),
    };
  }, [items, fields, state, setState]);
};

interface FilterSearchOptions<TKey extends string> {
  /** The current search params, such as TanStack Router's `Route.useSearch()`. */
  search: SearchParams<TKey>;
  /** The fields kept in the URL: `getColumnFilterFields(columns)` for a table, the fields of a list. */
  fields: FilterSearchFields<TKey>;
  /**
   * Writes the filter params after a change. Merge them into the current search, replacing the
   * history entry so each keystroke is not a step back:
   * `navigate({ search: (prev) => ({ ...prev, ...next }), replace: true })`.
   */
  onSearchChange: (next: FilterSearch<TKey>) => void;
}

/**
 * Keeps filter state in the URL, so a filtered view is a link. Returns `value` and
 * `onValueChange`: pass them to a table's column filter state and change handler, or to
 * `useListFilters`. The search params are the only copy of the rules; the router owns them.
 */
const useFilterSearch = <TKey extends string>({
  search,
  fields,
  onSearchChange,
}: FilterSearchOptions<TKey>) => {
  const value = React.useMemo(() => parseFilterSearch(search, fields), [search, fields]);
  // Updates made before the router re-renders build on each other, not on stale search.
  const pending = React.useRef<{ from: FilterState; next: FilterState }>(undefined);

  const onValueChange = (updater: FilterStateUpdater) => {
    const last = pending.current?.from === value ? pending.current.next : value;
    const next = applyUpdate(updater, last);

    pending.current = { from: value, next };
    onSearchChange(toFilterSearch(next, fields));
  };

  return { onValueChange, value };
};

export { useFilterSearch, useListFilters, useTableFilters };

export type {
  FilterableColumn,
  FilterableTable,
  FilterSearchOptions,
  FilterStateUpdater,
  ListFilterField,
  ListFiltersOptions,
  TableFiltersOptions,
};
