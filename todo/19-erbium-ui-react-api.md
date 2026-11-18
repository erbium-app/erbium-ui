# 19 — `@erbium-ui/react` primitive APIs

Drafted 2026-11-18. Companion to [19 — `@erbium-ui/react` headless package](./19-erbium-ui-react.md). This file designs each primitive before any code moves. The current `packages/ui` components are the evidence for what the primitives must do, not the source to copy: each one was taken apart into what it looks like, what it does, and how it reacts, and only the last two go into the package.

`@erbium-ui/react` is to these components what Base UI is to Select or Menu. A shadcn-style registry (Erbium's own `packages/ui`, or anyone else's) builds styled components on it and closes the options it does not want.

## Conventions

Every primitive follows Base UI, so a registry author who knows Base UI knows these.

- **Namespace and parts.** `import { Cascader } from "@erbium-ui/react/cascader"`, then `<Cascader.Root>`, `<Cascader.Trigger>`, … One subpath per primitive. Part types are exported as `CascaderRootProps`, `CascaderTriggerProps`, … and state types as `CascaderRootState`, ….
- **One element per part.** Each part renders one default element, takes `render` to replace it (an element or a function of props and state), and `className` and `style` as a value or a function of state. Parts that render nothing (`Root` of a popup primitive) say so.
- **State as data attributes.** Every boolean or enum state a style could need is a `data-*` attribute on the part (`data-selected`, `data-editing`, `data-disabled`, `data-orientation`). No classes, no `data-slot`; the registry adds `data-slot`.
- **CSS variables for continuous values.** Values that change every frame (autoplay progress) are written to a CSS variable on the part's element, not into React state, so they never re-render.
- **Controlled and uncontrolled.** Every piece of state a consumer may own has `value` / `defaultValue` / `onValueChange` (or `open`, `editing`, `page`, …). Change callbacks receive `(value, details)`. `details` has a `reason` (what caused the change), the DOM `event` when there is one, and `cancel()` to reject the change, as Base UI's event details do.
- **Composition over flags.** A behavior that a registry may want to omit is a part, not a boolean on the root (`Cascader.BackItem`, `Editable.Submit`). A part that does not apply in the current state renders nothing.
- **Hooks for custom parts.** Each primitive exports a `use<Name>()` hook returning `{ state, actions }` for parts the namespace does not cover. Pure logic lives in plain modules with no React import, exported for servers and tests.
- **Text is replaceable.** The package ships English defaults only for accessibility text a part must have (`aria-label`, screen-reader counts). Each default is a prop (a string or a function of state). Visible copy (placeholders, summaries) is left to the registry.
- **Direction and orientation.** Arrow keys follow `DirectionProvider` from Base UI and the primitive's `orientation`. Sides and alignments are logical (`start`, `end`).
- **No styling side effects.** No injected CSS, no motion library, no icons.

## Responsibilities split

What each current component does, sorted into the three layers. Only the second and third columns become primitives.

| Component      | Design (stays in the registry)                                                                                  | Function (state and data)                                                                                                                                       | Reactions (input, focus, a11y)                                                                                                                                                                                                                             |
| -------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cascader       | trigger as `Button`, chevron, path separators, row layout, count badge style, search row, sizes, skeleton hints | tree index, single and multiple selection, open level path, reveal of the selected level on open, deep search per level, selected counts per branch, form value | level keys mirrored in RTL, Backspace on empty search goes up, focus kept on search across levels, focus moved to the right row when a level changes without search, screen-reader counts, `aria-haspopup` on branches                                     |
| Filters        | chips, facets, bar layout, summaries ("3 selected", quoted text), Intl formatting, editor layouts, icons        | field model, rules, operators per type, matching, facet counts and ranges from data, list and table adapters, URL codec, add-field tree                         | open the value editor after a field is added, remove a rule when its last option is unchecked, operator change keeps compatible values                                                                                                                     |
| Editable       | text metrics overlay (preview and input share one box), placeholder colour, cursor                              | value, draft, editing, commit or cancel with reasons                                                                                                            | activation by click or double click or focus, Enter commits, Escape cancels, blur commits, IME composition guard, select on edit, focus returns to the preview                                                                                             |
| Pagination     | button variants, sizes, icons, link vs. button look, intent prediction                                          | page layout with boundaries, siblings and stable item count, previous and next, page in state or in URLs                                                        | `aria-current="page"`, disabled steps (`aria-disabled` for links), labelled navigation                                                                                                                                                                     |
| Carousel       | controls, counter style, slide shadows, autoplay icon                                                           | position, count, previous and next availability, loop, align, slides per step, drag, change source, autoplay clock                                              | arrow, Home and End keys by orientation and direction, slide labels "n of m", live region off while playing, inactive slides hidden from assistive tech, autoplay pauses on hover, focus, hidden page, off-screen or covered, reduced motion starts paused |
| Step indicator | dots or numbered steps, fill animation, connector lines                                                         | current step, status per step, progress clock shared with carousel                                                                                              | step buttons, `aria-current="step"`, roving focus                                                                                                                                                                                                          |
| Date input     | input group, calendar icon, popover, calendar look                                                              | text ↔ date parsing per locale, single and range values, month in view, ISO form value                                                                          | commit on Enter and blur, revert on Escape, reformat after commit, select a day or a range end from a calendar                                                                                                                                             |

