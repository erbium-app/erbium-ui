import {
  PaginationButton,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationItems,
  PaginationLast,
  PaginationLink,
  PaginationList,
  PaginationNav,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationRoot,
  PaginationStep,
} from "./parts";

/**
 * Page controls laid out so the item count stays constant as the page moves: `Root` holds the
 * page, `Items` renders the laid out pages and gaps, and `Page`, `Previous`, `Next`, `First` and
 * `Last` are buttons or links.
 */
const Pagination = {
  Button: PaginationButton,
  Ellipsis: PaginationEllipsis,
  First: PaginationFirst,
  Item: PaginationItem,
  Items: PaginationItems,
  Last: PaginationLast,
  Link: PaginationLink,
  List: PaginationList,
  Nav: PaginationNav,
  Next: PaginationNext,
  Page: PaginationPage,
  Previous: PaginationPrevious,
  Root: PaginationRoot,
  Step: PaginationStep,
};

export { Pagination };

export { usePagination, usePaginationLayout } from "./parts";

export type {
  PaginationButtonProps,
  PaginationChangeDetails,
  PaginationChangeReason,
  PaginationItemsProps,
  PaginationLinkProps,
  PaginationStepProps,
  PaginationPageProps,
  PaginationRootProps,
  PaginationTargetProps,
  PaginationTargetState,
} from "./parts";

export * from "./core";
