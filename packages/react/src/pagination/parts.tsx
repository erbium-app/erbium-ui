import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { createChangeDetails } from "../internal/change-details";
import type { ChangeDetails } from "../internal/change-details";
import { dataFlag, missingContext, visuallyHidden } from "../internal/dom";
import { useControlledState } from "../internal/use-controlled-state";
import { getPagination } from "./core";
import type { PaginationItem, PaginationLayout } from "./core";

type PaginationChangeReason =
  | "page-press"
  | "previous-press"
  | "next-press"
  | "first-press"
  | "last-press";

type PaginationChangeDetails = ChangeDetails<PaginationChangeReason>;

interface PaginationContextValue extends PaginationLayout {
  /** Parts are buttons that call `onPageChange`, or links. */
  mode: "button" | "link";
  getPageHref: ((page: number) => string) | undefined;
  goTo: (page: number, reason: PaginationChangeReason, event: React.MouseEvent) => void;
}

const PaginationContext = React.createContext<PaginationContextValue | null>(null);

const usePaginationContext = (part: string) =>
  React.use(PaginationContext) ?? missingContext(part, "<Pagination.Root>");

/** The pages and gaps of the surrounding `Pagination.Root`, with the clamped page and steps. */
const usePagination = (): PaginationLayout => {
  const {
    getPageHref: _href,
    goTo: _goTo,
    mode: _mode,
    ...layout
  } = usePaginationContext("usePagination");

  return layout;
};

// Root

interface PaginationRootProps {
  /** The current page, starting at 1. */
  page?: number;
  defaultPage?: number;
  /**
   * Called when a part chooses a page. With it and without `getPageHref`, the parts are buttons.
   * `details.cancel()` keeps the current page.
   */
  onPageChange?: (page: number, details: PaginationChangeDetails) => void;
  /** The number of pages. */
  pageCount: number;
  /** Pages shown on each side of the current page. @default 1 */
  siblingCount?: number;
  /** Pages always shown at the start and the end. @default 1 */
  boundaryCount?: number;
  /**
   * The URL of a page. With it, the parts are links with an `href`. Without it and without
   * `onPageChange`, they are links without one, for a router link passed through `render`.
   */
  getPageHref?: (page: number) => string;
  children?: React.ReactNode;
}

/**
 * Holds the page and lays out the pages so their count stays constant as the page moves. Renders
 * no element: wrap the parts in a `<nav>` with a label.
 */
const PaginationRoot = ({
  page: pageProp,
  defaultPage = 1,
  onPageChange,
  pageCount,
  siblingCount,
  boundaryCount,
  getPageHref,
  children,
}: PaginationRootProps) => {
  const [page, setPage] = useControlledState(pageProp, defaultPage);

  const context = React.useMemo<PaginationContextValue>(
    () => ({
      ...getPagination({ boundaryCount, page, pageCount, siblingCount }),
      getPageHref,
      goTo: (next, reason, event) => {
        const details = createChangeDetails(reason, event);

        onPageChange?.(next, details);

        if (!details.isCanceled) {
          setPage(next);
        }
      },
      mode: onPageChange !== undefined && getPageHref === undefined ? "button" : "link",
    }),
    [boundaryCount, getPageHref, onPageChange, page, pageCount, setPage, siblingCount],
  );

  return <PaginationContext value={context}>{children}</PaginationContext>;
};

// List and items

/** A `<ul>` for the items. */
const PaginationList = ({ render, ...props }: useRender.ComponentProps<"ul">): React.ReactElement =>
  useRender({ defaultTagName: "ul", props, render });

interface PaginationItemsProps {
  /** Renders one page or gap, usually in an `<li>` keyed by `item.type` and page. */
  children: (item: PaginationItem) => React.ReactNode;
}

/** Renders the laid out pages and gaps in order. Renders no element. */
const PaginationItems = ({ children }: PaginationItemsProps): React.ReactNode => {
  const { items } = usePaginationContext("Pagination.Items");

  return <>{items.map((item): React.ReactNode => children(item))}</>;
};

// Pages and steps

