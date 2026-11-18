import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { useMergedRefs } from "@base-ui/utils/useMergedRefs";
import type { AnyRouter, RegisteredRouter } from "@tanstack/react-router";
import { usePagination } from "../hooks/use-pagination";
import type { PaginationOptions } from "../hooks/use-pagination";
import { usePredictedIntent } from "../hooks/use-predicted-intent";
import { buttonVariants } from "../lib/button-variants";
import { cn } from "../lib/utils";
import { Icon } from "./icon";
import { linkFromTarget, linkTarget } from "./link";
import type { AnyLinkTargetProps, HrefTargetProps, LinkTargetProps, NoTargetProps } from "./link";

type PaginationSize = "default" | "icon" | "sm" | "icon-sm";

const pageClassName = (isActive: boolean | undefined, size: PaginationSize, className?: string) =>
  cn(
    buttonVariants({ size, variant: isActive === true ? "outline" : "ghost" }),
    "tabular-nums",
    className,
  );

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    aria-label="pagination"
    data-slot="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);

const PaginationContent = ({ className, ...props }: React.ComponentProps<"ul">) => (
  <ul
    data-slot="pagination-content"
    className={cn("flex items-center gap-0.5", className)}
    {...props}
  />
);

const PaginationItem = ({ ...props }: React.ComponentProps<"li">) => (
  <li data-slot="pagination-item" {...props} />
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
  render,
  to,
  href,
  ...props
}: PaginationLinkProps | (AnyLinkTargetProps & PaginationLinkOwnProps & { render?: never })) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps(
      {
        "aria-current": isActive === true ? "page" : undefined,
        className: pageClassName(isActive, size, className),
      },
      props,
    ),
    render: linkTarget({ href, render, to }),
    state: { active: isActive === true, slot: "pagination-link" },
  });
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

/**
 * A page button, for pages kept in state rather than in the URL, such as a table's page
 * index.
 */
const PaginationButton = ({
  className,
  isActive,
  size = "icon",
  onIntent,
  disabled,
  ref,
  ...props
}: PaginationButtonProps) => {
  const intentRef = usePredictedIntent(
    () => {
      onIntent?.();
    },
    { enabled: onIntent !== undefined && disabled !== true && isActive !== true },
  );

  return (
    <button
      type="button"
      ref={useMergedRefs(ref, intentRef)}
      aria-current={isActive === true ? "page" : undefined}
      data-slot="pagination-button"
      data-active={isActive === true ? "" : undefined}
      data-disabled={disabled === true ? "" : undefined}
      disabled={disabled}
      className={pageClassName(isActive, size, className)}
      {...props}
    />
  );
};

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

// A plain `a` loses its `href`, and with it its role, so it keeps `role="link"`. A link or a
// rendered element receives `disabled`, which router links and native buttons both honor.
const disabledStepProps = (isPlainAnchor: boolean) =>
  isPlainAnchor
    ? { "aria-disabled": true, "data-disabled": "", href: undefined, role: "link" }
    : { disabled: true };

const PaginationStep = ({
  className,
  disabled = false,
  render,
  to,
  href,
  children,
  ...props
}: PaginationStepImplementationProps & { children: React.ReactNode }) => {
  const element = linkTarget({ href, render, to });

  return useRender({
    defaultTagName: "a",
    props: mergeProps(
      { children, className: pageClassName(false, "default", className) },
      props,
      // Applied last so nothing passed can make a disabled step navigable.
      disabled ? disabledStepProps(element === undefined) : {},
    ),
    render: element,
  });
};

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
  return (
    <PaginationStep
      aria-label="Go to previous page"
      data-slot="pagination-previous"
      className={cn("ps-1.5!", className)}
      {...props}
    >
      <Icon name="chevron-left" data-icon="inline-start" className="rtl:rotate-180" />
      <span className="hidden sm:block">{text}</span>
    </PaginationStep>
  );
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
  return (
    <PaginationStep
      aria-label="Go to next page"
      data-slot="pagination-next"
      className={cn("pe-1.5!", className)}
      {...props}
    >
      <span className="hidden sm:block">{text}</span>
      <Icon name="chevron-right" data-icon="inline-end" className="rtl:rotate-180" />
    </PaginationStep>
  );
}

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    data-slot="pagination-ellipsis"
    className={cn(
      "flex size-control items-center justify-center [&_svg:not([class*='size-'])]:size-4",
      className,
    )}
    {...props}
  >
    <Icon name="more-horizontal" />
    <span className="sr-only">More pages</span>
  </span>
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
 * Previous, page, and next controls laid out by `usePagination`. With `linkOptions` the controls
 * are links, for pages in the URL; with `onPageChange` they are buttons, for pages in state
 * such as a table's.
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
  const pagination = usePagination({ boundaryCount, page, pageCount, siblingCount });

  // Buttons for state-driven pages; links otherwise.
  const step = (target: number | undefined) => {
    if (onPageChange === undefined) {
      return target === undefined
        ? { disabled: true }
        : { render: linkFromTarget(linkOptions(target)) };
    }

    return {
      disabled: target === undefined,
      render: (
        <PaginationButton
          size="default"
          onClick={() => {
            if (target !== undefined) {
              onPageChange(target);
            }
          }}
          onIntent={
            target === undefined || onPageIntent === undefined
              ? undefined
              : () => {
                  onPageIntent(target);
                }
          }
        />
      ),
    };
  };

  return (
    <PaginationContent {...props}>
      <PaginationItem>
        <PaginationPrevious {...step(pagination.previousPage)} />
      </PaginationItem>
      {pagination.items.map((item) =>
        item.type === "ellipsis" ? (
          <PaginationItem key={item.key}>
            <PaginationEllipsis />
          </PaginationItem>
        ) : (
          <PaginationItem key={item.page}>
            {onPageChange === undefined ? (
              <PaginationLink
                isActive={item.current}
                render={linkFromTarget(linkOptions(item.page))}
              >
                {item.page}
              </PaginationLink>
            ) : (
              <PaginationButton
                isActive={item.current}
                onClick={() => {
                  onPageChange(item.page);
                }}
                onIntent={
                  onPageIntent === undefined
                    ? undefined
                    : () => {
                        onPageIntent(item.page);
                      }
                }
              >
                {item.page}
              </PaginationButton>
            )}
          </PaginationItem>
        ),
      )}
      <PaginationItem>
        <PaginationNext {...step(pagination.nextPage)} />
      </PaginationItem>
    </PaginationContent>
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
