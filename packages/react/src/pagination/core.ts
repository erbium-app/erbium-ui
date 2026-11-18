interface PaginationOptions {
  /** The current page, starting at 1. Values outside `1..pageCount` are clamped. */
  page: number;
  /** The number of pages. Zero or less renders a single page. */
  pageCount: number;
  /**
   * Pages shown on each side of the current page.
   * @default 1
   */
  siblingCount?: number;
  /**
   * Pages always shown at the start and the end.
   * @default 1
   */
  boundaryCount?: number;
}

type PaginationItem =
  | { type: "page"; page: number; current: boolean }
  | { type: "ellipsis"; key: "start-ellipsis" | "end-ellipsis" };

interface PaginationLayout {
  /** The clamped current page. */
  page: number;
  /** At least 1. */
  pageCount: number;
  /** Pages and gaps to render, in order. */
  items: PaginationItem[];
  /** The previous page, or `undefined` on the first page. */
  previousPage: number | undefined;
  /** The next page, or `undefined` on the last page. */
  nextPage: number | undefined;
}

const range = (start: number, end: number) =>
  Array.from({ length: Math.max(end - start + 1, 0) }, (_, index) => start + index);

const toPage = (page: number, current: number): PaginationItem => ({
  current: page === current,
  page,
  type: "page",
});

/**
 * Lays out the pages of a paginated view. The item count stays constant as the current
 * page moves, so the control does not shift under the pointer: boundary pages, sibling
 * pages around the current one, and an ellipsis for each gap of two or more pages. A gap of
 * exactly one page shows that page instead of an ellipsis.
 */
const getPagination = ({
  page,
  pageCount,
  siblingCount = 1,
  boundaryCount = 1,
}: PaginationOptions): PaginationLayout => {
  const count = Math.max(1, Math.floor(pageCount));
  const current = Math.min(Math.max(1, Math.floor(page)), count);
  const siblings = Math.max(0, Math.floor(siblingCount));
  const boundaries = Math.max(0, Math.floor(boundaryCount));

  const startPages = range(1, Math.min(boundaries, count));
  const endPages = range(Math.max(count - boundaries + 1, boundaries + 1), count);

  // The sibling window keeps its full width near either end.
  const siblingsStart = Math.max(
    Math.min(current - siblings, count - boundaries - siblings * 2 - 1),
    boundaries + 2,
  );

  const siblingsEnd = Math.min(
    Math.max(current + siblings, boundaries + siblings * 2 + 2),
    count - boundaries - 1,
  );

  // Small page counts can reach a page twice; keep the first of each.
  const seen = new Set<number>();
  const items: PaginationItem[] = [];

  const addPages = (entries: number[]) => {
    for (const entry of entries) {
      if (entry >= 1 && entry <= count && !seen.has(entry)) {
        seen.add(entry);
        items.push(toPage(entry, current));
      }
    }
  };

  addPages(startPages);

  if (siblingsStart > boundaries + 2) {
    items.push({ key: "start-ellipsis", type: "ellipsis" });
  } else if (boundaries + 1 < count - boundaries) {
    addPages([boundaries + 1]);
  }

  addPages(range(siblingsStart, siblingsEnd));

  if (siblingsEnd < count - boundaries - 1) {
    items.push({ key: "end-ellipsis", type: "ellipsis" });
  } else if (count - boundaries > boundaries) {
    addPages([count - boundaries]);
  }

  addPages(endPages);

  return {
    items,
    nextPage: current < count ? current + 1 : undefined,
    page: current,
    pageCount: count,
    previousPage: current > 1 ? current - 1 : undefined,
  };
};

export { getPagination };

export type { PaginationItem, PaginationLayout, PaginationOptions };
