---
title: "@erbium-ui/react"
description: "Unstyled React primitives for Cascader, Filters, Editable, Pagination, and Slider."
---

`@erbium-ui/react` provides the state, interactions, and accessibility behind five Erbium components. Install it as an npm dependency to build those interfaces with your own markup and styles. The primitives handle behavior such as keyboard navigation, focus management, and selection.

Install styled Erbium components through the [Erbium registry](/docs/installation) for ready-to-use layouts and styles you can customize in your project. Registry items that use these primitives install `@erbium-ui/react` as a dependency.

## Choose an implementation

| Pattern                     | Build your own design                         | Use Erbium’s design                              |
| --------------------------- | --------------------------------------------- | ------------------------------------------------ |
| Pick from a tree of options | [Unstyled Cascader](/docs/react/cascader)     | [Styled Cascader](/docs/components/cascader)     |
| Filter a list or table      | [Unstyled Filters](/docs/react/filters)       | [Styled Filters](/docs/blocks/filters)           |
| Edit text in place          | [Unstyled Editable](/docs/react/editable)     | [Styled Editable](/docs/components/editable)     |
| Navigate between pages      | [Unstyled Pagination](/docs/react/pagination) | [Styled Pagination](/docs/components/pagination) |
| Pick a value on a track     | [Unstyled Slider](/docs/react/slider)         | [Styled Slider](/docs/components/slider)         |

## Installation

```bash
npm install @erbium-ui/react @base-ui/react
```

React 19 and `@base-ui/react` 1.9 or later are peer dependencies.

## Entry points

Each primitive has its own entry point, so you load only what you use.

| Import                             | Contents                                  | Runs on                                                   |
| ---------------------------------- | ----------------------------------------- | --------------------------------------------------------- |
| `@erbium-ui/react/cascader`        | `Cascader` parts                          | Client                                                    |
| `@erbium-ui/react/filters`         | Filters parts, adapters and utilities     | Utilities on server or client. Parts and hooks on client. |
| `@erbium-ui/react/editable`        | `Editable` parts                          | Client                                                    |
| `@erbium-ui/react/pagination`      | `Pagination` parts and layout hooks       | Client                                                    |
| `@erbium-ui/react/pagination/core` | `getPagination` page layout               | Server or client                                          |
| `@erbium-ui/react/slider`          | `Slider` parts, `useSlider`, and the core | Client                                                    |
| `@erbium-ui/react/slider/core`     | Scales, steps, and marks                  | Server or client                                          |

Compose interactive parts and hooks in a client component when using React Server Components. The Filters utilities, `pagination/core`, and `slider/core` can also run in loaders, route validation, and API handlers.

## Conventions

The primitives follow Base UI's conventions, so they compose with Base UI parts and with each other.

- **Parts.** Compose the pieces you need, such as `Cascader.Root` and `Cascader.Trigger`. Each reference shows the parts and when they render.
- **`render`.** Every part that renders an element takes `render`, an element or a function of props and state, to replace its element: `render={<MyButton />}` or `render={(props, state) => <a {...props} />}`.
- **`className`.** Pass a string, or a state callback on parts that support it.
- **Data attributes.** Parts expose their state as `data-*` attributes, such as `data-editing` or `data-current`, for styling without JavaScript.
- **Controlled or uncontrolled.** State props come in `value`, `defaultValue` and `onValueChange` sets. Use the controlled value and its change callback when your application owns the state.
- **Change details.** State-change callbacks that support change details receive `(value, details)`. `details.reason` says what caused the change, `details.event` is the DOM event, and `details.cancel()` rejects the change.
