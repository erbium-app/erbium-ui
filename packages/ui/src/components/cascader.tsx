import * as React from "react";
import { flushSync } from "react-dom";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { mergeProps } from "@base-ui/react/merge-props";
import { focusSearchInput } from "../lib/focus-search-input";
import { skeletonBlock } from "../lib/skeleton-hints";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { useDirection } from "./direction";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Icon } from "./icon";
import { MenuEmpty, MenuList } from "./menu-search";
import { Separator } from "./separator";
import { RotatingChevron } from "./stateful-icon";

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

interface CascaderEntry {
  node: CascaderNode;
  /** The node's ancestors and the node itself, root first. */
  path: CascaderNode[];
}

type CascaderIndex = ReadonlyMap<string, CascaderEntry>;

const NO_NODES: readonly CascaderNode[] = [];

/** Indexes every node by value in one pass. The first node with a value wins. */
const buildIndex = (items: readonly CascaderNode[]): CascaderIndex => {
  const index = new Map<string, CascaderEntry>();

  const visit = (nodes: readonly CascaderNode[], ancestors: CascaderNode[]) => {
    for (const node of nodes) {
      if (!index.has(node.value)) {
        const path = [...ancestors, node];
        index.set(node.value, { node, path });
        visit(node.children ?? NO_NODES, path);
      }
    }
  };

  visit(items, []);

  return index;
};

// Root

interface CascaderChangeDetails {
  /** The leaf that was picked or toggled, or `null` when the selection was cleared. */
  node: CascaderNode | null;
  /** The leaf's ancestors and the leaf itself, root first. Empty when cleared. */
  path: CascaderNode[];
}

interface CascaderContextValue {
  state: {
    multiple: boolean;
    /** Selected leaf values, in selection order. */
    selected: readonly string[];
    /** Selected leaves below each level, keyed by the level's value. */
    selectedCounts: ReadonlyMap<string, number>;
    /** The open levels, outermost first. Empty at the top level. */
    path: readonly string[];
    /** The search query of the open level. */
    query: string;
  };
  actions: {
    select: (node: CascaderNode) => void;
    toggle: (node: CascaderNode, checked: boolean) => void;
    clear: () => void;
    /** Shows the children of `node` in place of the current level. */
    enter: (node: CascaderNode) => void;
    /** Returns to the parent level. */
    back: () => void;
  };
  meta: {
    index: CascaderIndex;
    items: readonly CascaderNode[];
    match: (node: CascaderNode, query: string) => boolean;
    searchable: boolean;
    /** Registers the search field, which keeps focus while levels change. */
    setInput: (input: HTMLInputElement | null) => void;
    focusInput: () => void;
  };
}

const CascaderContext = React.createContext<CascaderContextValue | null>(null);

const useCascader = (part: string) => {
  const context = React.use(CascaderContext);

  if (context === null) {
    throw new Error(`${part} must be used within Cascader`);
  }

  return context;
};

/** The node whose children are on screen, or `null` at the top level. */
const useLevel = (context: CascaderContextValue) => {
  const value = context.state.path.at(-1);

  return value === undefined ? null : (context.meta.index.get(value)?.node ?? null);
};

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

const single = (value: string | null | undefined): readonly string[] =>
  value === null || value === undefined ? [] : [value];

