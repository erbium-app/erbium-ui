import * as React from "react";
import type { ColumnFiltersState, OnChangeFn, Updater } from "@tanstack/react-table";
import {
  createFilters,
  hasFilterConfig,
  isFilterRule,
  isNumber,
  matchesRule,
} from "../lib/filter-rules";
import type { FilterCell, FilterFieldConfig, FilterSource, Filters } from "../lib/filter-rules";

/*
 * Adapters from a data source to the `Filters` the filter components read. A TanStack table keeps
 * the rules in its own `columnFilters` state and filters its rows itself; a plain list keeps the
 * rules here and filters its items with the same matcher.
 */

/** The parts of a filterable column the adapter reads; any column with `columnFilteringFeature` has them. */
interface FilterableColumn {
  id: string;
  columnDef: { meta?: unknown };
  getCanFilter: () => boolean;
  getFacetedUniqueValues?: () => Map<FilterCell, number>;
  getFacetedMinMaxValues?: () => undefined | [number, number];
}

/** The parts of a table the adapter reads and changes. */
interface FilterableTable {
  atoms: { columnFilters?: { get: () => ColumnFiltersState } };
  getAllLeafColumns: () => FilterableColumn[];
  setColumnFilters: (updater: Updater<ColumnFiltersState>) => void;
}

interface TableFiltersOptions {
  /**
   * Option counts by column id. Pass them when the server filters the rows: the table holds one
   * page, so counts it derives would describe that page rather than every row.
   */
  counts?: Partial<Record<string, Map<string, number>>>;
}

const noFilters: ColumnFiltersState = [];

/**
 * Filters for a TanStack table. Columns opt in with `filterColumn(…)`, or with a `meta.filter`
 * config and `filterFn: filterFn_rule`. Rules live in the table's `columnFilters` state; call
 * this where `useTable` is called, so the filters re-render with the table.
 *
 * Register `columnFacetingFeature` with `facetedUniqueValues` and `facetedMinMaxValues` for option
 * counts and number ranges that follow the other active filters.
 */
const useTableFilters = (table: FilterableTable, { counts }: TableFiltersOptions = {}): Filters => {
  const sources = table.getAllLeafColumns().flatMap((column): FilterSource[] => {
    const { meta } = column.columnDef;

    if (!hasFilterConfig(meta) || !column.getCanFilter()) {
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

  return createFilters(sources, table.atoms.columnFilters?.get() ?? noFilters, (updater) => {
    table.setColumnFilters(updater);
  });
};

/** A list field: a filter config plus how to read the field from an item. */
interface ListFilterField<TItem> extends FilterFieldConfig {
  /** Reads the field's value from an item, such as `(task) => task.status`. */
  value: (item: TItem) => FilterCell;
}

interface ListFiltersOptions<TItem> {
  items: readonly TItem[];
  /** The filterable fields by id. Keep the object stable (a module constant or a memo). */
  fields: Record<string, ListFilterField<TItem>>;
  /** The rules, when the caller owns them, such as rules kept in the URL. */
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
  defaultColumnFilters?: ColumnFiltersState;
}

const widen = (range: [number, number] | undefined, value: number): [number, number] =>
  range === undefined ? [value, value] : [Math.min(range[0], value), Math.max(range[1], value)];

/**
 * Filters for a plain list. Returns the `filters` to give the filter components and the `items`
 * that pass them. Option counts and number ranges follow the other active filters, as a table's
 * facets do.
 */
const useListFilters = <TItem>({
  items,
  fields,
  columnFilters,
  onColumnFiltersChange,
  defaultColumnFilters = noFilters,
}: ListFiltersOptions<TItem>): { filters: Filters; items: TItem[] } => {
  const [ownFilters, setOwnFilters] = React.useState(defaultColumnFilters);
  const state = columnFilters ?? ownFilters;

  const setState = React.useCallback(
    (updater: Updater<ColumnFiltersState>) => {
      if (onColumnFiltersChange === undefined) {
        setOwnFilters(updater);
      } else {
        onColumnFiltersChange(updater);
      }
    },
    [onColumnFiltersChange],
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

    const sources = entries.map(([id, config]): FilterSource => {
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

export { useListFilters, useTableFilters };

export type {
  FilterableColumn,
  FilterableTable,
  ListFilterField,
  ListFiltersOptions,
  TableFiltersOptions,
};
