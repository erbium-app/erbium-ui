import * as React from "react";
import type { Menu as MenuPrimitive } from "@base-ui/react/menu";
import {
  Cascader as CascaderPrimitive,
  createCascaderIndex,
  useCascader,
} from "@erbium-ui/react/cascader";
import type {
  CascaderIndex,
  CascaderMatch,
  CascaderNode as CascaderPrimitiveNode,
  CascaderRow,
  CascaderValueChangeDetails,
} from "@erbium-ui/react/cascader";
import { focusSearchInput } from "../lib/focus-search-input";
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
interface CascaderNode {
  /** Stable unique id, and the committed value of a leaf. */
  value: string;
  /** Display text, used for search and typeahead. */
  label: string;
  /** Leading icon of the row. */
  icon?: React.ReactNode;
  /** Secondary line under the label. */
  description?: string;
  /** Nodes of the next level. */
  children?: CascaderNode[];
  /** Keeps the node visible but unselectable; a disabled level cannot be opened. */
  disabled?: boolean;
  /** Extra terms the search matches alongside the label. */
  keywords?: string[];
}

/** The primitive's node, carrying the Erbium node it was made from as `data`. */
type PrimitiveNode = CascaderPrimitiveNode<CascaderNode>;

const toPrimitiveNodes = (nodes: readonly CascaderNode[]): PrimitiveNode[] =>
  nodes.map((node) => ({
    children: node.children === undefined ? undefined : toPrimitiveNodes(node.children),
    data: node,
    disabled: node.disabled,
    keywords: node.keywords,
    label: node.label,
    value: node.value,
  }));

const toNodes = (path: readonly CascaderPrimitiveNode<CascaderNode>[]): CascaderNode[] =>
  path.flatMap((node) => (node.data === undefined ? [] : [node.data]));

const NodesContext = React.createContext<CascaderIndex<CascaderNode> | null>(null);

/** Every Erbium node by value, with its path from the top. */
const useNodes = (part: string) => {
  const index = React.use(NodesContext);

  if (index === null) {
    throw new Error(`${part} must be used within Cascader`);
  }

  return index;
};

/** The Erbium nodes on the path to a value, root first. */
const pathOf = (index: CascaderIndex<CascaderNode>, value: string) =>
  toNodes(index.get(value)?.path ?? []);

// Root

interface CascaderChangeDetails {
  /** The leaf that was picked or toggled, or `null` when the selection was cleared. */
  node: CascaderNode | null;
  /** The leaf's ancestors and the leaf itself, root first. Empty when cleared. */
  path: CascaderNode[];
}

interface CascaderSharedProps {
  /** The option tree. */
  items: readonly CascaderNode[];
  children?: React.ReactNode;
  /** Lets `CascaderSearch` filter the open level, as `searchable` on `DropdownMenu` does. */
  searchable?: boolean;
  /** Replaces the search match. Defaults to a locale-aware substring test on label and keywords. */
  filter?: (node: CascaderNode, query: string) => boolean;
  disabled?: boolean;
  /** Submits each selected value under this name with a surrounding form. */
  name?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: MenuPrimitive.Root.Props["onOpenChange"];
  onOpenChangeComplete?: MenuPrimitive.Root.Props["onOpenChangeComplete"];
}

interface CascaderSingleProps extends CascaderSharedProps {
  multiple?: false;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null, details: CascaderChangeDetails) => void;
}

interface CascaderMultipleProps extends CascaderSharedProps {
  /** Picks any number of leaves; the popup stays open while picking. */
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[], details: CascaderChangeDetails) => void;
}

type CascaderProps = CascaderSingleProps | CascaderMultipleProps;

/**
 * A select whose options form a tree. A row with children opens its level in place, inside the
 * same popup, and the search of a level finds options at any depth below it.
 */
const Cascader = (props: CascaderProps) => {
  const {
    children,
    defaultOpen,
    disabled,
    filter,
    items,
    name,
    onOpenChange,
    onOpenChangeComplete,
    open,
    searchable,
  } = props;

  const nodes = React.useMemo(() => toPrimitiveNodes(items), [items]);
  const index = React.useMemo(() => createCascaderIndex(nodes), [nodes]);

  // The primitive matches its own nodes; the filter is written against Erbium's.
  const match = React.useMemo<CascaderMatch | undefined>(
    () =>
      filter === undefined
        ? undefined
        : (node, query) => {
            const source = index.get(node.value)?.node.data;

            return source !== undefined && filter(source, query);
          },
    [filter, index],
  );

  const toDetails = (details: CascaderValueChangeDetails): CascaderChangeDetails =>
    details.node === null
      ? { node: null, path: [] }
      : {
          node: index.get(details.node.value)?.node.data ?? null,
          path: pathOf(index, details.node.value),
        };

  const shared = {
    defaultOpen,
    disabled,
    filter: match,
    items: nodes,
    name,
    onOpenChange,
    onOpenChangeComplete,
    open,
    searchable,
  };

  let root: React.ReactNode;

  if (props.multiple === true) {
    const onMultipleChange = props.onValueChange;

    root = (
      <CascaderPrimitive.Root
        {...shared}
        multiple
        value={props.value}
        defaultValue={props.defaultValue}
        onValueChange={(value, details) => {
          onMultipleChange?.(value, toDetails(details));
        }}
      >
        {children}
      </CascaderPrimitive.Root>
    );
  } else {
    const onSingleChange = props.onValueChange;

    root = (
      <CascaderPrimitive.Root
        {...shared}
        value={props.value}
        defaultValue={props.defaultValue}
        onValueChange={(value, details) => {
          onSingleChange?.(value, toDetails(details));
        }}
      >
        {children}
      </CascaderPrimitive.Root>
    );
  }

  return <NodesContext value={index}>{root}</NodesContext>;
};

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
        className={cn("group", className)}
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
        "group flex w-fit min-w-0 items-center justify-between gap-control-gap control-size touch-target rounded-lg border surface-control text-control-sm whitespace-nowrap transition-[color,background-color,box-shadow] duration-150 outline-none select-none motion-reduce:transition-none aria-invalid:border-error aria-invalid:ring-[1.5px] aria-invalid:ring-invalid-halo group-data-invalid/field:border-error group-data-invalid/field:ring-[1.5px] group-data-invalid/field:ring-invalid-halo data-placeholder:text-muted-foreground data-[size=sm]:control-size-sm data-[size=sm]:rounded-[min(var(--radius-md),10px)] data-disabled:cursor-not-allowed data-disabled:opacity-50 dark:aria-invalid:border-invalid dark:group-data-invalid/field:border-invalid [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-control-icon",
        className,
      )}
      {...props}
    >
      {children}
      <RotatingChevron className="pointer-events-none size-control-icon text-muted-foreground" />
    </CascaderPrimitive.Trigger>
  );
};