const CLEARED: CascaderChangeDetails = { node: null, path: [] };

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
    searchable = false,
  } = props;

  const multiple = props.multiple === true;
  const controlled = props.value !== undefined;
  const onSingleChange = props.multiple === true ? undefined : props.onValueChange;
  const onMultipleChange = props.multiple === true ? props.onValueChange : undefined;

  const [uncontrolled, setUncontrolled] = React.useState(() =>
    props.multiple === true ? (props.defaultValue ?? []) : single(props.defaultValue),
  );

  let selected = uncontrolled;

  if (controlled) {
    selected = props.multiple === true ? (props.value ?? []) : single(props.value);
  }

  const index = React.useMemo(() => buildIndex(items), [items]);

  // A single selection opens on the level that holds it. A multiple selection opens at the top,
  // where the counts show where the selected leaves are.
  const revealPath = React.useCallback(() => {
    const [first] = selected;
    const path = multiple || first === undefined ? undefined : index.get(first)?.path;

    return path === undefined ? [] : path.slice(0, -1).map((node) => node.value);
  }, [index, multiple, selected]);

  const [path, setPath] = React.useState<readonly string[]>(() =>
    defaultOpen === true ? revealPath() : [],
  );

  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const setInput = React.useCallback((input: HTMLInputElement | null) => {
    inputRef.current = input;
  }, []);

  const focusInput = React.useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const selectedCounts = React.useMemo(() => {
    const counts = new Map<string, number>();

    for (const value of selected) {
      for (const ancestor of index.get(value)?.path.slice(0, -1) ?? NO_NODES) {
        counts.set(ancestor.value, (counts.get(ancestor.value) ?? 0) + 1);
      }
    }

    return counts;
  }, [index, selected]);

  const { contains } = MenuPrimitive.useFilter();

  const match = React.useCallback(
    (node: CascaderNode, text: string) =>
      filter === undefined
        ? contains(node.label, text) ||
          (node.keywords?.some((keyword) => contains(keyword, text)) ?? false)
        : filter(node, text),
    [contains, filter],
  );

  const actions = React.useMemo<CascaderContextValue["actions"]>(() => {
    const details = (node: CascaderNode) => ({
      node,
      path: index.get(node.value)?.path ?? [node],
    });

    const commit = (next: readonly string[], change: CascaderChangeDetails) => {
      if (!controlled) {
        setUncontrolled(next);
      }

      if (multiple) {
        onMultipleChange?.([...next], change);
      } else {
        onSingleChange?.(next[0] ?? null, change);
      }
    };

    return {
      back: () => {
        setPath((current) => current.slice(0, -1));
        setQuery("");
      },
      clear: () => {
        if (selected.length > 0) {
          commit([], CLEARED);
        }
      },
      enter: (node) => {
        // A search result can sit deeper than the open level, so open its whole path.
        setPath(index.get(node.value)?.path.map((step) => step.value) ?? [node.value]);
        setQuery("");
      },
      select: (node) => {
        if (selected[0] !== node.value) {
          commit([node.value], details(node));
        }
      },
      toggle: (node, checked) => {
        const rest = selected.filter((value) => value !== node.value);

        commit(checked ? [...rest, node.value] : rest, details(node));
      },
    };
  }, [controlled, index, multiple, onMultipleChange, onSingleChange, selected]);

  const context = React.useMemo<CascaderContextValue>(
    () => ({
      actions,
      meta: { focusInput, index, items, match, searchable, setInput },
      state: { multiple, path, query, selected, selectedCounts },
    }),
    [
      actions,
      focusInput,
      index,
      items,
      match,
      multiple,
      path,
      query,
      searchable,
      selected,
      selectedCounts,
      setInput,
    ],
  );

  const handleOpenChange: MenuPrimitive.Root.Props["onOpenChange"] = (next, details) => {
    if (next) {
      setPath(revealPath());
    }

    onOpenChange?.(next, details);
  };

  const menu = (
    <DropdownMenu
      data-slot="cascader"
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={handleOpenChange}
      onOpenChangeComplete={onOpenChangeComplete}
      disabled={disabled}
    >
      {children}
    </DropdownMenu>
  );

  return (
    <CascaderContext value={context}>
      {searchable ? (
        <MenuPrimitive.FilterProvider
          filter={null}
          autoHighlight
          value={query}
          onValueChange={setQuery}
        >
          {menu}
        </MenuPrimitive.FilterProvider>
      ) : (
        menu
      )}
      {name === undefined
        ? null
        : selected.map((value) => <input key={value} type="hidden" name={name} value={value} />)}
    </CascaderContext>
  );
};

// Keys

/** The physical arrow keys that open and close a level, which mirror in right-to-left text. */
const useLevelKeys = () => {
  const rtl = useDirection() === "rtl";

  return rtl
    ? { back: "ArrowRight", enter: "ArrowLeft" }
    : { back: "ArrowLeft", enter: "ArrowRight" };
};

// Parts

