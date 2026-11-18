---
title: "Cascader"
description: "Pick a value from a tree of options, one level at a time."
---

A select whose options form a tree. A row with children opens its level in place, inside the same popup, with a way back to the level before. The trigger shows the full path of the selection, because in a nested list the leaf alone is often ambiguous. Use it for region pickers, category trees, attribute pickers, permission scopes and anywhere else a flat list would be too long to scan.

**Import:** `@erbium/ui/components/cascader`

## Usage

```tsx
import {
  Cascader,
  CascaderContent,
  CascaderEmpty,
  CascaderList,
  CascaderSearch,
  CascaderTrigger,
  CascaderValue,
} from "@erbium/ui/components/cascader";
import type { CascaderNode } from "@erbium/ui/components/cascader";
```

```tsx
const regions: CascaderNode[] = [
  {
    value: "europe",
    label: "Europe",
    children: [
      {
        value: "germany",
        label: "Germany",
        children: [
          { value: "berlin", label: "Berlin" },
          { value: "munich", label: "Munich", keywords: ["München"] },
        ],
      },
    ],
  },
];

const [city, setCity] = React.useState<string | null>(null);

return (
  <Cascader searchable items={regions} value={city} onValueChange={setCity}>
    <CascaderTrigger aria-label="City">
      <CascaderValue placeholder="Choose a city" />
    </CascaderTrigger>
    <CascaderContent>
      <CascaderSearch placeholder="Search places…" />
      <CascaderEmpty>No places found.</CascaderEmpty>
      <CascaderList />
    </CascaderContent>
  </Cascader>
);
```

## Anatomy

```text
Cascader                 (Menu.Root with the tree, the value, the open level and the search)
├── CascaderTrigger      (select-style button)
│   └── CascaderValue    (path of the selection, or a placeholder)
└── CascaderContent      (the popup; every level opens inside it)
    ├── CascaderSearch   (search of the open level, with the back button; needs `searchable`)
    ├── CascaderEmpty    (needs `searchable`)
    ├── CascaderList     (the name and options of the open level)
    └── CascaderClear    (optional footer that clears the selection)
```

The parts read the open level from `Cascader`, so the same composition serves every level. Inside a level, `CascaderSearch` leads with a back button and its placeholder names the level ("Search Germany…"), and `CascaderList` shows the level's name above its options. Without a search field, `CascaderList` starts each level with a Back row instead.

## Items

`items` is the tree. A node with `children` opens a level; a node without children is a leaf, and only leaves are selected.

| Field         | Type             | Description                                                                 |
| :------------ | :--------------- | :-------------------------------------------------------------------------- |
| `value`       | `string`         | Stable unique id, and the committed value of a leaf.                        |
| `label`       | `string`         | Display text, used by search and typeahead.                                 |
| `icon`        | `ReactNode`      | Leading icon of the row.                                                    |
| `description` | `string`         | Secondary line under the label.                                             |
| `children`    | `CascaderNode[]` | Nodes of the next level.                                                    |
| `disabled`    | `boolean`        | Keeps the node visible but unselectable. A disabled level cannot be opened. |
| `keywords`    | `string[]`       | Extra terms the search matches, such as abbreviations or other spellings.   |

A row with children shows how many options it holds. The tree is indexed once per `items` reference, so keep `items` stable: define it outside the component or memoize it.

## Selection

Without `multiple`, leaves are radio items. Picking one closes the popup, and `value` is the leaf's `value` or `null`. The popup reopens on the level that holds the selection, and the row of each level above it reads "holds the selection" to screen readers.

With `multiple`, leaves are checkbox items, the popup stays open while picking, and `value` is an array. The popup opens at the top level, where a level that holds selected leaves shows how many in place of its option count.

`onValueChange` receives the new value and details with the picked or toggled `node` and its `path`, root first. Both are empty after `CascaderClear`: `node` is `null` and `path` is `[]`. `CascaderValue` takes a function child for custom rendering; it receives the path of each selected leaf.

Add `CascaderClear` at the end of `CascaderContent` for a "Clear selection" footer. It is disabled while nothing is selected.

Pass `name` to submit the selection with a native form: each selected value becomes a hidden input with that name.

## Search

Add `searchable` to `Cascader`, then place `CascaderSearch` and `CascaderEmpty` in `CascaderContent`. This mirrors `searchable` on Dropdown Menu, which uses the same search header.

The search of a level finds options at any depth below it, not only on the level itself. Each result shows the path that leads to it under its label. Picking a leaf result selects it; picking a result with children opens its level. The query clears whenever the level changes.

Matching ignores case, accents and punctuation, and checks the label and any `keywords`. Pass `filter` to replace it; it receives the node and the trimmed query.

## Custom rows

Most rows need only `icon` and `description` on the node. For anything else, pass a function to `CascaderList`. It renders the content of each row, while the cascader keeps the check, the count and the chevron:

```tsx
<CascaderList>
  {(node) => (
    <>
      <Avatar src={avatars.get(node.value)} />
      <span className="truncate">{node.label}</span>
    </>
  )}
</CascaderList>
```

## Keyboard

With a search field, focus stays in the field and the arrow keys move the highlight:

| Key                   | Action                                                                 |
| :-------------------- | :--------------------------------------------------------------------- |
| `Enter`, `Space`, `↓` | Open the cascader from the trigger.                                    |
| `↓`, `↑`              | Move through the options of the level.                                 |
| `→`                   | Open the highlighted level, when the caret is at the end of the query. |
| `←`                   | Go back one level, when the caret is at the start of the query.        |
| `Backspace`           | Go back one level, when the query is empty.                            |
| `Enter`               | Pick the highlighted leaf, or open the highlighted level.              |
| `Esc`                 | Close the cascader.                                                    |

Without a search field, focus moves through the rows, and `→`, `←` and `Enter` work the same way. Opening a level focuses its first option, and going back focuses the row of the level you left. In right-to-left layouts, `←` and `→` swap.

## Accessibility

- The trigger is a button that opens a menu. Name it with a `FieldLabel htmlFor` its `id`, or with `aria-label`.
- Leaves are `menuitemradio` or `menuitemcheckbox` items with `aria-checked`. A row with children is a `menuitem` with `aria-haspopup`, and its name includes its option count, or how many leaves below it are selected.
- The search field is named after its level: "Search options" at the top and "Search Europe" inside Europe. Pass `aria-label` to `CascaderSearch` to replace it. The back button is named after the level it returns to.
- `CascaderEmpty` is a polite live region.

## Forms

Compose the cascader inside `field.Field` with `field.FieldError`, as with Select. The trigger takes the invalid outline from the field, and a rejected submit shakes it. While the popup is open, focus is in the search rather than on the trigger, so mark the field touched when the popup closes instead of on blur:

```tsx
<Cascader
  searchable
  items={regions}
  value={field.state.value === "" ? null : field.state.value}
  onValueChange={(next) => {
    field.handleChange(next ?? "");
  }}
  onOpenChange={(open) => {
    if (!open) {
      field.handleBlur();
    }
  }}
>
```

## Compared with Dropdown Menu

Use Dropdown Menu, with submenus, for actions. Use Cascader to choose a value from a tree: it owns the selection, keeps every level in one popup, shows the selection in the trigger and searches across levels.
