# 17 — Data table and data grid

Reviewed 2026-11-18. The data table is `useDataTable` (`packages/ui/src/hooks/use-data-table.ts`), the URL codec (`packages/ui/src/lib/data-table-search.ts`) and the parts in `packages/ui/src/blocks/data-table.tsx`, on TanStack Table v9. The earlier `@erbium/data-table` package in elavie (`packages/ui/data-table`) is the reference for the gaps below; take its behavior, not its API.

## Verify

- [ ] Click through in the docs or Storybook: row click (the Client story) ignores the checkbox and selected text; two tables with different `prefix` values on one route keep separate params; selected rows lose their tint while the skeleton shows and regain it on reveal.
- [ ] Check the header checkbox and the action bar during a refetch with rows selected on another page.

## Server tables

- [ ] Cursor pagination. Many APIs return only `nextCursor`, so the table cannot require `rowCount`. Support an unknown total: Previous and Next without page numbers, a cursor stack kept in the query (and the URL) so Back works, and a reset to the first page when the search, filters or sort change. elavie's `useCursorPager` and `DataPagination` in `apps/admin/web` show the behavior.
- [ ] A loading state for the pagination and toolbar during a refetch, if testing shows the controls need one (they stay readable now).

## Columns

- [ ] Column resizing: `columnResizingFeature`, a handle per header (pointer and arrow keys, double-click resets), and sizes that keep the fixed layout's flush first load.
- [ ] Column pinning with logical sides (`start`, `end`), sticky cells offset with `inset-inline-*` so RTL works, and an edge shadow on the last pinned column.
- [ ] Column ordering from the view menu, with keyboard reordering.
- [ ] Persist column visibility, sizes, order and pinning per table (by its `id`), separately from the shareable query. Decide where: browser storage for a viewer's preferences, or an app callback.
- [ ] A one-line selection column (for example `columnHelper.select()`), replacing the five-line `display` column, without a cycle between the hook and the block.

## Rows

- [ ] Row virtualization with TanStack Virtual for long client tables, keeping the skeleton and the fixed column widths.
- [ ] Infinite rows: load the next page as the reader nears the end, for feeds where pages do not fit.
- [ ] Escape clears the selection while focus is in the table or the action bar.
- [ ] Decide whether rows that open (`onRowClick`) need a visible affordance or focus beyond the link in a cell.

## Analysis

- [ ] Grouping with aggregated cells and expandable groups (`columnGroupingFeature`, `rowAggregationFeature`, `rowExpandingFeature`), as a separate feature set so plain tables stay small.
- [ ] A sort menu for multi-column sorts with priority. Headers sort one column; the URL already holds several.

## Filters

- [ ] `is empty` and `is not empty` operators for every field type, and `starts with` and `ends with` for text, if product screens need them.
- [ ] OR groups and nested filter groups, with a URL form that stays readable.
- [ ] Saved views: a named query plus column preferences, applied with one navigation.

## Data grid

- [ ] An editable grid on the same features: cell selection and ranges, keyboard navigation, TanStack Form cell editing (Enter and Tab commit, Escape discards), copy, cut and paste as TSV, fill, undo and redo through app-owned commands, row and column virtualization, and an add-row affordance. elavie's `DataSheet` (`packages/ui/data-table/src/sheet`) is the behavioral reference. Applications own persistence.

## Notes

- Keep fetching in applications. The table takes `data`, `rowCount` and a query, and never fetches.
- New features join `dataTableFeatures` only when every table can afford them; heavier ones get their own feature set and hook.
- After UI changes run `bun run ui:registry`; after showcase or content changes run `bun run showcase:generate` and `bun run showcase:registry`.