/** Select-style button that shows the value and opens the popup. */
const CascaderTrigger = ({
  className,
  size = "default",
  children,
  ...props
}: MenuPrimitive.Trigger.Props & {
  size?: "sm" | "default";
}) => {
  const { state } = useCascader("CascaderTrigger");

  return (
    <DropdownMenuTrigger
      data-slot="cascader-trigger"
      {...skeletonBlock}
      data-size={size}
      data-placeholder={state.selected.length === 0 ? "" : undefined}
      className={cn(
        "flex w-fit min-w-0 items-center justify-between gap-control-gap control-size touch-target rounded-lg border surface-control text-control-sm whitespace-nowrap transition-[color,background-color,box-shadow] duration-150 outline-none select-none motion-reduce:transition-none aria-invalid:border-error aria-invalid:ring-[1.5px] aria-invalid:ring-invalid-halo group-data-invalid/field:border-error group-data-invalid/field:ring-[1.5px] group-data-invalid/field:ring-invalid-halo data-placeholder:text-muted-foreground data-[size=sm]:control-size-sm data-[size=sm]:rounded-[min(var(--radius-md),10px)] data-disabled:cursor-not-allowed data-disabled:opacity-50 dark:aria-invalid:border-invalid dark:group-data-invalid/field:border-invalid [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-control-icon",
        className,
      )}
      {...props}
    >
      {children}
      <RotatingChevron className="pointer-events-none size-control-icon text-muted-foreground" />
    </DropdownMenuTrigger>
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
  const { meta, state } = useCascader("CascaderValue");

  const paths = state.selected.flatMap((value) => {
    const entry = meta.index.get(value);

    return entry === undefined ? [] : [entry.path];
  });

  let content: React.ReactNode = placeholder;

  if (children !== undefined) {
    content = children(paths);
  } else if (state.multiple && paths.length > 0) {
    content = paths.map((path) => path.at(-1)?.label).join(", ");
  } else if (paths[0] !== undefined) {
    content = <CascaderPath path={paths[0]} />;
  }

  return (
    <span
      data-slot="cascader-value"
      className={cn("min-w-0 flex-1 truncate text-start", className)}
      {...props}
    >
      {content}
    </span>
  );
};

/** The popup. Every level opens inside it, in place of the one before. */
const CascaderContent = ({
  align = "start",
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) => (
  <DropdownMenuContent
    data-slot="cascader-content"
    align={align}
    className={cn("w-(--anchor-width) min-w-56", className)}
    {...props}
  />
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
  const context = useCascader("CascaderSearch");
  const { actions, meta, state } = context;
  const { focusInput, searchable, setInput } = meta;
  const level = useLevel(context);
  const keys = useLevelKeys();

  if (!searchable) {
    throw new Error("CascaderSearch needs <Cascader searchable>");
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const caret = input.selectionStart === input.selectionEnd ? input.selectionStart : null;
    const atStart = caret === 0;
    const atEnd = caret === input.value.length;

    if (
      level !== null &&
      ((event.key === "Backspace" && input.value === "") || (event.key === keys.back && atStart))
    ) {
      event.preventDefault();
      actions.back();
    } else if (event.key === keys.enter && atEnd) {
      const activeId = input.getAttribute("aria-activedescendant");
      const active = activeId === null ? null : input.ownerDocument.querySelector(`#${activeId}`);

      const node =
        active instanceof HTMLElement
          ? meta.index.get(active.dataset.value ?? "")?.node
          : undefined;

      if (node?.children !== undefined && node.disabled !== true) {
        event.preventDefault();
        actions.enter(node);
      }
    }
  };

  return (
    <div data-slot="cascader-search" className="shrink-0">
      <div
        className="flex search-input-row items-center"
        onPointerDown={(event) => {
          focusSearchInput(event.currentTarget, event);
        }}
      >
        {level === null ? (
          <Icon
            name="search-01"
            aria-hidden="true"
            className="size-control-icon shrink-0 text-muted-foreground"
          />
        ) : (
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={`Back to ${state.path.length > 1 ? (meta.index.get(state.path.at(-2) ?? "")?.node.label ?? "") : "all options"}`}
            className="-ms-1 shrink-0 rtl:rotate-180"
            onClick={() => {
              actions.back();
              focusInput();
            }}
          >
            <Icon name="chevron-left" aria-hidden="true" />
          </Button>
        )}
        <MenuPrimitive.Input
          ref={setInput}
          data-slot="cascader-search-input"
          aria-label={level === null ? (ariaLabel ?? "Search options") : `Search ${level.label}`}
          placeholder={level === null ? placeholder : `Search ${level.label}…`}
          className="min-h-0 min-w-0 flex-1 bg-transparent py-0 text-field outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          {...mergeProps<typeof MenuPrimitive.Input>({ onKeyDown: handleKeyDown }, props)}
        />
        <MenuPrimitive.Clear
          aria-label="Clear search"
          render={<Button variant="ghost" size="icon-xs" />}
        >
          <Icon name="x" aria-hidden="true" />
        </MenuPrimitive.Clear>
      </div>
      <Separator variant="full" />
    </div>
  );
};

/** Shown when the search of the open level matches nothing. */
const CascaderEmpty = ({ children = "No results found.", ...props }: MenuPrimitive.Empty.Props) => {
  if (!useCascader("CascaderEmpty").meta.searchable) {
    throw new Error("CascaderEmpty needs <Cascader searchable>");
  }

  return (
    <MenuEmpty data-slot="cascader-empty" {...props}>
      {children}
    </MenuEmpty>
  );
};

interface CascaderRow {
  node: CascaderNode;
  /** Ancestors between the open level and a search result, shown under its label. */
  trail: CascaderNode[];
}

/** Collects the nodes at any depth below `nodes` that match the query. */
const searchLevel = (
  nodes: readonly CascaderNode[],
  query: string,
  match: (node: CascaderNode, query: string) => boolean,
): CascaderRow[] => {
  const rows: CascaderRow[] = [];

  const visit = (level: readonly CascaderNode[], trail: CascaderNode[]) => {
    for (const node of level) {
      if (match(node, query)) {
        rows.push({ node, trail });
      }

      if (node.children !== undefined) {
        visit(node.children, [...trail, node]);
      }
    }
  };

  visit(nodes, []);

  return rows;
};

type CascaderRenderRow = (node: CascaderNode) => React.ReactNode;

interface CascaderListProps extends Omit<MenuPrimitive.List.Props, "children"> {
  /** Renders the content of each row. Defaults to the node's icon, label and description. */
  children?: CascaderRenderRow;
}

/**
 * The options of the open level, under the level's name. A leaf picks a value; a row with
 * children opens its level in place. While searched, it lists every match below the level with
 * the path that leads there.
 */
const CascaderList = ({ children, onKeyDown, ...props }: CascaderListProps) => {
  const context = useCascader("CascaderList");
  const { actions, meta, state } = context;
  const level = useLevel(context);
  const keys = useLevelKeys();
  const query = React.useDeferredValue(state.query.trim());

  const nodes = level === null ? meta.items : (level.children ?? NO_NODES);

  const rows = React.useMemo<CascaderRow[]>(
    () =>
      query === ""
        ? nodes.map((node) => ({ node, trail: [] }))
        : searchLevel(nodes, query, meta.match),
    [meta.match, nodes, query],
  );

  const items = rows.map(({ node, trail }) => (
    <CascaderItem key={node.value} node={node} trail={trail} render={children} />
  ));

  const label =
    level === null ? null : (
      <DropdownMenuLabel data-slot="cascader-label">{level.label}</DropdownMenuLabel>
    );

  return (
    <MenuList
      data-slot="cascader-list"
      onKeyDown={(event) => {
        if (!meta.searchable && level !== null && event.key === keys.back) {
          event.preventDefault();
          event.stopPropagation();
          changeLevel(event.currentTarget, actions.back, level.value);
        }

        onKeyDown?.(event);
      }}
      {...props}
    >
      {!meta.searchable && level !== null ? <CascaderBack returnTo={level.value} /> : null}
      {state.multiple ? (
        <DropdownMenuGroup>
          {label}
          {items}
        </DropdownMenuGroup>
      ) : (
        <DropdownMenuRadioGroup
          value={state.selected[0] ?? null}
          onValueChange={(value: string) => {
            const entry = meta.index.get(value);

            if (entry !== undefined) {
              actions.select(entry.node);
            }
          }}
        >
          {label}
          {items}
        </DropdownMenuRadioGroup>
      )}
    </MenuList>
  );
};

/**
 * Applies a level change made from a row. Without a search field, focus sits on the rows, and
 * the change unmounts the focused one, so focus moves to the first row of the new level.
 */
const changeLevel = (row: HTMLElement, change: () => void, returnTo?: string) => {
  const list = row.closest("[data-slot=cascader-list]");
  const hadFocus = row.contains(row.ownerDocument.activeElement);

  flushSync(change);

  if (!hadFocus || list === null) {
    return;
  }

  // Going back lands on the row of the level just left; going in, on the first option.
  const rows = [...list.querySelectorAll<HTMLElement>("[role^=menuitem]:not([data-disabled])")];

  const target =
    rows.find((element) => returnTo !== undefined && element.dataset.value === returnTo) ??
    rows.find((element) => element.dataset.slot !== "cascader-back");

  target?.focus();
};

/** Row back to the parent level, for a cascader without a search field to hold the button. */
const CascaderBack = ({ returnTo }: { returnTo: string }) => {
  const { actions } = useCascader("CascaderList");

  return (
    <DropdownMenuItem
      data-slot="cascader-back"
      closeOnClick={false}
      className="gap-related text-muted-foreground"
      onClick={(event) => {
        changeLevel(event.currentTarget, actions.back, returnTo);
      }}
    >
      <Icon name="chevron-left" aria-hidden="true" className="rtl:rotate-180" />
      Back
    </DropdownMenuItem>
  );
};

interface CascaderItemProps extends CascaderRow {
  render: CascaderRenderRow | undefined;
}

const CascaderItemContent = ({ node, trail, render }: CascaderItemProps) => {
  const secondary =
    trail.length === 0 ? node.description : trail.map((ancestor) => ancestor.label).join(" / ");

  return (
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
      {secondary === undefined ? null : (
        <span
          data-slot="cascader-item-description"
          className="truncate text-metadata text-muted-foreground"
        >
          {secondary}
        </span>
      )}
    </span>
  );
};

/** One row: a radio or checkbox item for a leaf, a row that opens the level of one with children. */
const CascaderItem = (props: CascaderItemProps) => {
  const { node } = props;
  const { state, actions } = useCascader("CascaderList");
  const content = <CascaderItemContent {...props} />;

  if (node.children !== undefined) {
    return (
      <CascaderBranch node={node} childCount={node.children.length}>
        {content}
      </CascaderBranch>
    );
  }

  if (state.multiple) {
    return (
      <DropdownMenuCheckboxItem
        data-slot="cascader-item"
        data-value={node.value}
        label={node.label}
        disabled={node.disabled}
        checked={state.selected.includes(node.value)}
        onCheckedChange={(checked) => {
          actions.toggle(node, checked);
        }}
        className="gap-related"
      >
        {content}
      </DropdownMenuCheckboxItem>
    );
  }

  return (
    <DropdownMenuRadioItem
      data-slot="cascader-item"
      data-value={node.value}
      value={node.value}
      label={node.label}
      disabled={node.disabled}
      closeOnClick
      className="gap-related"
    >
      {content}
    </DropdownMenuRadioItem>
  );
};

/**
 * A row that opens its level in place. It counts its options, or, once any leaf below it is
 * selected in a multiple cascader, the selected ones.
 */
const CascaderBranch = ({
  node,
  childCount,
  children,
}: {
  node: CascaderNode;
  childCount: number;
  children: React.ReactNode;
}) => {
  const { actions, meta, state } = useCascader("CascaderList");
  const keys = useLevelKeys();
  const selectedCount = state.selectedCounts.get(node.value) ?? 0;
  const showSelected = state.multiple && selectedCount > 0;

  return (
    <DropdownMenuItem
      data-slot="cascader-branch"
      data-value={node.value}
      data-selected={selectedCount > 0 ? "" : undefined}
      aria-haspopup="true"
      label={node.label}
      disabled={node.disabled}
      closeOnClick={false}
      className="gap-related"
      onClick={(event) => {
        changeLevel(event.currentTarget, () => {
          actions.enter(node);
        });
      }}
      onKeyDown={(event) => {
        // With a search field, the field handles the level keys.
        if (!meta.searchable && event.key === keys.enter) {
          event.preventDefault();
          event.stopPropagation();
          changeLevel(event.currentTarget, () => {
            actions.enter(node);
          });
        }
      }}
    >
      {children}
      <span
        data-slot="cascader-branch-count"
        className={cn("text-muted-foreground tabular-nums", selectedCount > 0 && "text-foreground")}
      >
        <span aria-hidden="true">{showSelected ? selectedCount : childCount}</span>
        <span className="sr-only">
          {showSelected
            ? `, ${selectedCount} selected`
            : `, ${childCount} ${childCount === 1 ? "option" : "options"}`}
          {!state.multiple && selectedCount > 0 ? ", holds the selection" : null}
        </span>
      </span>
      <Icon
        name="chevron-right"
        aria-hidden="true"
        className="text-muted-foreground rtl:rotate-180"
      />
    </DropdownMenuItem>
  );
};

/** Footer action that clears the selection. Disabled while nothing is selected. */
const CascaderClear = ({
  className,
  children = "Clear selection",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "onClick">) => {
  const { actions, meta, state } = useCascader("CascaderClear");

  return (
    <div data-slot="cascader-clear" className="shrink-0">
      <Separator variant="full" />
      <div className="p-1">
        <Button
          variant="ghost"
          size="sm"
          disabled={state.selected.length === 0}
          className={cn("w-full justify-start gap-related text-muted-foreground", className)}
          onClick={() => {
            actions.clear();
            meta.focusInput();
          }}
          {...props}
        >
          <Icon name="x" aria-hidden="true" />
          {children}
        </Button>
      </div>
    </div>
  );
};

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
