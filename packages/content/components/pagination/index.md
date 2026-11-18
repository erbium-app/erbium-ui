---
title: "Pagination"
description: "Navigate between pages of content, with each page loaded before the click."
---

## Usage

**Import:** `@erbium/ui/components/pagination`

`PaginationControls` renders previous, page, and next controls for a page and a page count. It works in one of two modes, chosen by where the page lives:

- **In the URL:** pass `linkOptions`, which returns Router's link options for a page. Every control is a link, so pages can be opened in a new tab, shared, and restored with the back button.
- **In state:** pass `onPageChange`, and optionally `onPageIntent`. Every control is a button. Use this for tables and panels whose page is not part of the address.

Both modes start loading a page before it is clicked. Links preload the route when the user is about to follow it. Buttons call `onPageIntent` at the same moment, so the page can be fetched ahead of time.

```tsx
import { Pagination, PaginationControls } from "@erbium/ui/components/pagination";

<Pagination>
  <PaginationControls
    page={page}
    pageCount={pageCount}
    linkOptions={(page) => ({ to: ".", search: (previous) => ({ ...previous, page }) })}
  />
</Pagination>;
```

```tsx
<Pagination>
  <PaginationControls
    page={page}
    pageCount={pageCount}
    onPageChange={setPage}
    onPageIntent={(page) => void queryClient.prefetchQuery(invoicesQuery(page))}
  />
</Pagination>
```

Pages start at 1. `siblingCount` sets how many pages show on each side of the current one, and `boundaryCount` sets how many show at each end; both default to 1. The number of controls stays the same as the page changes, so the control under the pointer does not move.

## Pages in the URL

Keep the page in a search param and load it in the route loader. The page goes into `loaderDeps`, so each page is cached and preloaded on its own.

### With TanStack Query

```tsx
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

const invoicesQuery = (page: number) =>
  queryOptions({
    queryFn: () => api.invoices({ page }),
    queryKey: ["invoices", { page }],
  });

export const Route = createFileRoute("/invoices")({
  component: Invoices,
  loader: ({ context: { queryClient }, deps: { page } }) => queryClient.query(invoicesQuery(page)),
  loaderDeps: ({ search }) => ({ page: search.page }),
  validateSearch: (search: Record<string, unknown>) => ({
    page: Math.max(1, Math.trunc(Number(search.page)) || 1),
  }),
});

function Invoices() {
  const { page } = Route.useSearch();
  const { data } = useSuspenseQuery(invoicesQuery(page));

  return (
    <Pagination>
      <PaginationControls
        page={page}
        pageCount={data.pageCount}
        linkOptions={(page) => ({ to: ".", search: (previous) => ({ ...previous, page }) })}
      />
    </Pagination>
  );
}
```

Create the router with `defaultPreloadStaleTime: 0` so the router hands freshness to Query on every preload instead of caching loader results for 30 seconds itself. To have the next page ready before any intent, start it from the loader without awaiting it: `void queryClient.prefetchQuery(invoicesQuery(page + 1))`.

### With Effect Atom

Create one registry per router, pass it through the router context, and provide it to React with `Wrap`:

```tsx
import { RegistryContext } from "@effect/atom-react";
import { AtomRegistry } from "effect/reactivity";

const registry = AtomRegistry.make();

const router = createRouter({
  context: { registry },
  defaultPreloadStaleTime: 0,
  routeTree,
  Wrap: ({ children }) => <RegistryContext value={registry}>{children}</RegistryContext>,
});
```

Give each page its own atom with `Atom.family`. `Atom.setIdleTTL` keeps a page that nothing reads yet, such as a preloaded one, until the user arrives. The loader waits for the atom's result, and the component reads the same atom:

```tsx
import { useAtomSuspense } from "@effect/atom-react";
import { Effect } from "effect";
import { Atom, AtomRegistry } from "effect/reactivity";

const invoicesAtom = Atom.family((page: number) =>
  Atom.make(api.invoices({ page })).pipe(Atom.setIdleTTL("5 minutes")),
);

export const Route = createFileRoute("/invoices")({
  component: Invoices,
  loader: ({ context: { registry }, deps: { page } }) =>
    Effect.runPromise(AtomRegistry.getResult(registry, invoicesAtom(page))),
  loaderDeps: ({ search }) => ({ page: search.page }),
  validateSearch,
});

function Invoices() {
  const { page } = Route.useSearch();
  const { value } = useAtomSuspense(invoicesAtom(page));
  // …
}
```

## Pages in a table

A table that pages on the server keeps its page in table state. Pass `manualPagination` and the row count to TanStack Table, then drive the table from the controls. `table.getPageCount()` gives the page count, and `table.setPageIndex` takes a zero-based index:

```tsx
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { rowPaginationFeature, tableFeatures, useTable } from "@tanstack/react-table";

const features = tableFeatures({ rowPaginationFeature });

function InvoicesTable() {
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });
  const page = pagination.pageIndex + 1;
  const { data } = useQuery({ ...invoicesQuery(page), placeholderData: keepPreviousData });

  const table = useTable({
    columns,
    data: data?.rows ?? [],
    features,
    manualPagination: true,
    onPaginationChange: setPagination,
    rowCount: data?.rowCount,
    state: { pagination },
  });

  return (
    <>
      {/* The table */}
      <Pagination>
        <PaginationControls
          page={page}
          pageCount={table.getPageCount()}
          onPageChange={(page) => table.setPageIndex(page - 1)}
          onPageIntent={(page) => void queryClient.prefetchQuery(invoicesQuery(page))}
        />
      </Pagination>
    </>
  );
}
```

With Effect Atom, prefetch by reading the page's atom from the registry: `registry.get(invoicesAtom(page))` starts the request, and the idle TTL keeps the result until the click mounts it.

A table whose rows are already on the client, using `createPaginatedRowModel`, has nothing to fetch; leave out `onPageIntent`. A table whose page should survive a reload or be shareable belongs in the URL: use `linkOptions` and read the page from the search param as above.

## Building your own layout

`usePagination` returns the layout that `PaginationControls` renders: `items`, a list of pages and ellipses, along with `previousPage` and `nextPage`, which are `undefined` at either end. `getPagination` is the same function without React. Use them with the parts below when the controls need a different arrangement.

```tsx
import { usePagination } from "@erbium/ui/hooks/use-pagination";

const { items, previousPage, nextPage } = usePagination({ page, pageCount });
```

- `PaginationLink` renders a page link. It takes Router's link options (`to`, `search`) or an `href`, and `isActive` for the current page.
- `PaginationButton` renders a page button. `onIntent` is called before the press.
- `PaginationPrevious` and `PaginationNext` take link options like `PaginationLink`, or a `PaginationButton` through `render`. `disabled` marks a step with no page: the link or button is disabled.

## Composition

```text
Pagination
└── PaginationContent
    ├── PaginationItem
    │   └── PaginationPrevious
    ├── PaginationItem
    │   └── PaginationLink | PaginationButton
    ├── PaginationItem
    │   └── PaginationEllipsis
    └── PaginationItem
        └── PaginationNext
```

`PaginationControls` renders everything inside `Pagination`.

## Accessibility

- `Pagination` is a `nav` landmark labelled "pagination". Pass `aria-label` to name it after its content when a page has more than one.
- The current page has `aria-current="page"`, whether it is a link or a button.
- Previous and next are labelled "Go to previous page" and "Go to next page"; their text hides on small screens and the labels remain.
- A disabled step stays in the accessibility tree as a disabled link or button, so screen reader users still find it at the start or end.
- Announce page changes that load in place, such as a table's, in a polite live region.
