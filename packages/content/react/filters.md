---
title: "Filters"
description: "Headless filter rules over the fields of a list or table, with parts for editors and pickers."
---

Rules over the fields of a list or a TanStack table: one rule per field, with an operator and values. Rules are plain JSON in the shape of TanStack Table's column filters, so they can live in table state, in the URL or on a server. The parts edit one field's rule; the picker hooks give a [Cascader](/docs/react/cascader) the rows and change handling for adding filters and choosing options.

The styled version is the [Filters block](/docs/blocks/filters).

**Import:** `@erbium-ui/react/filters`

## Anatomy

```tsx
import { Filters } from "@erbium-ui/react/filters";

<Filters.Root filters={filters}>
  <Filters.Field id="title">
    <Filters.Operator>
      <Filters.OperatorItem operator="contains" />
    </Filters.Operator>
    <Filters.Value />
    <Filters.Remove />
  </Filters.Field>
  <Filters.Clear />
</Filters.Root>;
```

## Fields

A field has a type, a label and, for option fields, options. Option trees group options under a parent.

| Type          | Operators                                                                                                  | Values                                 |
| ------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `text`        | `contains`, `doesNotContain`, `is`, `isNot`                                                                | `string`                               |
| `number`      | `is`, `isNot`, `lessThan`, `lessThanOrEqual`, `greaterThan`, `greaterThanOrEqual`, `between`, `notBetween` | `number`, two for a range              |
| `date`        | `is`, `isNot`, `before`, `onOrBefore`, `after`, `onOrAfter`, `between`, `notBetween`                       | `YYYY-MM-DD` day keys, two for a range |
| `option`      | `isAnyOf`, `isNoneOf`                                                                                      | option values                          |
| `multiOption` | `includesAnyOf`, `includesAllOf`, `excludesAnyOf`, `excludesAllOf`                                         | option values                          |

The first operator of each type is its default. `getOperatorLabel(type, operator, valueCount)` returns English labels such as "is any of"; pass your own `labels` to translate them.

Extension types add the settings your design reads, such as an icon. They are always optional:

```ts
import type { FilterFieldConfig } from "@erbium-ui/react/filters";

type Field = FilterFieldConfig<{ icon: string }, { icon: string }>;
```

## Data sources

Three adapters return the `filters` the parts read.

```tsx
// A plain list: returns the matching items too.
const { filters, items } = useListFilters({
  items: tasks,
  fields: {
    status: { type: "option", label: "Status", options, value: (task) => task.status },
    title: { type: "text", label: "Title", value: (task) => task.title },
  },
});

// TanStack Table v9: columns opt in with filterColumn(config).
const filters = useTableFilters(table);

// The URL: one search param per field, such as ?status=todo,done&estimate=between.2,8
const { value, onValueChange } = useFilterSearch({ search, fields, onSearchChange });
```

`useListFilters` and `useTableFilters` count options and number ranges under the other active filters. For TanStack Table v9, register `columnFilteringFeature` and the faceting feature and row-model factories you need. The adapter subscribes to `columnFilters` even when the table owner selects a different state slice. To control the rules, pass `value` and `onValueChange` to `useListFilters`, or supply the table’s `state.columnFilters` and `onColumnFiltersChange`.

## Pickers

`useFieldPicker(filters)` and `useOptionPicker(field)` return props for a multiple `Cascader.Root`: `items`, `value`, `onValueChange`, and for the field picker `open`, `onOpenChange` and `onOpenChangeComplete`.

```tsx
const picker = useFieldPicker(filters, { onFieldAdded: (id) => openEditor(id) });

<Cascader.Root multiple searchable {...picker}>
  …
</Cascader.Root>;
```

The field picker lists fields, with option fields expanding into their options. Checking an option adds or extends its field's rule; choosing a text, number or date field adds an empty rule, closes the picker and calls `onFieldAdded` once focus has returned. Unchecking a field's last option removes its rule. Field picker rows carry their field, optional option, and optional facet count in `data`. Option picker rows carry their option and optional count. Spread either picker result into the styled Cascader as well. Its row renderer receives the same node, including `data`.

## Server

The same `@erbium-ui/react/filters` import provides server-safe utilities, including `createFilters`, `matchesRule`, `filterFn_rule` for TanStack Table, `filterColumn`, the rule helpers and the URL codec: `parseFilterSearch`, `toFilterSearch` and `validateFilterSearch`, which a router can call in `validateSearch`.

## API reference

### Root

Provides one set of filters. Renders no element.

| Prop      | Type      |
| --------- | --------- |
| `filters` | `Filters` |

### Field

Scopes the parts inside it to one field. Takes `id`, or the `field` itself. Renders no element, and nothing for an unknown id.

### Parts

| Part           | Element           | Notes                                                                                              |
| -------------- | ----------------- | -------------------------------------------------------------------------------------------------- |
| `Operator`     | `Menu.RadioGroup` | The field's operator. Place it inside a Base UI menu.                                              |
| `OperatorItem` | `Menu.RadioItem`  | `operator` prop.                                                                                   |
| `Value`        | `<input>`         | One value of a text or number field. `index` picks the end of a range. Blank numbers write `null`. |
| `Remove`       | `<button>`        | Removes the field's rule. Named `Remove {label} filter`.                                           |
| `Clear`        | `<button>`        | Removes every rule. Disabled while there are none.                                                 |

Field parts carry `data-type`, `data-operator`, `data-active` and `data-empty`.

### Hooks

- `useFilters()` returns the root's filters: `fields`, `active`, `clear()`.
- `useFilterField()` returns `{ field, actions, operators, empty }` inside a field. `actions` has `setValues`, `setValue`, `setOperator`, `toggleOption`, `remove` and `removeIfEmpty`; `getFieldActions(field)` returns the same outside a field.
