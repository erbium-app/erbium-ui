---
title: "Pagination"
description: "Headless page controls laid out so the number of items stays the same as the page moves."
---

Previous, page and next controls for a page and a page count. The layout keeps boundary pages, pages around the current one and a gap marker for each run of hidden pages, and its number of items stays the same as the page moves, so the controls do not shift under the pointer. The parts are buttons for a page kept in state, or links for a page kept in the URL.

The styled version is the [Pagination component](/docs/components/pagination).

**Import:** `@erbium-ui/react/pagination`

## Anatomy

```tsx
import { Pagination } from "@erbium-ui/react/pagination";

<Pagination.Nav aria-label="Pagination">
  <Pagination.Root page={page} pageCount={pageCount} onPageChange={setPage}>
    <Pagination.List>
      <Pagination.Item>
        <Pagination.First />
      </Pagination.Item>
      <Pagination.Item>
        <Pagination.Previous />
      </Pagination.Item>
      <Pagination.Items>
        {(item) =>
          item.type === "page" ? (
            <Pagination.Item>
              <Pagination.Page page={item.page} />
            </Pagination.Item>
          ) : (
            <Pagination.Item>
              <Pagination.Ellipsis />
            </Pagination.Item>
          )
        }
      </Pagination.Items>
      <Pagination.Item>
        <Pagination.Next />
      </Pagination.Item>
      <Pagination.Item>
        <Pagination.Last />
      </Pagination.Item>
    </Pagination.List>
  </Pagination.Root>
</Pagination.Nav>;
```

`Root` renders no element, so you can place its controls inside `Pagination.Nav` and supply a label for the landmark.

## Buttons or links

With `onPageChange` or `mode="button"`, the parts are `<button>`s that change the page. Its details give a reason of `"page-press"`, `"previous-press"`, `"next-press"`, `"first-press"` or `"last-press"`, and `details.cancel()` keeps the current page.

With `getPageHref`, they are links:

```tsx
<Pagination.Root page={page} pageCount={pageCount} getPageHref={(page) => `?page=${page}`} />
```

For a router link, leave out both and render the link from the part's state, which holds the page it goes to:

```tsx
<Pagination.Next
  render={(props, { disabled, page }) =>
    disabled ? (
      <a {...props}>Next</a>
    ) : (
      <Link {...props} to="." search={{ page }}>
        Next
      </Link>
    )
  }
/>
```

A step with no page in its direction is disabled: a button gets `disabled`, and a link loses its `href` and gets `aria-disabled` and `role="link"`.

## Layout

`getPagination({ page, pageCount, siblingCount, boundaryCount })` returns the layout without React, from `@erbium-ui/react/pagination/core`: `items`, the clamped `page` and `pageCount`, and `previousPage` and `nextPage`, which are `undefined` at either end. A gap of exactly one page shows that page instead of an ellipsis. Inside a root, `usePagination()` reads its layout. Use `usePaginationLayout(options)` to compute it in React without a root.

## API reference

### Root

Holds the page and lays out the pages. Renders no element.

| Prop                                    | Type                 | Default  |
| --------------------------------------- | -------------------- | -------- |
| `page` / `defaultPage` / `onPageChange` | `number`, from 1     | `1`      |
| `pageCount`                             | `number`             | —        |
| `siblingCount`                          | `number`             | `1`      |
| `boundaryCount`                         | `number`             | `1`      |
| `getPageHref`                           | `(page) => string`   | —        |
| `mode`                                  | `"button" \| "link"` | Inferred |

### Parts

`Nav`, `List`, and `Item` render the navigation landmark, list, and list item. For layouts that supply their own destinations, `Link`, `Button`, and `Step` also work outside a root. `Link` and `Button` accept `current` and `disabled`. `Step` adds a default accessible label from its `direction`.

| Part       | Element             | Notes                                                                      |
| ---------- | ------------------- | -------------------------------------------------------------------------- |
| `List`     | `<ul>`              |                                                                            |
| `Items`    | none                | `children(item)` for each page and gap.                                    |
| `Page`     | `<button>` or `<a>` | `page` prop. `aria-current="page"` and `data-current` on the current page. |
| `Previous` | `<button>` or `<a>` | Named "Go to previous page".                                               |
| `Next`     | `<button>` or `<a>` | Named "Go to next page".                                                   |
| `First`    | `<button>` or `<a>` | Named "Go to first page".                                                  |
| `Last`     | `<button>` or `<a>` | Named "Go to last page".                                                   |
| `Ellipsis` | `<span>`            | Hidden from assistive technology, with "More pages" as its default text.   |

Page and step parts carry `data-current` and `data-disabled`, and pass `{ page, current, disabled, mode, intentPage }` to `render` and `className`. `intentPage` is undefined for disabled controls and the current page, so an app can wire its own prefetch strategy.
