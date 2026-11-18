import * as React from "react";
import type { useRender } from "@base-ui/react/use-render";
import { useMergedRefs } from "@base-ui/utils/useMergedRefs";
import type { AnyRouter, RegisteredRouter } from "@tanstack/react-router";
import { Pagination as PaginationPrimitive } from "@erbium-ui/react/pagination";
import type { PaginationOptions, PaginationTargetProps } from "@erbium-ui/react/pagination";
import { usePredictedIntent } from "../hooks/use-predicted-intent";
import { buttonVariants } from "../lib/button-variants";
import { cn } from "../lib/utils";
import { Icon } from "./icon";
import { hasLinkTarget, linkFromTarget, linkTarget } from "./link";
import type { AnyLinkTargetProps, HrefTargetProps, LinkTargetProps, NoTargetProps } from "./link";

type PaginationSize = "default" | "icon" | "sm" | "icon-sm";

const pageClassName = (isActive: boolean | undefined, size: PaginationSize, className?: string) =>
  cn(
    buttonVariants({ size, variant: isActive === true ? "outline" : "ghost" }),
    "tabular-nums",
    className,
  );

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <PaginationPrimitive.Nav
    data-slot="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);

const PaginationContent = ({ className, ...props }: React.ComponentProps<"ul">) => (
  <PaginationPrimitive.List
    data-slot="pagination-content"
    className={cn("flex items-center gap-0.5", className)}
    {...props}
  />
);

const PaginationItem = ({ ...props }: React.ComponentProps<"li">) => (
  <PaginationPrimitive.Item data-slot="pagination-item" {...props} />
);

interface PaginationLinkOwnProps {
  isActive?: boolean;
  size?: PaginationSize;
}

type PaginationLinkProps = ((useRender.ComponentProps<"a"> & NoTargetProps) | HrefTargetProps) &
  PaginationLinkOwnProps;

/**
 * A page link. It takes Router's link options, such as `to="." search={{ page }}`, so the page
 * preloads before the click; `href` takes a fully built URL.
 */
function PaginationLink(props: PaginationLinkProps): React.ReactElement;

// Restores Router's generics, so `to` and `search` type against the app's routes.
function PaginationLink<
  TRouter extends AnyRouter = RegisteredRouter,
  const TFrom extends string = string,
  const TTo extends string | undefined = undefined,
  const TMaskFrom extends string = TFrom,
  const TMaskTo extends string = "",
>(
  props: LinkTargetProps<TRouter, TFrom, TTo, TMaskFrom, TMaskTo> & PaginationLinkOwnProps,
): React.ReactElement;

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps | (AnyLinkTargetProps & PaginationLinkOwnProps & { render?: never })) {
  const style = pageClassName(isActive, size, className);

  if (hasLinkTarget(props)) {
    return (
      <PaginationPrimitive.Link
        current={isActive}
        data-slot="pagination-link"
        className={style}
        render={linkFromTarget(props)}
      />
    );
  }

  const { children, ...anchorProps } = props;

  return (
    <PaginationPrimitive.Link
      {...anchorProps}
      current={isActive}
      data-slot="pagination-link"
      className={style}
    >
      {/* The link overload also accepts a Router children callback. */}
      {/* oxlint-disable-next-line anti-slop/no-runtime-typeof -- the Router children prop is a node or a render callback. */}
      {typeof children === "function" ? children({ isActive: isActive === true }) : children}
    </PaginationPrimitive.Link>
  );
}

type PaginationButtonProps = Omit<React.ComponentProps<"button">, "type"> & {
  isActive?: boolean;
  size?: PaginationSize;
  /**
   * Called when the user is about to press the button: the cursor is heading for it, it is a
   * tab stop or two away, or a finger touches it. Use it to fetch the page ahead of time.
   */
  onIntent?: () => void;
};

