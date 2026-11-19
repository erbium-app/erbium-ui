import * as React from "react";
import { Menu } from "@base-ui/react/menu";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import type { AnyRouter, RegisteredRouter } from "@tanstack/react-router";
import { cn } from "../lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuList,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Icon } from "./icon";
import { linkFromTarget, linkTarget } from "./link";
import type { AnyLinkTargetProps, HrefTargetProps, LinkTargetProps, NoTargetProps } from "./link";

const BreadcrumbNav = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav aria-label="Breadcrumb" data-slot="breadcrumb" className={cn(className)} {...props} />
);

const BreadcrumbList = ({ className, ...props }: React.ComponentProps<"ol">) => (
  <ol
    data-slot="breadcrumb-list"
    className={cn(
      "flex flex-wrap items-center gap-1.5 text-caption wrap-break-word text-muted-foreground",
      className,
    )}
    {...props}
  />
);

const BreadcrumbItem = ({ className, ...props }: React.ComponentProps<"li">) => (
  <li
    data-slot="breadcrumb-item"
    className={cn("inline-flex items-center gap-1", className)}
    {...props}
  />
);

const breadcrumbLinkClassName = "transition-colors hover:text-foreground";

type BreadcrumbLinkProps = (useRender.ComponentProps<"a"> & NoTargetProps) | HrefTargetProps;

/**
 * A parent page. It takes Router's link options: `to` names a route, which preloads ahead of
 * the click; `href` names a fully built or external URL.
 */
function BreadcrumbLink(props: BreadcrumbLinkProps): React.ReactElement;

// Restores Router's generics, so `to` and `params` type against the app's routes.
function BreadcrumbLink<
  TRouter extends AnyRouter = RegisteredRouter,
  const TFrom extends string = string,
  const TTo extends string | undefined = undefined,
  const TMaskFrom extends string = TFrom,
  const TMaskTo extends string = "",
>(props: LinkTargetProps<TRouter, TFrom, TTo, TMaskFrom, TMaskTo>): React.ReactElement;

function BreadcrumbLink({
  className,
  render,
  to,
  href,
  ...props
}: BreadcrumbLinkProps | (AnyLinkTargetProps & { render?: never })) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps(
      {
        className: cn(breadcrumbLinkClassName, className),
      },
      props,
    ),
    render: linkTarget({ href, render, to }),
    state: {
      slot: "breadcrumb-link",
    },
  });
}

const BreadcrumbPage = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span
    data-slot="breadcrumb-page"
    aria-current="page"
    className={cn("font-normal text-foreground", className)}
    {...props}
  />
);

const BreadcrumbSeparator = ({ children, className, ...props }: React.ComponentProps<"li">) => (
  <li
    data-slot="breadcrumb-separator"
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:size-3.5", className)}
    {...props}
  >
    {children ?? <Icon name="chevron-right" className="rtl:rotate-180" />}
  </li>
);

const BreadcrumbEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span
    data-slot="breadcrumb-ellipsis"
    role="presentation"
    aria-hidden="true"
    className={cn("flex size-5 items-center justify-center [&>svg]:size-4", className)}
    {...props}
  >
    <Icon name="more-horizontal" />
  </span>
);

/**
 * A parent page, ordered from the root toward the current page. It takes Router's link options:
 * `to` (with `params` and `search`) names a route, and `href` a fully built or external URL.
 * Build typed options with Router's `linkOptions`.
 */
type BreadcrumbDestination = {
  /** Stable key for destinations that do not have a unique `to` or `href`. */
  id?: string;
  label: string;
} & (Omit<AnyLinkTargetProps, "children"> | Omit<HrefTargetProps, "children">);

const destinationKey = ({ id, to, href, label }: BreadcrumbDestination) =>
  id ?? to ?? href ?? label;

// Splits a destination into its label and the link options its `Link` takes.
const destinationLink = ({ id: _id, label: _label, ...target }: BreadcrumbDestination) =>
  linkFromTarget(target);

const overflowTriggerClassName =
  "inline-flex size-7 shrink-0 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground data-popup-open:bg-accent focus-visible:outline-2 focus-visible:outline-ring";

const OverflowMenu = ({
  items,
  label = "Show hidden parent pages",
}: {
  items: readonly BreadcrumbDestination[];
  label?: string;
}) => (
  <BreadcrumbItem className="shrink-0">
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger aria-label={label} className={overflowTriggerClassName}>
        <BreadcrumbEllipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuList>
          {items.map((item) => (
            <Menu.LinkItem
              key={destinationKey(item)}
              render={destinationLink(item)}
              className="flex row-size items-center rounded-md text-control-sm wrap-anywhere whitespace-normal outline-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"
              closeOnClick
            >
              {item.label}
            </Menu.LinkItem>
          ))}
        </DropdownMenuList>
      </DropdownMenuContent>
    </DropdownMenu>
  </BreadcrumbItem>
);

interface HiddenRange {
  start: number;
  end: number;
}

