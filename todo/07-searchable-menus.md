# 07 — Searchable menus

## Goal and working hypothesis

Allow an optional search field at the top of Erbium's choice and action popups. The field should look like `CommandInput`: flush with the popup surface, with a full-width separator above a scrollable item area. Status and priority pickers are the initial reference cases.

Investigate whether all menu-like components can use Base UI Combobox underneath. This is a hypothesis, not an architecture decision. A combobox represents value selection through options, while a menu represents actions, links, checkbox and radio commands, and submenus. The research must establish whether one primitive can preserve those behaviors and accessible semantics before replacing any menu internals.

The Base UI checkout to examine is `/Volumes/AlirezaDev/Codes/Packages/base-ui`. Its Combobox already supports an input inside the popup; the popup switches to dialog semantics in that mode. Its Menu root currently owns menu focus, roving item navigation, typeahead, and submenu behavior. Erbium's `menubar` wraps its `dropdown-menu`, while `dropdown-menu` and `context-menu` use Base UI Menu parts. `select` and `combobox` use separate Base UI primitives; `command` uses `cmdk`.

## Research questions

- Which popups are value pickers, which are action menus, and which combine both? Inventory `select`, `combobox`, `dropdown-menu`, `context-menu`, `menubar`, their submenus, and real app usage.
- Can a Combobox represent action items, links, checkbox items, radio groups, and submenus without misleading `listbox`/`option` semantics or losing their current behavior? What would its public item API need to expose?
- Can Combobox support a context menu's pointer anchor, right-click and keyboard opening, and a menubar's horizontal navigation and hover-driven sibling menus? Which capabilities already exist in Base UI, and which would require changes there?
- If some menu types cannot safely become comboboxes, should Base UI gain searchable Menu parts, a separate searchable action-list primitive, or a popup shell that separates the search input from the element with `role="menu"`?
- Where should the query live: Base UI root, an Erbium wrapper, or the consuming app? Should filtering be built in, controlled, asynchronous, or all three?
- How should filtering handle groups, separators, submenus, disabled items, aliases/keywords, selected values that do not match, and an empty result set?
- What is the exact focus model when search is enabled? Decide initial focus for mouse, keyboard, context-menu, and touch opening; arrow-key movement; Enter activation; Tab; Escape query clearing versus popup dismissal; and focus return to the trigger.
- How do the search input and Base UI's existing menu typeahead interact? Ensure typing, cursor movement, IME composition, and screen-reader input editing are not intercepted by menu navigation.
- Can the current compound APIs remain compatible, or do searchable variants need distinct components? Determine how `className`, refs, `render`, `data-slot`, controlled values, and existing Storybook examples migrate.
- Should `Command` remain a separate `cmdk`-backed command palette, or can shared visual parts be reused without replacing its interaction model?

## Requirements for an accepted design

- Search is opt-in. Existing popups retain their public API, keyboard behavior, roles, focus behavior, and appearance when it is absent.
- Searchable value pickers keep selection state separate from the temporary query. The selected value remains visible on the trigger, and closing the popup has a defined query-reset behavior.
- Searchable action surfaces preserve action, link, checkbox, radio, disabled, and submenu behavior wherever those item types are supported. Item activation and close-on-select remain configurable as they are today.
- The input has an accessible name and an explicit relationship to the results. The popup, result list, items, groups, and selected or checked states use roles appropriate to their actual behavior.
- Keyboard, pointer, touch, screen-reader, RTL, and IME behavior are specified and tested. Filtering cannot leave focus or the highlighted item on an item that disappeared.
- The search header stays outside the scroll viewport. Its separator spans the popup width; only the results scroll, using the shared `ScrollArea` with scroll-aware edge fades.
- Row height, horizontal and vertical spacing, surface, hover/highlight state, icons, shortcuts, labels, and empty state follow the existing combobox and command visual conventions.
- Consumers can provide a controlled query and custom or asynchronous filtering without duplicating primitive focus logic. Large lists remain usable without a large rendering or navigation regression.
- Keep reusable behavior in Base UI where necessary, reusable styling/composition in `packages/ui`, and product-specific search data or commands in apps.

## Investigation and implementation gate

1. Prototype a searchable status or priority picker using the existing Base UI Combobox popup input. Confirm selection, query reset, keyboard navigation, roles, and screen-reader output.
2. Prototype an action dropdown containing a link, checkbox, radio group, and submenu using the proposed shared primitive. Test whether Combobox can represent it correctly rather than assuming it can.
3. Prototype context-menu positioning and menubar sibling navigation with the same approach. Record any missing Base UI capabilities and compare a dedicated searchable Menu design.
4. Choose and document the primitive boundary and migration API before changing the existing wrappers.
5. Implement focused interaction tests and Storybook examples for the accepted design, then regenerate the affected registries and run the repository checks.

No Base UI or Erbium primitive changes are authorized by this research note alone.
