---
title: "Filters"
description: "Filter tables and lists with chips or faceted buttons that share one rule model."
---

## Usage

Filters have three layers:

- **Core** (`@erbium/ui/lib/filter-rules`): field configs, rules, operators and the matcher. A rule is `{ type, operator, values }` and is stored as the value of a TanStack `ColumnFilter`, so `ColumnFiltersState` is the state for tables and lists alike. Rules are plain JSON, so they can go to a server, and `@erbium/ui/lib/filter-search` writes them to the URL (see [Shareable views](#shareable-views)).
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

## Shareable views

Keep the rules in the URL and every filtered view becomes a link that can be shared, bookmarked and restored with Back and Forward. `@erbium/ui/lib/filter-search` maps rules to search params. It does not depend on a router. `useFilterSearch` connects them to a table or list.

Each field with a rule gets one param, named by its id. The value lists the rule's values, separated by commas. When the operator is not the field type's default, the value is prefixed with the operator and a dot:

```text
/tasks?status=todo,in-progress&estimate=between.2,8&title=contains.api&due=onOrAfter.2026-11-01
```

| Param                      | Rule                               |
| -------------------------- | ---------------------------------- |
| `status=todo,in-progress`  | Status is any of Todo, In progress |
| `status=isNoneOf.done`     | Status is not Done                 |
| `estimate=3`               | Estimate is 3                      |
| `estimate=between.2,`      | Estimate is at least 2 (open end)  |
| `title=api`                | Title contains "api"               |
| `due=onOrAfter.2026-11-01` | Due on or after November 1         |
| `title=`                   | A Title filter still being edited  |

The default operators are `contains` for text, `is` for numbers and dates, `isAnyOf` for options and `includesAnyOf` for multi-options. Params come out in the order the filters were added, so a link reopens the chips in that order. Params for other fields are left alone, and a param that does not fit its field (`estimate=abc`) is dropped.

### With TanStack Router

Validate the filter params in the route, then pass the route's search and a navigate call to `useFilterSearch`. The URL is the only copy of the rules; the table reads them from `state` and writes them back through the router.

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { useFilterSearch, useTableFilters } from "@erbium/ui/hooks/use-filters";
import { getColumnFilterFields, validateFilterSearch } from "@erbium/ui/lib/filter-search";
import type { FilterSearch } from "@erbium/ui/lib/filter-search";

// The filterable columns by id and type, read from their `filterColumn(…)` configs.
const filterFields = getColumnFilterFields(columns);

export const Route = createFileRoute("/tasks")({
  validateSearch: (search: FilterSearch & { page?: number }) => ({
    ...validateFilterSearch(search, filterFields),
    page: Math.max(1, Number(search.page ?? 1) || 1),
  }),
  component: TasksPage,
});

function TasksPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const { columnFilters, onColumnFiltersChange } = useFilterSearch({
    fields: filterFields,
    search,
    // Merge into the current search, go back to the first page, and replace the history entry
    // so typing in a text filter does not add a step to Back.
    onSearchChange: (next) => {
      void navigate({ search: (prev) => ({ ...prev, ...next, page: 1 }), replace: true });
    },
  });

  const table = useTable({
    columns,
    data,
    features,
    state: { columnFilters },
    onColumnFiltersChange,
  });
  const filters = useTableFilters(table);

  return <FilterBar filters={filters} />;
}
```

- **Links to a view.** The params are typed through `validateSearch`, so a link to a view is an ordinary `Link`: `<Link to="/tasks" search={{ status: "todo,in-progress", priority: "high" }}>`.
- **Lists.** Pass the list's `fields` (they already carry `type`) and spread the result into `useListFilters`: `useListFilters({ items, fields, ...useFilterSearch({ fields, search, onSearchChange }) })`.
- **Server filtering.** Read the params in `loaderDeps` so each view is its own loader entry and cache key, and send them to the server with `parseFilterSearch(search, filterFields)`. The loader runs again on each change, so debounce text filters before they reach the loader. The URL itself should update on every keystroke.
- **Param names.** Params are named by column id. Rename a column with `id` when its name would clash with another param, such as `page` or `sort`.
- **Other routers.** The codec reads any search object. Use `parseFilterSearch(Object.fromEntries(new URLSearchParams(location.search)), fields)` to read the rules and `toFilterSearch(columnFilters, fields)` to write them, skipping `undefined` values.

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
- `FilterValueControl`: opens a field's value editor from any trigger. Once a summary only counts the chosen options ("3 selected"), hovering the trigger lists them in a tooltip. Use it to build other layouts.
- `FilterOptionMenu`, `FilterValueEditor`, `FilterOperatorMenu`: the editors the layouts are built from.
