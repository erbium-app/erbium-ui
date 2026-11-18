---
title: "Cascader"
description: "A headless select whose options form a tree, opened one level at a time inside one popup."
---

A select over a tree of options. A branch opens its level in place of the current one, inside the same popup, and a way back returns to the level above. Single and multiple selection, search at any depth, and form submission are built in. The popup, positioner and menu behavior are Base UI's `Menu`.

The styled version is the [Cascader component](/docs/components/cascader).

**Import:** `@erbium-ui/react/cascader`

## Anatomy

```tsx
import { Cascader } from "@erbium-ui/react/cascader";

<Cascader.Root items={items} searchable>
  <Cascader.Trigger>
    <Cascader.Value />
  </Cascader.Trigger>
  <Cascader.Portal>
    <Cascader.Positioner>
      <Cascader.Popup>
        <Cascader.SearchGroup>
          <Cascader.Back />
          <Cascader.Search />
          <Cascader.SearchClear />
        </Cascader.SearchGroup>
        <Cascader.Empty />
        <Cascader.List>
          <Cascader.Level>
            <Cascader.LevelLabel />
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
        <Cascader.Clear />
      </Cascader.Popup>
    </Cascader.Positioner>
  </Cascader.Portal>
</Cascader.Root>;
```

## Items

`items` is a tree of nodes. A node with `children` is a branch; one without is a leaf, and only leaves are selected. `data` carries whatever your design renders, such as an icon, and is typed through `CascaderNode<TData>`.

```ts
import type { CascaderNode } from "@erbium-ui/react/cascader";

const items: CascaderNode<{ flag: string }>[] = [
  {
    value: "germany",
    label: "Germany",
    data: { flag: "🇩🇪" },
    children: [{ value: "berlin", label: "Berlin", keywords: ["capital"] }],
  },
];
```

Parts with node render callbacks accept the same node type as the root, for example `<Cascader.Rows<MyNode>>` or `<Cascader.Value<MyNode>>`. The value callback receives `paths`, `multiple`, `placeholder`, and the default display `text`.

## Selection

A single cascader selects one leaf and closes. A multiple cascader checks any number of leaves and stays open.

```tsx
<Cascader.Root
  multiple
  items={items}
  value={value}
  onValueChange={(next, details) => {
    // details.reason: "item-press" | "clear-press"
    // details.node: the leaf, or null when cleared; details.path: its ancestors and itself
    setValue(next);
  }}
/>
```

`name` submits each selected value with a surrounding form, and `form` names a form the cascader is outside of.

## Levels

The open level is the list of branch values from the top. It can be controlled with `level` and `onLevelChange`, whose details give a reason of `"branch-press"`, `"back-press"`, `"arrow-key"`, `"backspace-key"` or `"open"`. On open, a single selection opens the level that holds it; `revealSelected={false}` always opens at the top.

## Search

`searchable` adds a search field that filters the open level and finds options at any depth below it. Matches below the open level carry `data-search-result`, and `Cascader.ItemTrail` shows the path to them. `filter` replaces the default locale-aware substring test on labels and keywords.

## Keyboard

| Key                    | Action                                                                        |
| ---------------------- | ----------------------------------------------------------------------------- |
| ArrowDown, ArrowUp     | Move between rows.                                                            |
| ArrowRight (RTL: Left) | Open the highlighted branch. In the search field, with the caret at the end.  |
| ArrowLeft (RTL: Right) | Return to the parent level. In the search field, with the caret at the start. |
| Backspace              | In an empty search field, return to the parent level.                         |
| Enter, Space           | Open a branch, or select a leaf.                                              |
| Escape                 | Close the popup.                                                              |

Focus stays in the search field while levels change. Without one, focus moves to the row just left when going back, or to the first row when going in.

## API reference

### Root

Holds the selection, the open level and the search text, and renders Base UI's `Menu.Root`. Every `Menu.Root` prop passes through.

| Prop                                       | Type                                          | Default      |
| ------------------------------------------ | --------------------------------------------- | ------------ |
| `items`                                    | `CascaderNode[]`                              | —            |
| `multiple`                                 | `boolean`                                     | `false`      |
| `value` / `defaultValue` / `onValueChange` | `string \| null`, or `string[]` when multiple | `null`, `[]` |
| `level` / `defaultLevel` / `onLevelChange` | `string[]`                                    | `[]`         |
| `searchable`                               | `boolean`                                     | `false`      |
| `filter`                                   | `(node, query) => boolean`                    | —            |
| `revealSelected`                           | `boolean`                                     | `true`       |
| `name`, `form`                             | `string`                                      | —            |

### Parts

| Part            | Element                                    | Notes                                                                                                 |
| --------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `Trigger`       | `Menu.Trigger`                             | `data-placeholder` while nothing is selected.                                                         |
| `Value`         | `<span>`                                   | The selection as text: the path of a single selection, the labels of a multiple one.                  |
| `SearchGroup`   | `<div>`                                    | Focuses the search input when the surrounding surface is pressed. `data-nested` marks an open branch. |
| `Search`        | `Menu.Input`                               | `levelLabel` and `levelPlaceholder` name the field per level.                                         |
| `SearchClear`   | `Menu.Clear`                               | Clears the search text.                                                                               |
| `Back`          | `<button>`                                 | Back to the parent level. Renders nothing at the top level.                                           |
| `BackItem`      | `Menu.Item`                                | A back row for a cascader without search.                                                             |
| `List`          | `Menu.List`                                | The open level's list.                                                                                |
| `Level`         | `Menu.RadioGroup` or `Menu.Group`          | `data-level-depth`.                                                                                   |
| `LevelLabel`    | `Menu.GroupLabel`                          | The open branch's label. Renders nothing at the top level.                                            |
| `Rows`          | none                                       | `children(row)` for each row of the open level, or each search match.                                 |
| `Item`          | `Menu.Item`, `RadioItem` or `CheckboxItem` | `data-kind`, `data-selected`, `data-search-result`, `data-value`.                                     |
| `ItemIndicator` | Base UI item indicator                     | Renders nothing for a branch. Items expose `data-multiple` in multiple mode.                          |
| `ItemTrail`     | `<span>`                                   | The path to a search match. `fallback` supplies content for direct children.                          |
| `ItemCount`     | `<span>`                                   | Selected leaves below a branch, or its options. Labelled for screen readers.                          |
| `Empty`         | `Menu.Empty`                               | Shown when the search matches nothing.                                                                |
| `Clear`         | `<button>`                                 | Clears the selection. Disabled while nothing is selected.                                             |

`Portal`, `Positioner`, `Popup`, `Arrow` and `Backdrop` are Base UI's `Menu` parts.
