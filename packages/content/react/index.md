---
title: "React"
description: "Unstyled, accessible React primitives for the behavior behind Erbium's cascader, filters, editable and pagination."
---

`@erbium-ui/react` holds the behavior of Erbium's components that do more than style a Base UI part: state, keyboard handling, focus and accessibility. It ships no styles. Erbium's registry components are built on it, and you can build your own design on it the same way.

Use it when you want the behavior without Erbium's design. To use Erbium's components, install them through the registry as described in [Installation](/docs/installation); they install this package for you.

## Installation

```bash
npm install @erbium-ui/react @base-ui/react
```

React 19 and `@base-ui/react` 1.9 or later are peer dependencies.

## Entry points

Each primitive has its own entry point, so you load only what you use.

| Import                             | Contents                                                    | Runs on          |
| ---------------------------------- | ----------------------------------------------------------- | ---------------- |
| `@erbium-ui/react/cascader`        | `Cascader` parts, `useCascader`, tree helpers               | Client           |
| `@erbium-ui/react/cascader/tree`   | Tree indexing, level rows and search                        | Server or client |
| `@erbium-ui/react/filters`         | `Filters` parts, list, table and URL adapters, picker hooks | Client           |
| `@erbium-ui/react/filters/core`    | Rule model, matching, table filter function, URL codec      | Server or client |
| `@erbium-ui/react/editable`        | `Editable` parts                                            | Client           |
| `@erbium-ui/react/pagination`      | `Pagination` parts and `usePagination`                      | Client           |
| `@erbium-ui/react/pagination/core` | `getPagination` page layout                                 | Server or client |

Client entries start with `"use client"`, so the Next.js App Router and other React Server Components frameworks can render the parts from a server component. Server entries import nothing from React; use them in loaders, route validation and API handlers.

## Conventions

The primitives follow Base UI's conventions, so they compose with Base UI parts and with each other.

- **Parts.** Each primitive is a namespace of parts, such as `Cascader.Root` and `Cascader.Trigger`. A part that does not apply in the current state renders nothing.
- **`render`.** Every part that renders an element takes `render`, an element or a function of props and state, to replace its element: `render={<MyButton />}` or `render={(props, state) => <a {...props} />}`.
- **`className`.** A string, or a function of the part's state.
- **Data attributes.** Parts expose their state as `data-*` attributes, such as `data-editing` or `data-current`, for styling without JavaScript.
- **Controlled or uncontrolled.** State props come in `value`, `defaultValue` and `onValueChange` sets. Pass the first to own the state.
- **Change details.** Change callbacks receive `(value, details)`. `details.reason` says what caused the change, `details.event` is the DOM event, and `details.cancel()` rejects the change.

## Primitives

- [Cascader](/docs/react/cascader): a select whose options form a tree, opened one level at a time.
- [Filters](/docs/react/filters): rules over the fields of a list or table, with pickers and editors.
- [Editable](/docs/react/editable): text that becomes an input in place.
- [Pagination](/docs/react/pagination): page controls with a constant number of items.