Not primitives: Data table (TanStack Table is the headless layer; filters and pagination cover its URL state), Form, Skeleton, Toast, Drawer and the other Base UI wrappers, Questionnaire (stays on `@shadcn/react`), Control (deferred).

## Cascader

A select whose options form a tree. Levels open in place inside one popup, and the search of a level finds options at any depth below it. Built on Base UI Menu: `Cascader.Root` is a `Menu.Root`, so Menu's popup parts and every Menu prop keep working.

### Anatomy

```tsx
<Cascader.Root items={tree} value={value} onValueChange={setValue}>
  <Cascader.Trigger>
    <Cascader.Value placeholder="Pick a region" />
  </Cascader.Trigger>
  <Cascader.Portal>
    <Cascader.Positioner>
      <Cascader.Popup>
        <Cascader.Search /> {/* only with `searchable` */}
        <Cascader.Back /> {/* renders inside a level only */}
        <Cascader.SearchClear />
        <Cascader.Empty>No results</Cascader.Empty>
        <Cascader.List>
          <Cascader.BackItem>Back</Cascader.BackItem> {/* inside a level, without search */}
          <Cascader.Level>
            <Cascader.LevelLabel /> {/* inside a level only */}
            <Cascader.Rows>
              {(row) => (
                <Cascader.Item key={row.node.value} row={row}>
                  <Cascader.ItemIndicator />
                  {row.node.label}
                  <Cascader.ItemTrail />
                  <Cascader.ItemCount />
                </Cascader.Item>
              )}
            </Cascader.Rows>
          </Cascader.Level>
        </Cascader.List>
        <Cascader.Clear>Clear</Cascader.Clear>
      </Cascader.Popup>
    </Cascader.Positioner>
  </Cascader.Portal>
</Cascader.Root>
```

### Data

```ts
interface CascaderNode<TData = unknown> {
  value: string; // unique across the tree; a leaf's value is what gets selected
  label: string; // text for search, typeahead and the default value display
  keywords?: string[]; // extra search terms
  disabled?: boolean; // a disabled branch cannot be opened
  children?: CascaderNode<TData>[];
  data?: TData; // anything the registry renders: icons, descriptions, counts
}
```

`icon` and `description` from today's node move into `data`, because they are presentation. Only leaves are selectable. Branch selection (picking "Europe" as a whole) is out of scope until a use appears; it would be a `selectionMode="any"` root prop.

Pure module `@erbium-ui/react/cascader/tree` (no React, server-safe): `createCascaderIndex(items)`, `searchLevel(nodes, query, match)`, `getNodePath(index, value)`, `countSelectedBelow(index, selected)`.

### Parts

**Root** — renders no element. Holds selection, open level and query, and renders `Menu.Root` (wrapped in `Menu.FilterProvider` when searchable) plus hidden inputs.