const findHiddenRange = (
  widths: readonly number[],
  currentWidth: number,
  stepWidth: number,
  overflowWidth: number,
  availableWidth: number,
): HiddenRange => {
  const count = widths.length;
  const fullWidth = widths.reduce((total, width) => total + width + stepWidth, currentWidth);

  if (fullWidth <= availableWidth || count === 0) {
    return { end: 0, start: 0 };
  }

  // Reserve the current title, overflow button and their separator before fitting ancestors.
  let remaining = availableWidth - currentWidth - overflowWidth - stepWidth;
  // Reserve the root before filling any remaining space with nearer ancestors.
  const root = widths[0] ?? 0;
  const start = count > 1 && root + stepWidth <= remaining ? 1 : 0;

  if (start === 1) {
    remaining -= root + stepWidth;
  }

  let end = count;

  while (end > start + 1) {
    const next = (widths[end - 1] ?? 0) + stepWidth;

    if (next > remaining) {
      break;
    }

    remaining -= next;
    end -= 1;
  }

  return { end, start };
};

type BreadcrumbTrailProps = Omit<React.ComponentProps<typeof BreadcrumbNav>, "children"> & {
  /** Ancestors in path order, excluding the current page. */
  items: readonly BreadcrumbDestination[];
  currentPage: string;
  separator?: React.ReactNode;
  /** Accessible name of the overflow menu button. */
  overflowLabel?: string;
};

const BreadcrumbTrail = ({
  items,
  currentPage,
  separator,
  overflowLabel,
  className,
  ...props
}: BreadcrumbTrailProps) => {
  const listRef = React.useRef<HTMLOListElement>(null);
  const measureRef = React.useRef<HTMLOListElement>(null);
  const [hidden, setHidden] = React.useState<HiddenRange>();

  React.useLayoutEffect(() => {
    const list = listRef.current;
    const measure = measureRef.current;

    let observer: ResizeObserver | undefined;

    if (list && measure) {
      const elements = [...measure.children];

      const resize = () => {
        const widths = elements.map((element) => element.getBoundingClientRect().width);
        const [current = 0, separatorWidth = 0, overflow = 0] = widths.slice(items.length);
        const available = list.getBoundingClientRect().width;
        const occupied = widths.reduce((total, width) => total + width, 0);
        const gap = (measure.getBoundingClientRect().width - occupied) / (widths.length - 1);

        const next = findHiddenRange(
          widths.slice(0, items.length),
          current,
          separatorWidth + gap * 2,
          overflow,
          available,
        );

        setHidden((previous) =>
          previous?.start === next.start && previous.end === next.end ? previous : next,
        );
      };

      resize();
      observer = new ResizeObserver(resize);
      observer.observe(list);
      observer.observe(measure);

      for (const element of elements) {
        observer.observe(element);
      }
    }

    return () => {
      observer?.disconnect();
    };
  }, [items]);

  const hiddenItems = hidden ? items.slice(hidden.start, hidden.end) : [];

  return (
    <BreadcrumbNav className={cn("relative w-full min-w-0", className)} {...props}>
      <BreadcrumbList ref={listRef} className={hidden && "flex-nowrap whitespace-nowrap"}>
        {items.map((item, index) => {
          if (hidden && index >= hidden.start && index < hidden.end) {
            return index === hidden.start ? (
              <React.Fragment key="overflow">
                <OverflowMenu items={hiddenItems} label={overflowLabel} />
                <BreadcrumbSeparator className="shrink-0">{separator}</BreadcrumbSeparator>
              </React.Fragment>
            ) : null;
          }

          return (
            <React.Fragment key={destinationKey(item)}>
              <BreadcrumbItem className={hidden && "shrink-0"}>
                <BreadcrumbLink render={destinationLink(item)}>{item.label}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="shrink-0">{separator}</BreadcrumbSeparator>
            </React.Fragment>
          );
        })}
        <BreadcrumbItem className="min-w-0">
          <BreadcrumbPage className={hidden && "truncate"} title={currentPage}>
            {currentPage}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>

      {/* Measure text and chrome without mounting a second set of router links or controls. */}
      <div
        aria-hidden="true"
        inert
        className="pointer-events-none invisible absolute inset-0 overflow-clip"
      >
        <BreadcrumbList ref={measureRef} className="w-max flex-nowrap whitespace-nowrap">
          {items.map((item) => (
            <BreadcrumbItem key={destinationKey(item)}>
              <span className={breadcrumbLinkClassName}>{item.label}</span>
            </BreadcrumbItem>
          ))}
          <BreadcrumbItem>
            <BreadcrumbPage>{currentPage}</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
          <BreadcrumbItem>
            <span className={overflowTriggerClassName} />
          </BreadcrumbItem>
        </BreadcrumbList>
      </div>
    </BreadcrumbNav>
  );
};

type BreadcrumbProps =
  | (BreadcrumbTrailProps & { children?: never })
  | (React.ComponentProps<typeof BreadcrumbNav> & {
      items?: never;
      currentPage?: never;
      separator?: never;
      overflowLabel?: never;
    });

const Breadcrumb = (props: BreadcrumbProps) =>
  props.items === undefined ? <BreadcrumbNav {...props} /> : <BreadcrumbTrail {...props} />;

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};

export type { BreadcrumbDestination, BreadcrumbProps };
