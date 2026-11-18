# @erbium-ui/react

Unstyled, accessible React primitives for components that hold real behavior: cascading selects, filter builders, inline editing and pagination. Each primitive is a set of parts in the style of [Base UI](https://base-ui.com): you render the parts, style them with `className`, and read their state from `data-*` attributes.

Erbium UI's styled components are built on these primitives. Use this package directly when you want the behavior with your own design.

## Install

```sh
npm install @erbium-ui/react @base-ui/react
```

React 19 and `@base-ui/react` 1.9 or later are peer dependencies.

## Entry points

| Import                           | Contents                                            | Runs on          |
| -------------------------------- | --------------------------------------------------- | ---------------- |
| `@erbium-ui/react/cascader`      | `Cascader` parts, `useCascader`, tree helpers       | Client           |
| `@erbium-ui/react/cascader/tree` | Tree indexing, level rows and search, without React | Server or client |

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

## License

MIT