| Prop                                       | Type                               | Default                                      | Notes                                                                                                                       |
| ------------------------------------------ | ---------------------------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `items`                                    | `CascaderNode[]`                   | —                                            |                                                                                                                             |
| `multiple`                                 | `boolean`                          | `false`                                      | discriminates the value types below                                                                                         |
| `value` / `defaultValue`                   | `string \| null` or `string[]`     | `null` / `[]`                                |                                                                                                                             |
| `onValueChange`                            | `(value, details) => void`         |                                              | `details.reason`: `"item-press" \| "clear" \| "keyboard"`; `details.node`, `details.path` (root first, empty when cleared)  |
| `searchable`                               | `boolean`                          | `false`                                      | enables `Search`, `Empty`, `SearchClear`; changes keyboard behavior (below)                                                 |
| `filter`                                   | `(node, query) => boolean`         | locale-aware substring on label and keywords |                                                                                                                             |
| `level` / `defaultLevel` / `onLevelChange` | `string[]` (path of branch values) | reveal path                                  | lets a registry persist or drive the open level                                                                             |
| `revealSelected`                           | `boolean`                          | `true`                                       | on open, a single selection opens the level that holds it; multiple opens at the top                                        |
| `name`, `form`, `required`, `disabled`     |                                    |                                              | one hidden input per selected value                                                                                         |
| …Menu.Root props                           |                                    |                                              | `open`, `defaultOpen`, `onOpenChange`, `onOpenChangeComplete`, `modal`, `loopFocus`, `actionsRef`, `handle`, … pass through |

**Trigger** — `Menu.Trigger` (`<button>`). Adds `data-placeholder` when nothing is selected and `aria-haspopup="menu"`.

