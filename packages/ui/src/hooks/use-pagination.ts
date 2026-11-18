import { useMemo } from "react";
import { getPagination } from "@erbium-ui/react/pagination/core";
import type { PaginationLayout, PaginationOptions } from "@erbium-ui/react/pagination/core";

/*
 * The page layout from the @erbium-ui/react pagination core: boundary pages, sibling pages around
 * the current one and an ellipsis for each gap, with a constant item count as the page moves.
 */

/** The laid out pages of a paginated view. */
type Pagination = PaginationLayout;

/** Lays out the pages of a paginated view; see `getPagination`. */
const usePagination = ({ page, pageCount, siblingCount, boundaryCount }: PaginationOptions) =>
  useMemo(
    () => getPagination({ boundaryCount, page, pageCount, siblingCount }),
    [boundaryCount, page, pageCount, siblingCount],
  );

export { getPagination, usePagination };

export type { PaginationItem, PaginationOptions } from "@erbium-ui/react/pagination/core";

export type { Pagination };
