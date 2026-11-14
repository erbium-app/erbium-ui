import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { useMergedRefs } from "@base-ui/utils/useMergedRefs";
import { usePagination } from "../hooks/use-pagination";
import type { PaginationOptions } from "../hooks/use-pagination";
import { usePredictedIntent } from "../hooks/use-predicted-intent";
import { buttonVariants } from "../lib/button-variants";
import { cn } from "../lib/utils";
import { Icon } from "./icon";

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

type PaginationLinkProps = useRender.ComponentProps<"a"> & {
  isActive?: boolean;
  size?: PaginationSize;
};

/**
 * A page link. It renders an `a` by default; pass a router link to `render`, such as
 * `<Link to="." search={{ page }} />` from `@erbium/ui/components/link`, so the page
 * preloads before the click.
 */
const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  render,
  ...props
}: PaginationLinkProps) =>
  useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        "aria-current": isActive === true ? "page" : undefined,
        className: pageClassName(isActive, size, className),
      },
      props,
    ),
    render,
    state: { active: isActive === true, slot: "pagination-link" },
  });

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

type PaginationStepProps = useRender.ComponentProps<"a"> & {
  /**
   * Marks the step unavailable, on the first or last page. Without `render`, the link loses
   * its `href`. With `render`, `disabled` passes to the rendered element: a router `Link`
   * drops its `href`, and a `PaginationButton` disables natively.
   */
  disabled?: boolean;
  text?: string;
};

// A default `a` loses its `href`, and with it its role, so it keeps `role="link"`. A rendered
// element receives `disabled`, which router links and native buttons both honor.
const disabledStepProps = (isDefaultLink: boolean) =>
  isDefaultLink
    ? { "aria-disabled": true, "data-disabled": "", href: undefined, role: "link" }
    : { disabled: true };

const PaginationStep = ({
  className,
  disabled = false,
  render,
  children,
  ...props
}: PaginationStepProps & { children: React.ReactNode }) => {
  const element = useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      { children, className: pageClassName(false, "default", className) },
      props,
      // Applied last so a passed `href` cannot make a disabled step navigable.
      disabled ? disabledStepProps(render === undefined) : {},
    ),
    render,
  });

  return element;
};

const PaginationPrevious = ({ className, text = "Previous", ...props }: PaginationStepProps) => (
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

const PaginationNext = ({ className, text = "Next", ...props }: PaginationStepProps) => (
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

type PaginationControlsProps = PaginationOptions &
  Omit<React.ComponentProps<"ul">, "children"> &
  (
    | {
        /**
         * Returns the link for a page, for pages kept in the URL. Use a router link so the
         * page preloads before the click: `(page) => <Link to="." search={{ page }} />`.
         */
        renderLink: (page: number) => React.ReactElement;
        onPageChange?: never;
        onPageIntent?: never;
      }
    | {
        renderLink?: never;
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
 * Previous, page, and next controls laid out by `usePagination`. With `renderLink` the controls
 * are links, for pages in the URL; with `onPageChange` they are buttons, for pages in state
 * such as a table's.
 */
const PaginationControls = ({
  page,
  pageCount,
  siblingCount,
  boundaryCount,
  renderLink,
  onPageChange,
  onPageIntent,
  ...props
}: PaginationControlsProps) => {
  const pagination = usePagination({ boundaryCount, page, pageCount, siblingCount });

  // Buttons for state-driven pages; links otherwise.
  const step = (target: number | undefined) => {
    if (onPageChange === undefined) {
      return target === undefined ? { disabled: true } : { render: renderLink(target) };
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
              <PaginationLink isActive={item.current} render={renderLink(item.page)}>
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