/** The state of a page or step part. */
interface PaginationTargetState extends Record<string, unknown> {
  /** The page the part goes to, or the current page for a step with nowhere to go. */
  page: number;
  /** The part goes to the current page. */
  current: boolean;
  /** A step with no page in its direction. */
  disabled: boolean;
}

type PaginationTargetProps = useRender.ComponentProps<"a" | "button", PaginationTargetState>;

const useTarget = (
  part: string,
  target: number | undefined,
  reason: PaginationChangeReason,
  { render, ...props }: PaginationTargetProps,
  defaults: { children?: React.ReactNode; "aria-label"?: string },
) => {
  const context = usePaginationContext(part);
  const disabled = target === undefined;
  const page = target ?? context.page;
  const current = !disabled && page === context.page && reason === "page-press";
  const state: PaginationTargetState = { current, disabled, page };

  const own =
    context.mode === "button"
      ? {
          disabled,
          onClick: (event: React.MouseEvent) => {
            if (!disabled && !current) {
              context.goTo(page, reason, event);
            }
          },
          type: "button",
        }
      : {
          // A link with nowhere to go loses its `href`, and with it its role, so it keeps one.
          "aria-disabled": disabled || undefined,
          href: disabled ? undefined : context.getPageHref?.(page),
          role: disabled ? "link" : undefined,
        };

  return useRender({
    defaultTagName: context.mode === "button" ? "button" : "a",
    props: mergeProps(
      {
        ...defaults,
        "aria-current": current ? "page" : undefined,
        "data-current": dataFlag(current),
        "data-disabled": dataFlag(disabled),
      },
      props,
      // Applied last so nothing passed can make a disabled step navigable.
      own,
    ),
    render,
    state,
  });
};

type PaginationPageProps = PaginationTargetProps & {
  /** The page this part goes to. */
  page: number;
};

/** A page: `aria-current="page"` and `data-current` on the current one. Its text is the page. */
const PaginationPage = ({ page, ...props }: PaginationPageProps) =>
  useTarget("Pagination.Page", page, "page-press", props, { children: page });

/** The step to the previous page. Disabled on the first page. */
const PaginationPrevious = (props: PaginationTargetProps) => {
  const { previousPage } = usePaginationContext("Pagination.Previous");

  return useTarget("Pagination.Previous", previousPage, "previous-press", props, {
    "aria-label": "Go to previous page",
  });
};

/** The step to the next page. Disabled on the last page. */
const PaginationNext = (props: PaginationTargetProps) => {
  const { nextPage } = usePaginationContext("Pagination.Next");

  return useTarget("Pagination.Next", nextPage, "next-press", props, {
    "aria-label": "Go to next page",
  });
};

/** The step to the first page. Disabled on the first page. */
const PaginationFirst = (props: PaginationTargetProps) => {
  const { page } = usePaginationContext("Pagination.First");

  return useTarget("Pagination.First", page > 1 ? 1 : undefined, "first-press", props, {
    "aria-label": "Go to first page",
  });
};

/** The step to the last page. Disabled on the last page. */
const PaginationLast = (props: PaginationTargetProps) => {
  const { page, pageCount } = usePaginationContext("Pagination.Last");

  return useTarget(
    "Pagination.Last",
    page < pageCount ? pageCount : undefined,
    "last-press",
    props,
    { "aria-label": "Go to last page" },
  );
};

/** A gap in the pages: a `<span>` hidden from assistive technology, reading "More pages". */
const PaginationEllipsis = ({
  render,
  children,
  ...props
}: useRender.ComponentProps<"span">): React.ReactElement =>
  useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        "aria-hidden": true,
        children: children ?? (
          // oxlint-disable-next-line shadcn/no-inline-styles -- a headless package ships no stylesheet, so screen-reader-only text needs its hiding styles inline; the object is a constant.
          <span style={visuallyHidden}>More pages</span>
        ),
      },
      props,
    ),
    render,
  });

export {
  PaginationEllipsis,
  PaginationFirst,
  PaginationItems,
  PaginationLast,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationRoot,
  usePagination,
};

export type {
  PaginationChangeDetails,
  PaginationChangeReason,
  PaginationItemsProps,
  PaginationPageProps,
  PaginationRootProps,
  PaginationTargetProps,
  PaginationTargetState,
};