/** Supplies Erbium's preloading integration to a native button. */
const IntentButton = ({
  onIntent,
  ref,
  ...props
}: React.ComponentProps<"button"> & { onIntent?: () => void }) => {
  const intentRef = usePredictedIntent(
    () => {
      onIntent?.();
    },
    { enabled: onIntent !== undefined },
  );

  return <button type="button" {...props} ref={useMergedRefs(ref, intentRef)} />;
};

/** A standalone page button for pages kept in state. */
const PaginationButton = ({
  className,
  isActive,
  size = "icon",
  onIntent,
  ...props
}: PaginationButtonProps) => (
  <PaginationPrimitive.Button
    {...props}
    current={isActive}
    data-slot="pagination-button"
    className={pageClassName(isActive, size, className)}
    render={(buttonProps, { canPrefetch }) => (
      <IntentButton {...buttonProps} onIntent={canPrefetch ? onIntent : undefined} />
    )}
  />
);

interface PaginationStepOwnProps {
  /**
   * Marks the step unavailable, on the first or last page. A plain step loses its `href`; a
   * link drops its destination, and a rendered `PaginationButton` disables natively.
   */
  disabled?: boolean;
  text?: string;
}

type PaginationStepProps = ((useRender.ComponentProps<"a"> & NoTargetProps) | HrefTargetProps) &
  PaginationStepOwnProps;

type PaginationStepImplementationProps =
  | PaginationStepProps
  | (AnyLinkTargetProps & PaginationStepOwnProps & { render?: never });

const StepLabel = ({ direction, text }: { direction: "previous" | "next"; text: string }) => (
  <>
    {direction === "previous" ? (
      <Icon name="chevron-left" data-icon="inline-start" className="rtl:rotate-180" />
    ) : null}
    <span className="hidden sm:block">{text}</span>
    {direction === "next" ? (
      <Icon name="chevron-right" data-icon="inline-end" className="rtl:rotate-180" />
    ) : null}
  </>
);

const stepClassName = (direction: "previous" | "next", className?: string) =>
  pageClassName(false, "default", cn(direction === "previous" ? "ps-1.5!" : "pe-1.5!", className));

const PaginationStep = ({
  className,
  disabled,
  direction,
  render,
  to,
  href,
  text,
  ...props
}: PaginationStepImplementationProps & { direction: "previous" | "next"; text: string }) => (
  <PaginationPrimitive.Step
    {...props}
    direction={direction}
    disabled={disabled}
    data-slot={`pagination-${direction}`}
    className={stepClassName(direction, className)}
    render={disabled === true ? render : linkTarget({ href, render, to })}
  >
    <StepLabel direction={direction} text={text} />
  </PaginationPrimitive.Step>
);

/** The step to the previous page. It takes the same link options as `PaginationLink`. */
function PaginationPrevious(props: PaginationStepProps): React.ReactElement;

function PaginationPrevious<
  TRouter extends AnyRouter = RegisteredRouter,
  const TFrom extends string = string,
  const TTo extends string | undefined = undefined,
  const TMaskFrom extends string = TFrom,
  const TMaskTo extends string = "",
>(
  props: LinkTargetProps<TRouter, TFrom, TTo, TMaskFrom, TMaskTo> & PaginationStepOwnProps,
): React.ReactElement;

function PaginationPrevious({
  className,
  text = "Previous",
  ...props
}: PaginationStepImplementationProps) {
  return <PaginationStep direction="previous" className={className} text={text} {...props} />;
}

/** The step to the next page. It takes the same link options as `PaginationLink`. */
function PaginationNext(props: PaginationStepProps): React.ReactElement;

function PaginationNext<
  TRouter extends AnyRouter = RegisteredRouter,
  const TFrom extends string = string,
  const TTo extends string | undefined = undefined,
  const TMaskFrom extends string = TFrom,
  const TMaskTo extends string = "",
>(
  props: LinkTargetProps<TRouter, TFrom, TTo, TMaskFrom, TMaskTo> & PaginationStepOwnProps,
): React.ReactElement;

