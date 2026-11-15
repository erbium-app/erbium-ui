---
title: "Command"
description: "Searchable commands and quick actions."
---

**Import:** `@erbium/ui/components/command`

Command composes Base UI Autocomplete in inline mode. Wrap it in CommandDialog for a modal palette. It highlights the first match, keeps keyboard focus in the search input, and supports pointer and Enter activation through `onClick`.

## Usage

```tsx
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandCollection,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@erbium/ui/components/command";

const actions = [
  { value: "calendar", label: "Calendar" },
  { value: "settings", label: "Settings" },
];

<Command items={actions}>
  <CommandInput aria-label="Search commands" placeholder="Search commands..." />
  <CommandEmpty>No results found.</CommandEmpty>
  <CommandList>
    {(action: (typeof actions)[number]) => (
      <CommandItem key={action.value} value={action} onClick={() => runAction(action.value)}>
        {action.label}
      </CommandItem>
    )}
  </CommandList>
</Command>;
```

Supply `items` and render the filtered results using the list callback. Objects with a `label` are searchable by that label; use `itemToStringValue` for other shapes. For grouped results, pass an array of `{ label, items }`, render each group with `CommandGroup items={group.items}`, and place `CommandGroupLabel` and `CommandCollection` inside it. Render items using the collection callback. Keep `CommandEmpty` outside the list so it can appear when the list has no results. Base UI keeps its status element mounted even when results exist; apply spacing only when it contains the empty-state message (`not-empty:py-6`).

## Dialog and actions

Control `CommandDialog` with `open` and `onOpenChange`. Its `title` and `description` provide accessible dialog labels. Close the dialog from an item's `onClick` after running the action. Applications register their own Mod+K shortcut with `useHotkey` from `@tanstack/react-hotkeys` (pass `ignoreInputs` to skip editable targets); the hook adapts the binding to the platform and cleans itself up on unmount. The open dialog pauses the page's hotkeys, so register Mod+K again in a component rendered inside `CommandDialog` to close it with the same keys (the Basic example does this). `CommandShortcut` displays a shortcut; it does not register one.

## Filtering and migration

`value` and `onValueChange` on Command control the search query. Use `filter` for custom matching or `filteredItems` for externally filtered and asynchronous results. Provide an accessible label on CommandInput. Disabled items are excluded from activation.

The previous command API used implicit filtering of JSX children. Migrate to explicit item data and filtered collection callbacks, replace group `heading` with CommandGroupLabel, and replace item `onSelect` with `onClick`. For a persistent selected value, use the Combobox component rather than a command action list.

## Current interaction contract

The root forwards Base UI's current props and event details. Let the primitive own focus, matching, and keyboard navigation instead of duplicating them in application handlers.

Command keeps its opinionated inline/open behavior and automatic highlighting. Its input remains a flush search header separated from the list. For asynchronous results, withhold stale items, cancel obsolete requests, and use `filter={null}` for results filtered upstream. The AsyncResults story demonstrates this with a local request simulation.

`onItemHighlighted(item, details)` can drive a contextual preview. The originating event is available in `details.event`; pointer interactions can report MouseEvent or PointerEvent, while typing can report the reason `none`. Do not assume highlighting means selection.

## Scrolling surfaces

Use the component's built-in scrolling list or content area. It uses the product's thin scrollbar, scroll-aware edge fade, and keyboard-aware viewport. Search headers stay outside the scrolling list. Do not put a second native overflow container around the list or swap in a thicker scrollbar. The available popup space constrains the list while the header keeps its shared responsive geometry.

CommandDialog owns the modal surface; CommandInput owns its flush search header and separator; CommandList owns result padding and scrolling. Place Command directly inside CommandDialog. Do not wrap it in DialogContent or add panel padding: that creates duplicate spacing and scroll containers.
