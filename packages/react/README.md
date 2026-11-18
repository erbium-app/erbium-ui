# @erbium-ui/react

Unstyled, accessible React primitives for components that hold real behavior: cascading selects, filter builders, inline editing and pagination. Each primitive is a set of parts in the style of [Base UI](https://base-ui.com): you render the parts, style them with `className`, and read their state from `data-*` attributes.

Erbium UI's styled components are built on these primitives. Use this package directly when you want the behavior with your own design.

## Install

```sh
npm install @erbium-ui/react @base-ui/react
```

React 19 and `@base-ui/react` 1.9 or later are peer dependencies.

## Entry points

| Import                             | Contents                                               | Runs on          |
| ---------------------------------- | ------------------------------------------------------ | ---------------- |
| `@erbium-ui/react/cascader`        | `Cascader` parts                                       | Client           |
| `@erbium-ui/react/filters`         | `Filters` parts, adapters, picker hooks, and the core  | Client           |
| `@erbium-ui/react/filters/core`    | Rule model, matching, table filter function, URL codec | Server or client |
| `@erbium-ui/react/editable`        | `Editable` parts                                       | Client           |
| `@erbium-ui/react/pagination`      | `Pagination` parts, `usePagination`, and the core      | Client           |
| `@erbium-ui/react/pagination/core` | `getPagination` page layout                            | Server or client |

Client entries start with `"use client"`, so React Server Components frameworks such as the Next.js App Router can render their parts from a server component. Entries marked server or client are plain functions and import nothing from React.

## Cascader

A select whose options form a tree. One popup shows one level at a time; a branch opens its level in place, and search finds options at any depth below the open level.

```tsx
import { Cascader } from "@erbium-ui/react/cascader";

const places = [
  {
    value: "europe",
    label: "Europe",
    children: [
      { value: "berlin", label: "Berlin" },
      { value: "paris", label: "Paris" },
    ],
  },
];

export const PlacePicker = () => (
  <Cascader.Root items={places} searchable name="place">
    <Cascader.Trigger>
      <Cascader.Value placeholder="Pick a place" />
    </Cascader.Trigger>
    <Cascader.Portal>
      <Cascader.Positioner>
        <Cascader.Popup>
          <Cascader.Back />
          <Cascader.Search />
          <Cascader.Empty>No results</Cascader.Empty>
          <Cascader.List>
            <Cascader.Level>
              <Cascader.Rows>
                {(row) => (
                  <Cascader.Item row={row}>
                    <Cascader.ItemIndicator />
                    {row.node.label}
                    <Cascader.ItemTrail />
                    <Cascader.ItemCount />
                  </Cascader.Item>
                )}
              </Cascader.Rows>
            </Cascader.Level>
          </Cascader.List>
        </Cascader.Popup>
      </Cascader.Positioner>
    </Cascader.Portal>
  </Cascader.Root>
);
```

Pass `multiple` to pick any number of leaves. Node `data` carries whatever your design renders with a node, such as an icon or a description, and is typed through `Cascader.Rows`.

The full API reference, keyboard map and data attributes are on the [documentation site](https://ui.erbium.app/docs/react).

## Filters

A filter builder for lists and tables. Rules are plain JSON in the same shape as TanStack Table's column filters, so they can live in a table, in the URL or on a server.

```tsx
import { Filters, useListFilters } from "@erbium-ui/react/filters";

const fields = {
  title: { type: "text", label: "Title", value: (task: Task) => task.title },
  estimate: { type: "number", label: "Estimate", value: (task: Task) => task.estimate },
};

export const TaskList = ({ tasks }: { tasks: Task[] }) => {
  const { filters, items } = useListFilters({ items: tasks, fields });

  return (
    <Filters.Root filters={filters}>
      {filters.active.map((field) => (
        <Filters.Field key={field.id} id={field.id}>
          <Filters.Value />
          <Filters.Remove>×</Filters.Remove>
        </Filters.Field>
      ))}
      <Filters.Clear>Clear</Filters.Clear>
      <TaskTable tasks={items} />
    </Filters.Root>
  );
};
```

`useTableFilters(table)` reads a TanStack table instead, and `useFilterSearch` keeps the rules in the URL. `useFieldPicker` and `useOptionPicker` return props for a multiple `Cascader.Root`, which adds filters and picks options. Types such as `FilterOption<{ icon: string }>` add the fields your design reads; they are always optional.

## Editable

Text that reads as text and becomes an input in place. Enter commits, Escape cancels, and blur commits; focus returns to the part that started editing.

```tsx
import { Editable } from "@erbium-ui/react/editable";

<Editable.Root defaultValue="Untitled" onValueChange={(value, { reason }) => save(value)}>
  <Editable.Preview />
  <Editable.Input aria-label="Title" />
</Editable.Root>;
```

## Pagination

Page controls laid out so the number of items stays the same as the page moves. With `onPageChange` the parts are buttons; with `getPageHref`, or a router link passed through `render`, they are links.

```tsx
import { Pagination } from "@erbium-ui/react/pagination";

<nav aria-label="Pagination">
  <Pagination.Root page={page} pageCount={20} onPageChange={setPage}>
    <Pagination.List>
      <Pagination.Previous />
      <Pagination.Items>
        {(item) =>
          item.type === "page" ? (
            <Pagination.Page key={item.page} page={item.page} />
          ) : (
            <Pagination.Ellipsis key={item.key} />
          )
        }
      </Pagination.Items>
      <Pagination.Next />
    </Pagination.List>
  </Pagination.Root>
</nav>;
```

## License

MIT