interface CascaderValueProps extends Omit<React.ComponentProps<"span">, "children"> {
  /** Shown while nothing is selected. */
  placeholder?: React.ReactNode;
  /** Renders the selection. Receives the path of each selected leaf, root first. */
  children?: (paths: CascaderNode[][]) => React.ReactNode;
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
const CascaderValue = ({ className, placeholder, children, ...props }: CascaderValueProps) => {
  const index = useNodes("CascaderValue");
  const { state } = useCascader();

  return (
    <CascaderPrimitive.Value
      data-slot="cascader-value"
      className={cn("min-w-0 flex-1 truncate text-start", className)}
      {...props}
    >
      {({ paths }): React.ReactNode => {
        const selected = paths.map((path) => pathOf(index, path.at(-1)?.value ?? ""));

        if (children !== undefined) {
          return children(selected);
        }

        if (selected.length === 0) {
          return placeholder;
        }

        return state.multiple ? (
          selected.map((path) => path.at(-1)?.label).join(", ")
        ) : (
          <CascaderPath path={selected[0] ?? []} />
        );
      }}
    </CascaderPrimitive.Value>
  );
};

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
}: MenuPrimitive.Input.Props) => {
  const { state } = useCascader();

  return (
    <div data-slot="cascader-search" className="shrink-0">
      <div
        className="flex search-input-row items-center"
        onPointerDown={(event) => {
          focusSearchInput(event.currentTarget, event);
        }}
      >
        {state.levelNode === null ? (
          <Icon
            name="search-01"
            aria-hidden="true"
            className="size-control-icon shrink-0 text-muted-foreground"
          />
        ) : (
          <CascaderPrimitive.Back
            render={
              <Button variant="ghost" size="icon-xs" className="-ms-1 shrink-0 rtl:rotate-180" />
            }
          >
            <Icon name="chevron-left" aria-hidden="true" />
          </CascaderPrimitive.Back>
        )}
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
      </div>
      <Separator variant="full" />
    </div>
  );
};

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

type CascaderRenderRow = (node: CascaderNode) => React.ReactNode;

interface CascaderListProps extends Omit<MenuPrimitive.List.Props, "children"> {
  /** Renders the content of each row. Defaults to the node's icon, label and description. */
  children?: CascaderRenderRow;
}

const secondaryLineClassName = "truncate text-metadata text-muted-foreground";

/** One row: a radio or checkbox item for a leaf, a row that opens the level of one with children. */
const CascaderItem = ({
  row,
  render,
}: {
  row: CascaderRow<CascaderNode>;
  render: CascaderRenderRow | undefined;
}) => {
  const { state } = useCascader();
  const node = row.node.data;

  if (node === undefined) {
    return null;
  }

  const branch = row.kind === "branch";

  return (
    <CascaderPrimitive.Item
      row={row}
      data-slot={branch ? "cascader-branch" : "cascader-item"}
      className={cn(
        branch ? menuItemClassName : menuChoiceItemClassName,
        "group/cascader-item gap-related",
      )}
    >
      {branch ? null : (
        <span className={menuChoiceIndicatorClassName}>
          {state.multiple ? (
            <CascaderPrimitive.ItemIndicator className="group/check-indicator inline-grid">
              <CheckboxStateIcon className="size-control-icon" />
            </CascaderPrimitive.ItemIndicator>
          ) : (
            <CascaderPrimitive.ItemIndicator keepMounted={false}>
              <Icon name="check" />
            </CascaderPrimitive.ItemIndicator>
          )}
        </span>
      )}
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
        />
        {row.trail.length > 0 || node.description === undefined ? null : (
          <span data-slot="cascader-item-description" className={secondaryLineClassName}>
            {node.description}
          </span>
        )}
      </span>
      {branch ? (
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
const CascaderList = ({ children, className, ...props }: CascaderListProps) => (
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
        <CascaderPrimitive.Rows>
          {(row: CascaderRow<CascaderNode>) => <CascaderItem row={row} render={children} />}
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