function PaginationNext({ className, text = "Next", ...props }: PaginationStepImplementationProps) {
  return <PaginationStep direction="next" className={className} text={text} {...props} />;
}

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <PaginationPrimitive.Ellipsis
    data-slot="pagination-ellipsis"
    className={cn(
      "flex size-control items-center justify-center [&_svg:not([class*='size-'])]:size-4",
      className,
    )}
    {...props}
  >
    <Icon name="more-horizontal" />
  </PaginationPrimitive.Ellipsis>
);

/** Router's link options for one page. */
type PaginationLinkOptions =
  | Omit<AnyLinkTargetProps, "children">
  | Omit<HrefTargetProps, "children">;

type PaginationControlsProps = PaginationOptions &
  Omit<React.ComponentProps<"ul">, "children"> &
  (
    | {
        /**
         * Returns Router's link options for a page, for pages kept in the URL, so each page
         * preloads before the click: `(page) => ({ to: ".", search: { page } })`. Build typed
         * options with Router's `linkOptions`.
         */
        linkOptions: (page: number) => PaginationLinkOptions;
        onPageChange?: never;
        onPageIntent?: never;
      }
    | {
        linkOptions?: never;
        /** Called with the chosen page, for pages kept in state. Renders buttons. */
        onPageChange: (page: number) => void;
        /**
         * Called when the user is about to choose a page, before the click. Use it to fetch
         * the page ahead of time.
         */
        onPageIntent?: (page: number) => void;
      }
  );

/**
 * Previous, page, and next controls on the @erbium-ui/react pagination primitive, which lays out
 * the pages and owns the current page's and the steps' semantics. With `linkOptions` the controls
 * are links, for pages in the URL; with `onPageChange` they are buttons, for pages in state such
 * as a table's.
 */
const PaginationControls = ({
  page,
  pageCount,
  siblingCount,
  boundaryCount,
  linkOptions,
  onPageChange,
  onPageIntent,
  ...props
}: PaginationControlsProps) => {
  const renderTarget = (
    direction?: "previous" | "next",
  ): Exclude<PaginationTargetProps["render"], React.ReactElement | undefined> =>
    function renderPaginationTarget(targetProps, state) {
      const target = state.intentPage;

      const className =
        direction === undefined ? pageClassName(state.current, "icon") : stepClassName(direction);

      const children =
        direction === undefined ? (
          targetProps.children
        ) : (
          <StepLabel direction={direction} text={direction === "previous" ? "Previous" : "Next"} />
        );

      const slot = direction ?? state.mode;
      const styledProps = { ...targetProps, className, "data-slot": `pagination-${slot}` };

      if (state.mode === "button") {
        const onIntent =
          target === undefined || onPageIntent === undefined
            ? undefined
            : () => {
                onPageIntent(target);
              };

        return (
          <IntentButton {...styledProps} onIntent={onIntent}>
            {children}
          </IntentButton>
        );
      }

      if (state.disabled || linkOptions === undefined) {
        return <a {...styledProps}>{children}</a>;
      }

      return linkFromTarget({ ...styledProps, ...linkOptions(state.page), children });
    };

  return (
    <PaginationPrimitive.Root
      page={page}
      pageCount={pageCount}
      siblingCount={siblingCount}
      boundaryCount={boundaryCount}
      onPageChange={onPageChange}
    >
      <PaginationContent {...props}>
        <PaginationItem>
          <PaginationPrimitive.Previous render={renderTarget("previous")} />
        </PaginationItem>
        <PaginationPrimitive.Items>
          {(item) => (
            <PaginationItem>
              {item.type === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationPrimitive.Page page={item.page} render={renderTarget()} />
              )}
            </PaginationItem>
          )}
        </PaginationPrimitive.Items>
        <PaginationItem>
          <PaginationPrimitive.Next render={renderTarget("next")} />
        </PaginationItem>
      </PaginationContent>
    </PaginationPrimitive.Root>
  );
};

export {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationControls,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
