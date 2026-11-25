import * as React from "react";
import type { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { Cascader as CascaderPrimitive } from "@erbium-ui/react/cascader";
import type {
  CascaderNode as PrimitiveNode,
  CascaderRootMultipleProps,
  CascaderRootSingleProps,
  CascaderRow,
  CascaderValueChangeDetails,
} from "@erbium-ui/react/cascader";
import {
  menuChoiceIndicatorClassName,
  menuChoiceItemClassName,
  menuEmptyClassName,
  menuItemClassName,
  menuLabelClassName,
  menuListClassName,
  menuPopupClassName,
  menuPositionerClassName,
} from "../lib/menu-styles";
import { skeletonBlock } from "../lib/skeleton-hints";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Icon } from "./icon";
import { MenuScroll } from "./menu-search";
import { Separator } from "./separator";
import { CheckboxStateIcon, RotatingChevron } from "./stateful-icon";

/*
 * Erbium's cascader: the @erbium-ui/react cascader primitive with the menu design. The primitive
 * owns levels, search, selection, keyboard and focus; this file decides the look and closes the
 * API around one layout (search header, scrolling list, optional clear footer).
 */

// Tree

/** One option of a cascader. A node with `children` opens a level; a node without is a leaf. */
interface CascaderNode extends PrimitiveNode {
  /** Leading icon of the row. */
  icon?: React.ReactNode;
  /** Secondary line under the label. */
  description?: string;
  /** Nodes of the next level. */
  children?: readonly CascaderNode[];
}

type CascaderChangeDetails<TNode extends CascaderNode = CascaderNode> = Pick<
  CascaderValueChangeDetails<TNode>,
  "node" | "path"
>;

type StyledRootProps =
  | "items"
  | "children"
  | "searchable"
  | "filter"
  | "disabled"
  | "name"
  | "open"
  | "defaultOpen"
  | "onOpenChange"
  | "onOpenChangeComplete"
  | "multiple"
  | "value"
  | "defaultValue"
  | "onValueChange";

type CascaderProps<TNode extends CascaderNode = CascaderNode> =
  | Pick<CascaderRootSingleProps<TNode>, StyledRootProps>
  | Pick<CascaderRootMultipleProps<TNode>, StyledRootProps>;

function Cascader<TNode extends CascaderNode & { children?: readonly TNode[] }>(
  props: CascaderProps<TNode>,
): React.JSX.Element;
function Cascader(props: CascaderProps): React.JSX.Element;
function Cascader<TNode extends CascaderNode & { children?: readonly TNode[] }>(
  props: CascaderProps<TNode>,
) {
  return <CascaderPrimitive.Root {...props} />;
}

// Trigger and value

/**
 * Opens the popup. By default it is a select-style button that shows the value. Pass `render`
 * to use another element, such as a toolbar `Button`: that element is then the whole trigger,
 * and the select styles, size and chevron are left out.
 */
const CascaderTrigger = ({
  className,
  size = "default",
  children,
  render,
  ...props
}: MenuPrimitive.Trigger.Props & {
  size?: "sm" | "default";
}) => {
  if (render !== undefined) {
    return (
      <CascaderPrimitive.Trigger
        data-slot="cascader-trigger"
        render={render}
        className={cn("group/disclosure", className)}
        {...props}
      >
        {children}
      </CascaderPrimitive.Trigger>
    );
  }

  return (
    <CascaderPrimitive.Trigger
      data-slot="cascader-trigger"
      {...skeletonBlock}
      data-size={size}
      className={cn(
        "group/disclosure touch-target flex control-size w-fit min-w-0 items-center justify-between gap-control-gap rounded-lg border surface-control text-control-sm whitespace-nowrap transition-[color,background-color,box-shadow] duration-150 outline-none select-none group-data-invalid/field:border-error group-data-invalid/field:ring-[1.5px] group-data-invalid/field:ring-invalid-halo aria-invalid:border-error aria-invalid:ring-[1.5px] aria-invalid:ring-invalid-halo data-placeholder:text-muted-foreground data-[size=sm]:control-size-sm data-[size=sm]:rounded-[min(var(--radius-md),10px)] motion-reduce:transition-none dark:group-data-invalid/field:border-invalid dark:aria-invalid:border-invalid data-disabled:cursor-not-allowed data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-control-icon",
        className,
      )}
      {...props}
    >
      {children}
      <RotatingChevron className="pointer-events-none size-control-icon text-muted-foreground" />
    </CascaderPrimitive.Trigger>
  );
};

