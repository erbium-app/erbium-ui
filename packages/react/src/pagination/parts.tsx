import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { createChangeDetails } from "../internal/change-details";
import type { ChangeDetails } from "../internal/change-details";
import { dataFlag, missingContext, visuallyHidden } from "../internal/dom";
import { resolveStateProp } from "../internal/resolve";
import type { StateProp } from "../internal/resolve";
import { useControlledState } from "../internal/use-controlled-state";
import { getPagination } from "./core";
import type { PaginationItem as LayoutItem, PaginationLayout, PaginationOptions } from "./core";

type PaginationChangeReason =
  | "page-press"
  | "previous-press"
  | "next-press"
  | "first-press"
  | "last-press";

type PaginationChangeDetails = ChangeDetails<PaginationChangeReason>;

type PaginationMode = "button" | "link";

interface PaginationContextValue extends PaginationLayout {
  mode: PaginationMode;
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

/** Lays out controlled pages without requiring a pagination root. */
const usePaginationLayout = ({ boundaryCount, page, pageCount, siblingCount }: PaginationOptions) =>
  React.useMemo(
    () => getPagination({ boundaryCount, page, pageCount, siblingCount }),
    [boundaryCount, page, pageCount, siblingCount],
  );

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
  /** Explicitly choose button or link parts, including for uncontrolled button pagination. */
  mode?: PaginationMode;
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
  mode: modeProp,
  children,
}: PaginationRootProps) => {
  const [page, setPage] = useControlledState(pageProp, defaultPage);

  const mode =
    modeProp ?? (onPageChange !== undefined && getPageHref === undefined ? "button" : "link");

  const layout = usePaginationLayout({ boundaryCount, page, pageCount, siblingCount });

  const context = React.useMemo<PaginationContextValue>(
    () => ({
      ...layout,
      getPageHref,
      goTo: (next, reason, event) => {
        const details = createChangeDetails(reason, event);

        onPageChange?.(next, details);

        if (!details.isCanceled) {
          setPage(next);
        }
      },
      mode,
    }),
    [getPageHref, layout, mode, onPageChange, setPage],
  );

  return <PaginationContext value={context}>{children}</PaginationContext>;
};

// List and items

/** The navigation landmark for the controls. */
const PaginationNav = ({ render, ...props }: useRender.ComponentProps<"nav">) =>
  useRender({
    defaultTagName: "nav",
    props: mergeProps<"nav">({ "aria-label": "pagination" }, props),
    render,
  });

/** A list item for one page, step or gap. */
const PaginationItem = ({ render, ...props }: useRender.ComponentProps<"li">) =>
  useRender({ defaultTagName: "li", props, render });

/** A `<ul>` for the items. */
const PaginationList = ({ render, ...props }: useRender.ComponentProps<"ul">): React.ReactElement =>
  useRender({ defaultTagName: "ul", props, render });

interface PaginationItemsProps {
  /** Renders one page or gap. Items supplies stable keys. */
  children: (item: LayoutItem) => React.ReactNode;
}

/** Renders the laid out pages and gaps in order. Renders no element. */
const PaginationItems = ({ children }: PaginationItemsProps): React.ReactNode => {
  const { items } = usePaginationContext("Pagination.Items");

  return items.map((item) => (
    <React.Fragment key={item.type === "page" ? item.page : item.key}>
      {children(item)}
    </React.Fragment>
  ));
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
  mode: PaginationMode;
  /** A destination that can be prefetched, excluding disabled and current controls. */
  intentPage: number | undefined;
}

interface PaginationControlState extends Record<string, unknown> {
  current: boolean;
  disabled: boolean;
  canPrefetch: boolean;
}

const controlAttributes = ({
  current,
  disabled,
}: Pick<PaginationControlState, "current" | "disabled">) => ({
  "aria-current": current ? ("page" as const) : undefined,
  "data-active": dataFlag(current),
  "data-current": dataFlag(current),
  "data-disabled": dataFlag(disabled),
});

const disabledLinkProps = (rendered: boolean) => ({
  "aria-disabled": true,
  href: undefined,
  ...(rendered ? { disabled: true } : { role: "link" }),
  onClick: (event: React.MouseEvent) => {
    event.preventDefault();
  },
});

