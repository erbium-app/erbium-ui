---
title: "Filters"
description: "Filter tables and lists with chips or faceted buttons that share one rule model."
---

## Usage

Filters have three layers:

- **Core** (`@erbium/ui/lib/filter-rules`): field configs, rules, operators and the matcher. A rule is `{ type, operator, values }` and is stored as the value of a TanStack `ColumnFilter`, so `ColumnFiltersState` is the state for tables and lists alike. Rules are plain JSON, so they can go to a server or into the URL.
- **Adapters** (`@erbium/ui/hooks/use-filters`): `useTableFilters(table)` for a TanStack Table v9 table and `useListFilters({ items, fields })` for a plain list. Both return the same `Filters` object.
- **Layouts** (`@erbium/ui/blocks/filters`): `FilterBar` (chips added from a searchable menu) and `FilterFacets` (one button per field). Both are composed from the same value controls, built on the searchable [Dropdown Menu](/docs/components/dropdown-menu), [Popover](/docs/components/popover), [Number Field](/docs/components/number-field) and [Calendar](/docs/components/calendar).

### Tables

Mark a column filterable with `filterColumn`, which sets both its `filterFn` and its `meta.filter` config. Register the column filtering feature and, for option counts and number ranges, the faceting feature. Control `columnFilters` in the component that calls `useTable`.

```tsx
import { FilterBar } from "@erbium/ui/blocks/filters";
import { useTableFilters } from "@erbium/ui/hooks/use-filters";
import { filterColumn } from "@erbium/ui/lib/filter-rules";
import type { FilterColumnMeta } from "@erbium/ui/lib/filter-rules";

const features = tableFeatures({
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  columnFacetingFeature,
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  facetedMinMaxValues: createFacetedMinMaxValues(),
  columnMeta: {} as FilterColumnMeta,
});

columnHelper.accessor("status", {
  header: "Status",
  ...filterColumn({ type: "option", label: "Status", options: statusOptions }),
});

const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
const table = useTable({
  columns,
  data,
  features,
  state: { columnFilters },
  onColumnFiltersChange: setColumnFilters,
});
const filters = useTableFilters(table);

<FilterBar filters={filters} />;
```

For a server-filtered table, set `manualFiltering: true`, leave out `filteredRowModel`, and send `columnFilters` with the request. The table holds one page, so pass counts from the server with `useTableFilters(table, { counts })` and list `options` in each option field's config.

### Lists

Give `useListFilters` the items and a field config for each filterable field, with a `value` accessor. It returns the `filters` for the layouts and the `items` that pass them.

```tsx
const fields = {
  status: { type: "option", label: "Status", options: statusOptions, value: (task) => task.status },
  due: { type: "date", label: "Due", value: (task) => task.due },
} satisfies Record<string, ListFilterField<Task>>;

const { filters, items } = useListFilters({ items: tasks, fields });
```

Pass `columnFilters` and `onColumnFiltersChange` to keep the rules elsewhere, such as in the URL.

## Field types

| Type          | Operators                                                                    | Values                            |
| ------------- | ---------------------------------------------------------------------------- | --------------------------------- |
| `text`        | contains, does not contain, is, is not                                       | One string                        |
| `number`      | is, is not, less than, at most, greater than, at least, between, not between | One number, or a start and an end |
| `date`        | is, is not, before, on or before, after, on or after, between, not between   | `YYYY-MM-DD` keys                 |
| `option`      | is any of, is none of                                                        | Option values                     |
| `multiOption` | includes any of, includes all of, excludes any of, excludes all of           | Option values                     |

Option fields without `options` list the values found in the data. A rule with no values matches everything, so a filter being edited does not hide rows; a text, number or date filter left empty is removed when its editor closes.

## Parts

- `FilterBar`: chip mode. `FilterMenu` adds filters; each active filter is a `FilterChip` with its field, operator menu, value and a remove button.
- `FilterFacets`: faceted mode, one `FilterFacet` per field. Pass `fields` to choose and order them.
- `FilterValueControl`: opens a field's value editor from any trigger. Use it to build other layouts.
- `FilterOptionMenu`, `FilterOptionItems`, `FilterValueEditor`, `FilterOperatorMenu`: the editors the layouts are built from.