interface CascaderValueProps<TNode extends CascaderNode> extends Omit<
  React.ComponentProps<"span">,
  "children"
> {
  /** Shown while nothing is selected. */
  placeholder?: React.ReactNode;
  /** Renders the selection. Receives the path of each selected leaf, root first. */
  children?: (paths: TNode[][]) => React.ReactNode;
}

const CascaderPath = ({ path }: { path: CascaderNode[] }) =>
  path.map((node, position) =>
    position === path.length - 1 ? (
      <span key={node.value}>{node.label}</span>
    ) : (
      <span key={node.value} className="text-muted-foreground">
        {node.label}
        <span aria-hidden="true"> / </span>
      </span>
    ),
  );

/** The selection: the full path of a single leaf, or the labels of several. */
const CascaderValue = <TNode extends CascaderNode = CascaderNode>({
  className,
  placeholder,
  children,
  ...props
}: CascaderValueProps<TNode>) => (
  <CascaderPrimitive.Value<TNode>
    data-slot="cascader-value"
    className={cn("min-w-0 flex-1 truncate text-start", className)}
    {...props}
  >
    {({ multiple, paths, text }): React.ReactNode => {
      if (children !== undefined) {
        return children(paths);
      }

      const [path] = paths;

      return !multiple && path !== undefined ? <CascaderPath path={path} /> : (text ?? placeholder);
    }}
  </CascaderPrimitive.Value>
);

// Popup

