import {
  PaginationEllipsis,
  PaginationFirst,
  PaginationItems,
  PaginationLast,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationRoot,
} from "./parts";

/**
 * Page controls laid out so the item count stays constant as the page moves: `Root` holds the
 * page, `Items` renders the laid out pages and gaps, and `Page`, `Previous`, `Next`, `First` and
 * `Last` are buttons or links.
 */
const Pagination = {
  Ellipsis: PaginationEllipsis,
  First: PaginationFirst,
  Items: PaginationItems,
  Last: PaginationLast,
  List: PaginationList,
  Next: PaginationNext,
  Page: PaginationPage,
  Previous: PaginationPrevious,
  Root: PaginationRoot,
};

export { Pagination };

export { usePagination } from "./parts";

export type {
  PaginationChangeDetails,
  PaginationChangeReason,
  PaginationItemsProps,
  PaginationPageProps,
  PaginationRootProps,
  PaginationTargetProps,
  PaginationTargetState,
} from "./parts";

export * from "./core";