**Value** — `<span>`. `placeholder`; `children` as nodes or `(state) => ReactNode` with `state.paths` (each selected leaf's path, root first). Default text: the single path joined with " / ", or the leaf labels joined with ", ". `data-placeholder` when empty.

**Portal, Positioner, Popup, Arrow, Backdrop** — Base UI Menu parts, re-exported so the namespace is complete.

**Search** — `Menu.Input`. Registers itself so focus can return to it across level changes. `aria-label` and `placeholder` accept a function of `{ level }`; defaults `"Search options"` at the top, `` `Search ${level.label}` `` inside a level. Throws a named error outside a searchable root.

**SearchClear** — `Menu.Clear`, clears the query.

**Back** — `<button>` that goes to the parent level and refocuses the search. Renders nothing at the top level. `aria-label` defaults to `` `Back to ${parent?.label ?? "all options"}` ``.

**Empty** — `Menu.Empty`, shown when the level search matches nothing.

**List** — `Menu.List`. Owns the level keys when there is no search field.

**BackItem** — `Menu.Item` that goes to the parent level, for cascaders without search. Renders nothing at the top level or when searchable. Focus lands on the row of the level just left.

**Level** — `Menu.RadioGroup` (single) or `Menu.Group` (multiple) for the open level. `data-level-depth`.

**LevelLabel** — `Menu.GroupLabel`, the open level's label. Renders nothing at the top level. Default children: the level's label.

**Rows** — no element. `children: (row: CascaderRow) => ReactNode`, called for each row of the open level, or for each search match at any depth below it. `row = { node, trail, kind: "leaf" | "branch", depth }`; `trail` holds the ancestors between the open level and a search match.

**Item** — one row. Takes `row` (or `node`). A branch renders `Menu.Item` that opens its level; a leaf renders `Menu.RadioItem` (single) or `Menu.CheckboxItem` (multiple). Item-level `closeOnClick` defaults: leaf in single mode `true`, otherwise `false`.

| Data attribute                      | When                                       |
| ----------------------------------- | ------------------------------------------ |
| `data-kind="leaf" \| "branch"`      | always                                     |
| `data-checked`                      | leaf is selected                           |
| `data-selected`                     | branch holds a selected leaf below it      |
| `data-highlighted`, `data-disabled` | from Menu                                  |
| `data-search-result`                | row is a search match below the open level |

**ItemIndicator** — the radio or checkbox indicator for a leaf (`Menu.RadioItemIndicator` / `Menu.CheckboxItemIndicator`, with `keepMounted`). Renders nothing for a branch.

**ItemTrail** — `<span>` with the row's trail labels joined by " / ". Renders nothing when the trail is empty. `children` as `(trail) => ReactNode`.

**ItemCount** — `<span>` for a branch: the selected count below it in multiple mode once any is selected, otherwise the child count. Visible text is the number; screen-reader text is a visually hidden span, default `", 3 options"`, `", 2 selected"`, plus `", holds the selection"` in single mode. `children` and `srLabel` take functions of `{ count, selected, childCount, multiple }`. Renders nothing for a leaf.

**Clear** — `<button>` that clears the selection and refocuses the search. `data-disabled` and `disabled` while nothing is selected.

### Keyboard

| Key                                         | With search (focus in the field)                     | Without search (focus on rows)                         |
| ------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------ |
| Arrow Up / Down                             | move the highlight (Menu)                            | move focus (Menu)                                      |
| Enter-key arrow (Right in LTR, Left in RTL) | at the end of the text, opens the highlighted branch | opens the focused branch                               |
| Back-key arrow (Left in LTR, Right in RTL)  | at the start of the text, goes to the parent level   | goes to the parent level and focuses the row just left |
| Backspace                                   | on an empty field, goes to the parent level          | —                                                      |
| Enter / Space                               | picks a leaf or opens a branch                       | picks a leaf or opens a branch                         |
| Escape                                      | closes (Menu)                                        | closes (Menu)                                          |

### Hook

`useCascader()` → `{ state: { selected, multiple, level, levelNode, parentNode, query, searchable }, actions: { select, toggle, clear, enter, back, focusSearch }, index }`.

### What Erbium's registry closes

Root: no `level` control, no `revealSelected` change. Trigger is the select-style button with chevron or any `render`. Search row always has the search icon, Back and SearchClear. Rows render icon, label, trail and count in one layout. Single `size` scale `sm | default`.

## Filters

A filter builder for lists and tables: fields, rules on them, and how rules match data. The core is plain data, so the same rules can be kept in the URL or sent to a server. The UI parts bind one rule to controls the registry already has (Cascader, Menu, NumberField, Calendar).

### Entries

- `@erbium-ui/react/filters/core` — no React, no `"use client"`, safe on a server: types, operators, `createRule`, `changeOperator`, `matchesRule`, `isFilterRule`, `createFilters`, the URL codec (`parseFilterSearch`, `toFilterSearch`, `validateFilterSearch`, `encodeFilterParam`, `decodeFilterParam`, `getColumnFilterFields`), the table filter function (`filterFn_rule`, `filterColumn`), and option tree helpers (`findOption`, `forEachLeafOption`).
- `@erbium-ui/react/filters` — React: the parts below, `useListFilters`, `useTableFilters`, `useFilterSearch`, `useFilterField`, and a re-export of the core.

`filterFn_rule` is written without `@tanstack/react-table` (TanStack's `constructFilterFn` only assigns `filter` and `autoRemove` to a function), and the table adapter reads tables structurally, so the package does not depend on TanStack Table.

### Model

```ts
type FilterType = "text" | "number" | "date" | "option" | "multiOption";
interface FilterRule {
  type: FilterType;
  operator: FilterOperator;
  values: FilterValue[];
}
type FilterState = { id: string; value: unknown }[]; // same shape as TanStack ColumnFiltersState

interface FilterFieldConfig<TData = unknown> {
  type: FilterType;
  label: string;
  options?: FilterOption<TData>[]; // tree allowed; values unique across the tree
  min?: number;
  max?: number;
  step?: number;
  data?: TData; // icon, placeholder, number format: registry concerns
}
```

`icon`, `placeholder` and `format` leave the core config for `data`, typed by the registry. Erbium declares `FilterFieldConfig<{ icon?: IconName; placeholder?: string; format?: Intl.NumberFormatOptions }>` once in its wrapper.

Operator words ("is any of", "is between") are content. The core exports operator ids and a default English `operatorLabels` map; `getOperatorLabel(type, operator, valueCount, labels?)` takes a replacement map.

### Adapters

- `useListFilters({ items, fields, value, defaultValue, onValueChange })` → `{ filters, items }`. Facet counts and number ranges follow the other active rules.
- `useTableFilters(table, { counts })` → `filters`, for a TanStack table; server counts override facets.
- `useFilterSearch({ search, fields, onSearchChange })` → `{ value, onValueChange }`, the URL as the only copy of the rules. Router agnostic.

### Parts

**Root** — no element. Provides one `Filters` object (from an adapter) to the parts: `<Filters.Root filters={filters}>`. Optional `onFieldAdded(id, details)`.

**Field** — no element. Scopes the parts inside it to one field: `<Filters.Field id="status">`. `useFilterField()` inside returns `{ field, rule, empty, actions: { setOperator, setValues, setValue(index, value), toggleOption(value, checked), remove } }`.

**FieldPicker** — a `Cascader.Root` whose tree is the fields, with option fields opening their option trees. Selecting an option toggles it; selecting a text, number or date field adds an empty rule, closes the picker and calls `onFieldAdded` after the close completes, so the registry can open that field's editor with focus returned. All Cascader parts work inside it.

**OptionPicker** — inside a `Field` of type option or multiOption: a `Cascader.Root` bound to the field's options and rule values (multiple). Unchecking the last option removes the rule. `counts` from facets are on each row as `row.node.data.count`.

**Operator** — inside a `Field`: a `Menu.RadioGroup` whose value is the rule's operator, with `Filters.OperatorItem operator="…"` items. Changing the operator keeps values that still apply. `operators` from the field type are available from `useFilterField()`.

**Value** — inside a `Field` of type text or number: an `<input>` bound to `values[index]` (`index` 0 or 1 for ranges). Text writes strings, number parses with `valueAsNumber`, blank writes `null`. For richer controls, bind Base UI NumberField to `useFilterField().actions.setValue`.

**Remove** — inside a `Field`: `<button>` that removes the rule. Default `aria-label` `` `Remove ${field.label} filter` ``.

**Clear** — `<button>` that removes every rule the root owns. `data-disabled` without rules.

Data attributes on Field-scoped parts: `data-type`, `data-operator`, `data-empty` (rule has no values), `data-active` (field has a rule).

Summaries ("Status is Paid, Open", "3 selected") stay in the registry; the core exports `getRuleValues(field)` with option labels resolved so a registry can format them.

### What Erbium's registry closes

Three layouts only (bar with chips, facets, add menu). Fixed editors per type (cascader for options, NumberField pair, calendar). Options named up to two, counted past that. English operator words.

## Editable

Text that reads as plain text and becomes an input in place. Base UI has no equivalent.

### Parts

**Root** — `<div>`.

| Prop                                                                   | Type                                                    | Default   |
| ---------------------------------------------------------------------- | ------------------------------------------------------- | --------- |
| `value` / `defaultValue` / `onValueChange`                             | `string`                                                | `""`      |
| `editing` / `defaultEditing` / `onEditingChange`                       | `boolean`                                               | `false`   |
| `onSubmit(value, details)`                                             | `details.reason`: `"enter" \| "blur" \| "submit-press"` |           |
| `onCancel(details)`                                                    | `details.reason`: `"escape" \| "cancel-press"`          |           |
| `activationMode`                                                       | `"click" \| "dblclick" \| "focus" \| "none"`            | `"click"` |
| `submitMode`                                                           | `"enter" \| "blur" \| "both" \| "none"`                 | `"both"`  |
| `selectOnEdit`                                                         | `boolean`                                               | `true`    |
| `placeholder`, `disabled`, `readOnly`, `required`, `name`, `maxLength` |                                                         |           |

`onValueChange` fires on commit only; the draft is internal. `name` submits the committed value.

**Preview** — `<button type="button">` showing the value, or the placeholder with `data-empty`. Activates editing per `activationMode`. While editing it stays in the layout (so the input can overlay it and keep its size), with `aria-hidden` and `tabIndex={-1}`.

**Input** — `<input>` (or a `<textarea>` through `render`). Present in both modes so text metrics match; inert while not editing. In a textarea, Enter commits only with Ctrl or Cmd. IME composition never commits.

**Trigger** — `<button>` that starts editing, for an explicit edit button. Hidden while editing.

**Submit**, **Cancel** — `<button>`s, rendered only while editing.

Focus returns to the Preview (or the Trigger, when focus came from it) after commit or cancel.

Data attributes on every part: `data-editing`, `data-empty`, `data-disabled`, `data-readonly`.

### What Erbium's registry closes

Input only, no textarea. Click activation. No Trigger, Submit or Cancel.

## Pagination

Page controls laid out so the item count stays constant as the page moves.

Pure: `getPagination({ page, pageCount, siblingCount, boundaryCount })` → `{ page, pageCount, items, previousPage, nextPage }` (unchanged from `hooks/use-pagination.ts`).

### Parts

**Root** — `<nav>`, `aria-label="Pagination"` by default.

| Prop                                                   | Type               | Default  |
| ------------------------------------------------------ | ------------------ | -------- |
| `page` / `defaultPage` / `onPageChange(page, details)` | `number`, 1-based  | `1`      |
| `pageCount`                                            | `number`           | —        |
| `siblingCount`, `boundaryCount`                        | `number`           | `1`, `1` |
| `getPageHref`                                          | `(page) => string` | —        |

With `getPageHref`, page parts render `<a href>`; without it, `<button>`s that call `onPageChange`. A router link goes through `render` and reads the page from state: `render={(props, state) => <Link {...props} to="." search={{ page: state.page }} />}`.

**List** — `<ul>`. **Items** — no element, `children: (item) => ReactNode` over `getPagination().items`.

**Page** — `page` prop. `aria-current="page"` and `data-current` on the current page.

**Previous**, **Next**, **First**, **Last** — steps. On the boundary they are disabled: buttons get `disabled`, links lose `href` and get `aria-disabled` and `role="link"`. Default `aria-label`s: "Go to previous page", "Go to next page", "Go to first page", "Go to last page".

**Ellipsis** — `<span aria-hidden>` with a visually hidden "More pages" default.

### What Erbium's registry closes

TanStack Router `to`/`search` link options instead of `getPageHref`, intent prediction (`onPageIntent`), button variants and sizes, no First or Last.

## Step indicator

An ordered list of steps with one current step, optionally advancing on a clock. Used alone, inside a questionnaire, and as the carousel's indicator.

### Parts

**Root** — `<ol>`.

| Prop                                                       | Type                                               | Default                                         |
| ---------------------------------------------------------- | -------------------------------------------------- | ----------------------------------------------- |
| `value` / `defaultValue` / `onValueChange(index, details)` | `number`, 0-based                                  | `0`                                             |
| `count`                                                    | `number`                                           | number of `Item`s                               |
| `orientation`                                              | `"horizontal" \| "vertical"`                       | `"horizontal"`                                  |
| `autoplay`                                                 | `boolean \| { duration?: number; loop?: boolean }` | `false`                                         |
| `progress`                                                 | `number` 0–1                                       | controlled fill; takes precedence over autoplay |
| `navigation`                                               | `"free" \| "visited" \| "none"`                    | `"free"` — which steps can be pressed           |

The current step's fill is written to `--step-progress` on the Root and on the current Item, every frame, with no re-render. Autoplay pauses while the Root is hovered, while the page is hidden and under reduced motion.

**Item** — `<li>` containing a `<button>` (via `render` for links). `index` prop (defaults to order). `data-status="complete" | "current" | "upcoming"`, `aria-current="step"`. Arrow keys move focus between pressable items (roving tab index).

**ItemIndicator** — `<span>` for the dot or number, with the same data attributes.

**Separator** — `<span aria-hidden>` between items, with `data-status` of the item before it.

### What Erbium's registry closes

Two looks (`steps`, `dots`), horizontal only in the carousel.

## Carousel

Slides moved by buttons, keys, drag or a timer. Built on Embla, which becomes a dependency of this entry.

### Parts

**Root** — `<section aria-roledescription="carousel">`.

| Prop                                                       | Type                                                                                       | Default        |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------ | -------------- |
| `value` / `defaultValue` / `onValueChange(index, details)` | `number`                                                                                   | `0`            |
| `details.reason`                                           | `"button" \| "drag" \| "keyboard" \| "indicator" \| "autoplay" \| "focus" \| "imperative"` |                |
| `orientation`                                              | `"horizontal" \| "vertical"`                                                               | `"horizontal"` |
| `align`                                                    | `"start" \| "center" \| "end"`                                                             | `"start"`      |
| `loop`, `dragFree`                                         | `boolean`                                                                                  | `false`        |
| `slidesToScroll`                                           | `number \| "auto"`                                                                         | `1`            |
| `engineOptions`, `plugins`                                 | Embla options and plugins                                                                  | pass through   |

`actionsRef` exposes `{ goTo, previous, next }`.

**Viewport** — `<div>`, the clipping element Embla measures.

**Track** — `<div>`, the moving container; `aria-live="polite"`, switched off while autoplay runs.

**Slide** — `<div role="group" aria-roledescription="slide">`, labelled "3 of 8" unless given a label. `data-active`; inactive slides are `inert`. Focus moving into a slide brings it into view (`reason: "focus"`).

**Previous**, **Next** — `<button>`s with `aria-controls` on the track, disabled at the ends unless looping.

**Indicator** — a `StepIndicator.Root` bound to the carousel's position (`reason: "indicator"`), so its parts and `--step-progress` work inside.

**Counter** — `<span>`, default text "3 / 8", `children` as `(state) => ReactNode`.

**Autoplay** — `<button>` that owns the timer: `delay` (ms, default 5000), `pauseOnHover`, `pauseOnFocus` (both `true`), `stopOnInteraction` (`false`). Toggles play and pause; `data-playing`. Starts paused under reduced motion. Pauses while the page is hidden, the carousel is off-screen, or another layer covers it. Writes `--carousel-progress` on the Root.

Keys on the Root: the arrows for the orientation (mirrored in RTL), Home, End; ignored while focus is in an editable field.

### What Erbium's registry closes

Horizontal only, `start` alignment, dots indicator, counter format, autoplay button icons.

## Date input

A text field that reads and writes dates in the reader's locale, for a single date or a range. The calendar is not part of it; a registry binds any calendar through the hook.

### Parts

**Root** — `<div>`.

| Prop                                                       | Type                                                             | Default                                                      |
| ---------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------ |
| `mode`                                                     | `"single" \| "range"`                                            | `"single"`                                                   |
| `value` / `defaultValue` / `onValueChange(value, details)` | `Date \| undefined` or `{ from?: Date; to?: Date } \| undefined` |                                                              |
| `locale`                                                   | BCP 47                                                           | page locale                                                  |
| `formatOptions`                                            | `Intl.DateTimeFormatOptions`                                     | `{ dateStyle: "medium" }`                                    |
| `parse`                                                    | `(text, locale) => Date \| undefined`                            | built-in locale-aware parser                                 |
| `min`, `max`, `disabled`, `readOnly`, `required`, `name`   |                                                                  | `name` submits ISO (`2026-11-18` or `2026-11-18/2026-11-30`) |

**Input** — `<input>`. Holds free text while typing. Enter or blur parses and commits: valid text sets the value and is rewritten in the canonical format, invalid text reverts and sets `data-invalid` until the next edit. Escape reverts.

**Clear** — `<button>`, rendered when there is a value.

`useDateInput()` → `{ state: { value, text, month, mode }, actions: { selectDay(day), setMonth(month), commitText(text), clear } }`. `selectDay` in range mode sets the start, then the end, swapping them when the end comes first. A registry passes `month`, `setMonth`, `value` and `selectDay` to its calendar.

Pure: `parseDate`, `parseDateRange`, `formatDate`, `formatDateRange`, `toISODate` (from `lib/date.ts`).

### What Erbium's registry closes

Popover with Day Picker calendar, icon trigger, `closeOnSelect`, medium date style.

## Tests

Each primitive ships with:

- **Pure tests** for its module (tree index and search, rule matching per operator, URL codec round trips, pagination layout, date parsing per locale).
- **Interaction tests** in jsdom with Testing Library: every keyboard row in the tables above, controlled and uncontrolled state, change reasons, `cancel()`, focus after level changes and commits, and form submission through hidden inputs.
- **Server render tests** with `react-dom/server` for every root, so the parts render without `window`.

## Order

1. Cascader, then Filters (FieldPicker and OptionPicker are Cascader roots).
2. Editable and Pagination.
3. Step indicator, then Carousel (its indicator is a step indicator), sharing one frame clock.
4. Date input.

Each step replaces the matching `packages/ui` component with a styled wrapper on the primitive, keeping the exported Erbium API, and regenerates the registry.