/** The popup. Every level opens inside it, in place of the one before. */
const CascaderContent = ({
  align = "start",
  alignOffset,
  side = "bottom",
  sideOffset = 4,
  className,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<MenuPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">) => (
  <CascaderPrimitive.Portal>
    <CascaderPrimitive.Positioner
      className={menuPositionerClassName}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
    >
      <CascaderPrimitive.Popup
        data-slot="cascader-content"
        className={cn(menuPopupClassName, "w-(--anchor-width) min-w-56", className)}
        {...props}
      />
    </CascaderPrimitive.Positioner>
  </CascaderPrimitive.Portal>
);

/**
 * Search field of the open level. It finds options at any depth below the level, and inside a
 * level it leads with a button back to the parent level. `placeholder` and `aria-label` apply to
 * the top level; inside a level, both name the level.
 */
const CascaderSearch = ({
  placeholder = "Search…",
  "aria-label": ariaLabel,
  ...props
}: MenuPrimitive.Input.Props) => (
  <div data-slot="cascader-search" className="shrink-0">
    <CascaderPrimitive.SearchGroup className="group/cascader-search flex search-input-row items-center">
      <Icon
        name="search-01"
        aria-hidden="true"
        className="size-control-icon shrink-0 text-muted-foreground group-data-nested/cascader-search:hidden"
      />
      <CascaderPrimitive.Back
        render={<Button variant="ghost" size="icon-xs" className="-ms-1 shrink-0 rtl:rotate-180" />}
      >
        <Icon name="chevron-left" aria-hidden="true" />
      </CascaderPrimitive.Back>
      <CascaderPrimitive.Search
        data-slot="cascader-search-input"
        aria-label={ariaLabel}
        placeholder={placeholder}
        className="min-h-0 min-w-0 flex-1 bg-transparent py-0 text-field outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
        {...props}
      />
      <CascaderPrimitive.SearchClear
        aria-label="Clear search"
        render={<Button variant="ghost" size="icon-xs" />}
      >
        <Icon name="x" aria-hidden="true" />
      </CascaderPrimitive.SearchClear>
    </CascaderPrimitive.SearchGroup>
    <Separator variant="full" />
  </div>
);

/** Shown when the search of the open level matches nothing. */
const CascaderEmpty = ({
  className,
  children = "No results found.",
  ...props
}: MenuPrimitive.Empty.Props) => (
  <CascaderPrimitive.Empty
    data-slot="cascader-empty"
    className={cn(menuEmptyClassName, className)}
    {...props}
  >
    {children}
  </CascaderPrimitive.Empty>
);

// List

type CascaderRenderRow<TNode extends CascaderNode> = (node: TNode) => React.ReactNode;

interface CascaderListProps<TNode extends CascaderNode> extends Omit<
  MenuPrimitive.List.Props,
  "children"
> {
  /** Renders the content of each row. Defaults to the node's icon, label and description. */
  children?: CascaderRenderRow<TNode>;
}

const secondaryLineClassName = "truncate text-metadata text-muted-foreground";

/** One row: a radio or checkbox item for a leaf, a row that opens the level of one with children. */
const CascaderItem = <TNode extends CascaderNode>({
  row,
  render,
}: {
  row: CascaderRow<TNode>;
  render: CascaderRenderRow<TNode> | undefined;
}) => {
  const { node } = row;

  return (
    <CascaderPrimitive.Item
      row={row}
      data-slot={row.kind === "branch" ? "cascader-branch" : "cascader-item"}
      className={cn(
        row.kind === "branch" ? menuItemClassName : menuChoiceItemClassName,
        "group/cascader-item gap-related",
      )}
    >
      <CascaderPrimitive.ItemIndicator
        className={cn(menuChoiceIndicatorClassName, "group/check-indicator inline-grid")}
      >
        <span className="hidden group-data-multiple/cascader-item:inline-grid">
          <CheckboxStateIcon className="size-control-icon" />
        </span>
        <Icon
          name="check"
          className="group-data-multiple/cascader-item:hidden group-data-unchecked/check-indicator:invisible"
        />
      </CascaderPrimitive.ItemIndicator>
      <span data-slot="cascader-item-content" className="flex min-w-0 flex-1 flex-col">
        <span className="flex min-w-0 items-center gap-related">
          {render === undefined ? (
            <>
              {node.icon}
              <span className="truncate">{node.label}</span>
            </>
          ) : (
            render(node)
          )}
        </span>
        <CascaderPrimitive.ItemTrail
          data-slot="cascader-item-description"
          className={secondaryLineClassName}
          fallback={node.description}
        />
      </span>
      {row.kind === "branch" ? (
        <>
          <CascaderPrimitive.ItemCount
            data-slot="cascader-branch-count"
            className="text-muted-foreground tabular-nums group-data-selected/cascader-item:text-foreground"
          />
          <Icon
            name="chevron-right"
            aria-hidden="true"
            className="text-muted-foreground rtl:rotate-180"
          />
        </>
      ) : null}
    </CascaderPrimitive.Item>
  );
};

/**
 * The options of the open level, under the level's name. A leaf picks a value; a row with
 * children opens its level in place. While searched, it lists every match below the level with
 * the path that leads there.
 */
const CascaderList = <TNode extends CascaderNode = CascaderNode>({
  children,
  className,
  ...props
}: CascaderListProps<TNode>) => (
  <MenuScroll>
    <CascaderPrimitive.List
      data-slot="cascader-list"
      className={cn(menuListClassName, className)}
      {...props}
    >
      <CascaderPrimitive.BackItem
        data-slot="cascader-back"
        className={cn(menuItemClassName, "gap-related text-muted-foreground")}
      >
        <Icon name="chevron-left" aria-hidden="true" className="rtl:rotate-180" />
        Back
      </CascaderPrimitive.BackItem>
      <CascaderPrimitive.Level data-filter-section="">
        <CascaderPrimitive.LevelLabel data-slot="cascader-label" className={menuLabelClassName} />
        <CascaderPrimitive.Rows<TNode>>
          {(row) => <CascaderItem row={row} render={children} />}
        </CascaderPrimitive.Rows>
      </CascaderPrimitive.Level>
    </CascaderPrimitive.List>
  </MenuScroll>
);

/** Footer action that clears the selection. Disabled while nothing is selected. */
const CascaderClear = ({
  className,
  children = "Clear selection",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "onClick">) => (
  <div data-slot="cascader-clear" className="shrink-0">
    <Separator variant="full" />
    <div className="p-1">
      <CascaderPrimitive.Clear
        render={
          <Button
            variant="ghost"
            size="sm"
            className={cn("w-full justify-start gap-related text-muted-foreground", className)}
            {...props}
          />
        }
      >
        <Icon name="x" aria-hidden="true" />
        {children}
      </CascaderPrimitive.Clear>
    </div>
  </div>
);

export {
  Cascader,
  CascaderClear,
  CascaderContent,
  CascaderEmpty,
  CascaderList,
  CascaderSearch,
  CascaderTrigger,
  CascaderValue,
};

export type { CascaderChangeDetails, CascaderNode, CascaderProps };