interface PaginationLinkProps extends useRender.ComponentProps<"a", PaginationControlState> {
  current?: boolean;
  disabled?: boolean;
}

/** A standalone page link for caller-supplied layouts. */
const PaginationLink = ({
  current = false,
  disabled = false,
  render,
  ...props
}: PaginationLinkProps) =>
  useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      controlAttributes({ current, disabled }),
      props,
      disabled ? disabledLinkProps(render !== undefined) : {},
    ),
    render,
    state: { canPrefetch: !current && !disabled, current, disabled },
    stateAttributesMapping: { canPrefetch: () => null },
  });

interface PaginationButtonProps extends Omit<
  useRender.ComponentProps<"button", PaginationControlState>,
  "type"
> {
  current?: boolean;
}

/** A standalone page button for caller-supplied layouts. */
const PaginationButton = ({
  current = false,
  disabled = false,
  render,
  ...props
}: PaginationButtonProps) =>
  useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(controlAttributes({ current, disabled }), props, {
      disabled,
      type: "button",
    }),
    render,
    state: { canPrefetch: !current && !disabled, current, disabled },
    stateAttributesMapping: { canPrefetch: () => null },
  });

const stepLabels = {
  first: "Go to first page",
  last: "Go to last page",
  next: "Go to next page",
  previous: "Go to previous page",
};

interface PaginationStepProps extends PaginationLinkProps {
  direction: keyof typeof stepLabels;
}

/** A standalone directional link with a default accessible name. */
const PaginationStep = ({ direction, ...props }: PaginationStepProps) => (
  <PaginationLink aria-label={stepLabels[direction]} {...props} />
);

interface PaginationTargetProps extends Omit<
  useRender.ComponentProps<"a" | "button", PaginationTargetState>,
  "className"
> {
  className?: StateProp<string | undefined, PaginationTargetState>;
}

const useTarget = (
  part: string,
  target: number | undefined,
  reason: PaginationChangeReason,
  { className, render, ...props }: PaginationTargetProps,
  defaults: { children?: React.ReactNode; "aria-label"?: string },
) => {
  const context = usePaginationContext(part);
  const disabled = target === undefined;
  const page = target ?? context.page;
  const current = !disabled && page === context.page && reason === "page-press";
  const { mode } = context;

  const state: PaginationTargetState = {
    current,
    disabled,
    intentPage: disabled || page === context.page ? undefined : page,
    mode,
    page,
  };

  const linkProps = disabled ? disabledLinkProps(false) : { href: context.getPageHref?.(page) };

  const onClick =
    mode === "button"
      ? (event: React.MouseEvent) => {
          if (!disabled && !current && !event.defaultPrevented) {
            context.goTo(page, reason, event);
          }
        }
      : undefined;

  const own = mode === "button" ? { disabled, type: "button" } : linkProps;

  return useRender({
    defaultTagName: context.mode === "button" ? "button" : "a",
    props: mergeProps(
      {
        ...defaults,
        ...controlAttributes(state),
        className: resolveStateProp(className, state),
        onClick,
      },
      props,
      // Applied last so nothing passed can make a disabled step navigable.
      own,
    ),
    render,
    state,
    stateAttributesMapping: { intentPage: () => null, mode: () => null, page: () => null },
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
    "aria-label": stepLabels.previous,
  });
};

/** The step to the next page. Disabled on the last page. */
const PaginationNext = (props: PaginationTargetProps) => {
  const { nextPage } = usePaginationContext("Pagination.Next");

  return useTarget("Pagination.Next", nextPage, "next-press", props, {
    "aria-label": stepLabels.next,
  });
};

/** The step to the first page. Disabled on the first page. */
const PaginationFirst = (props: PaginationTargetProps) => {
  const { page } = usePaginationContext("Pagination.First");

  return useTarget("Pagination.First", page > 1 ? 1 : undefined, "first-press", props, {
    "aria-label": stepLabels.first,
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

/** A decorative gap in the list of page links. */
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
          // oxlint-disable-next-line shadcn/no-inline-styles -- the headless package ships no stylesheet.
          <span style={visuallyHidden}>More pages</span>
        ),
      },
      props,
    ),
    render,
  });

export {
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
  usePagination,
  usePaginationLayout,
};

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
};
