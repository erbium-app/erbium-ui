---
title: "Dropdown Menu"
description: "Button-triggered actions with optional search."
---

Use a dropdown menu for actions on a project, file, or workspace. Use Combobox for choosing a value and Command for a command palette spanning the application.

## Structure

`DropdownMenuContent` owns the overlay surface and positioning. Put actions inside `DropdownMenuList`, which owns scrolling, item padding, and keyboard navigation. This structure is required for both plain and searchable menus. A submenu has its own Content and List.

For a short menu, omit `searchable`, Search, and Empty. Search belongs in menus with enough actions to benefit from filtering; it is not added automatically to every popup.

## Searchable actions

```tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSearch,
  DropdownMenuEmpty,
  DropdownMenuList,
  DropdownMenuItem,
} from "@erbium/ui/components/dropdown-menu";
import { Button } from "@erbium/ui/components/button";
```

```tsx
<DropdownMenu searchable>
  <DropdownMenuTrigger render={<Button variant="outline" />}>Project actions</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuSearch aria-label="Search project actions" />
    <DropdownMenuEmpty>No project actions found.</DropdownMenuEmpty>
    <DropdownMenuList>
      <DropdownMenuItem label="Rename project" onClick={renameProject}>
        Rename project
      </DropdownMenuItem>
      <DropdownMenuItem label="Duplicate project" onClick={duplicateProject}>
        Duplicate project
      </DropdownMenuItem>
    </DropdownMenuList>
  </DropdownMenuContent>
</DropdownMenu>
```

The action callbacks in this example belong to your application. Give the search a specific accessible label. The placeholder is a hint, not its label.

`searchable` enables Base UI's filtering with our defaults: case-, accent-, and punctuation-insensitive matching; automatic highlighting while searching; and query reset when the popup closes. The feature is based on Base UI's preview menu filtering API. We expose one opt-in instead of a separate filter provider or a set of matching and density knobs.

Use the `label` prop on items and submenu triggers when the visible content includes icons, shortcuts, badges, or secondary text. The label defines the searchable action name. Base UI reads rendered text when no label is supplied. Group labels describe sections; empty groups disappear automatically. Keep section separators inside their groups so they disappear with them.

## Geometry and scrolling

Search is a flush header with no inset border, floating field background, or rounded input shell. It uses the shared `search-input-row` recipe and `text-field` typography, followed by a full-width separator. Its clear button appears only when there is a query. Search and Empty are siblings of List, so filtering and scrolling never move the header out of reach.

Action rows use the shared row sizing and control typography. Content clips the surface at its rounded boundary; List owns the scroll area. Set a content width when action names need it; do not override input height, row padding, font size, or separator margins to create another density.

## Interaction

- Type to filter. Arrow keys navigate enabled matching actions; Enter activates the highlighted action.
- Clear search restores the full list. Empty provides a useful result message without becoming an action.
- Escape closes the current menu and follows Base UI's focus restoration behavior.
- Checkbox and radio actions retain their menu semantics; filtering does not change their values.
- Add `searchable` to a Sub and put Search, Empty, and List in its SubContent to give that submenu an independent query. A plain submenu can still live inside a searchable parent.

Keep action handlers on items. Use `onItemHighlighted` for contextual previews when needed, and `onOpenChange` for controlled opening and closing. Do not recreate filtering, focus loops, or pointer handling in application code.

## Updating existing usage

Wrap the items previously placed directly in Content or SubContent in List. Put Search and Empty outside that List, and opt the corresponding root or submenu into `searchable`. Plain menu structure follows the same list contract. Existing item, checkbox, radio, shortcut, and submenu APIs remain available.

## Scrolling surfaces

Use the component's built-in scrolling list or content area. It uses the product's thin scrollbar, scroll-aware edge fade, and keyboard-aware viewport. Search headers stay outside the scrolling list. Do not put a second native overflow container around the list or swap in a thicker scrollbar. The available popup space constrains the list while the header keeps its shared responsive geometry.
