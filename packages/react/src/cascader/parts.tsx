import * as React from "react";
import { flushSync } from "react-dom";
import { useDirection } from "@base-ui/react/direction-provider";
import { Menu } from "@base-ui/react/menu";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { dataFlag, visuallyHidden } from "../internal/dom";
import { assignRef, resolveStateProp } from "../internal/resolve";
import type { StateProp } from "../internal/resolve";
import { CascaderItemContext, useCascaderContext, useCascaderItemContext } from "./context";
import type { CascaderContextValue, CascaderState } from "./context";
import { getLevelRows } from "./tree";
import type { CascaderNode, CascaderRow } from "./tree";

// Keys

/** The arrow keys that open and close a level. They mirror in right-to-left text. */
const useLevelKeys = () =>
  useDirection() === "rtl"
    ? { back: "ArrowRight", enter: "ArrowLeft" }
    : { back: "ArrowLeft", enter: "ArrowRight" };

const listSelector = "[data-cascader-list]";
const backItemSelector = "[data-cascader-back]";

/**
 * Applies a level change made from a row. Without a search field, focus sits on the rows and the
 * change unmounts the focused one, so focus moves to the row just left (going back) or to the
 * first option (going in).
 */
const changeLevel = (row: HTMLElement, change: () => void, returnTo?: string) => {
  const list = row.closest(listSelector);
  const hadFocus = row.contains(row.ownerDocument.activeElement);

  flushSync(change);

  if (!hadFocus || list === null) {
    return;
  }

  const rows = [...list.querySelectorAll<HTMLElement>("[role^=menuitem]:not([data-disabled])")];

  const target =
    rows.find((element) => returnTo !== undefined && element.dataset.value === returnTo) ??
    rows.find((element) => !element.matches(backItemSelector));

  target?.focus();
};

type ClassName<TState> = StateProp<string | undefined, TState>;

// Value

interface CascaderValueState extends Record<string, unknown> {
  /** Each selected leaf's path, root first. */
  paths: CascaderNode[][];
  placeholder: boolean;
}

interface CascaderValueProps extends Omit<
  useRender.ComponentProps<"span", CascaderValueState>,
  "children" | "className"
> {
  className?: ClassName<CascaderValueState>;
  /** Shown while nothing is selected. */
  placeholder?: React.ReactNode;
  /** Replaces the default text: the single path joined with " / ", or the leaf labels joined with ", ". */
  children?: React.ReactNode | ((state: CascaderValueState) => React.ReactNode);
}

/** The selection as text. */
const CascaderValue = ({
  children,
  className,
  placeholder,
  render,
  ...props
}: CascaderValueProps) => {
  const { index, state } = useCascaderContext("Cascader.Value");

  const paths = state.selected.flatMap((value) => {
    const entry = index.get(value);

    return entry === undefined ? [] : [entry.path];
  });

  const valueState: CascaderValueState = { paths, placeholder: paths.length === 0 };

  let content: React.ReactNode = placeholder;

  if (children !== undefined) {
    content = resolveStateProp(children, valueState);
  } else if (state.multiple && paths.length > 0) {
    content = paths.map((path) => path.at(-1)?.label).join(", ");
  } else if (paths[0] !== undefined) {
    content = paths[0].map((node) => node.label).join(" / ");
  }

  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      { children: content, className: resolveStateProp(className, valueState) },
      props,
    ),
    render,
    state: valueState,
    stateAttributesMapping: { paths: () => null },
  });
};

// Trigger

/** Opens the popup. Base UI's `Menu.Trigger`, with `data-placeholder` while nothing is selected. */
const CascaderTrigger = (props: Menu.Trigger.Props) => {
  const { state } = useCascaderContext("Cascader.Trigger");

  return <Menu.Trigger data-placeholder={dataFlag(state.selected.length === 0)} {...props} />;
};

// Search

interface CascaderSearchProps extends Menu.Input.Props {
  /** The field's name at the top level. Defaults to "Search options". */
  "aria-label"?: string;
  /** The field's name inside a level. Defaults to "Search <level>". */
  levelLabel?: (level: CascaderNode) => string;
  /** The placeholder inside a level. Defaults to "Search <level>…". */
  levelPlaceholder?: (level: CascaderNode) => string;
}

const useSearchable = (part: string) => {
  const context = useCascaderContext(part);

  if (!context.state.searchable) {
    throw new Error(`${part} needs <Cascader.Root searchable>.`);
  }

  return context;
};

const defaultLevelLabel = (level: CascaderNode) => `Search ${level.label}`;
const defaultLevelPlaceholder = (level: CascaderNode) => `Search ${level.label}…`;

/**
 * Base UI's `Menu.Input`, filtering the open level. It keeps focus while levels change. With the
 * caret at the end, the enter-level arrow opens the highlighted branch; at the start, the
 * back-level arrow goes up, as does Backspace in an empty field.
 */
const CascaderSearch = ({
  "aria-label": ariaLabel = "Search options",
  levelLabel = defaultLevelLabel,
  levelPlaceholder = defaultLevelPlaceholder,
  placeholder,
  ref,
  ...props
}: CascaderSearchProps) => {
  const { actions, index, registerSearch, state } = useSearchable("Cascader.Search");
  const keys = useLevelKeys();
  const level = state.levelNode;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const caret = input.selectionStart === input.selectionEnd ? input.selectionStart : null;

    if (
      level !== null &&
      ((event.key === "Backspace" && input.value === "") ||
        (event.key === keys.back && caret === 0))
    ) {
      event.preventDefault();
      actions.back({
        event: event.nativeEvent,
        reason: event.key === "Backspace" ? "backspace-key" : "arrow-key",
      });
    } else if (event.key === keys.enter && caret === input.value.length) {
      const activeId = input.getAttribute("aria-activedescendant");

      const active =
        activeId === null
          ? null
          : input.ownerDocument.querySelector<HTMLElement>(`#${CSS.escape(activeId)}`);

      const node = active === null ? undefined : index.get(active.dataset.value ?? "")?.node;

      if (node?.children !== undefined && node.disabled !== true) {
        event.preventDefault();
        actions.enter(node, { event: event.nativeEvent, reason: "arrow-key" });
      }
    }
  };

  const setRef = React.useCallback(
    (input: HTMLInputElement | null) => {
      registerSearch(input);
      assignRef(ref, input);
    },
    [ref, registerSearch],
  );

  return (
    <Menu.Input
      ref={setRef}
      aria-label={level === null ? ariaLabel : levelLabel(level)}
      placeholder={level === null ? placeholder : levelPlaceholder(level)}
      {...mergeProps<typeof Menu.Input>({ onKeyDown: handleKeyDown }, props)}
    />
  );
};

/** Clears the search text. Base UI's `Menu.Clear`. */
const CascaderSearchClear = (props: Menu.Clear.Props) => {
  useSearchable("Cascader.SearchClear");

  return <Menu.Clear {...props} />;
};

/** Shown when the search of the open level matches nothing. Base UI's `Menu.Empty`. */
const CascaderEmpty = (props: Menu.Empty.Props) => {
  useSearchable("Cascader.Empty");

  return <Menu.Empty {...props} />;
};

// Back

interface CascaderBackProps extends Omit<useRender.ComponentProps<"button">, "aria-label"> {
  /** Defaults to "Back to <parent>", or "Back to all options" one level down. */
  "aria-label"?: StateProp<string, CascaderNode | null>;
}

/** A button back to the parent level that refocuses the search. Renders nothing at the top level. */
const CascaderBack = ({ "aria-label": ariaLabel, render, ...props }: CascaderBackProps) => {
  const { actions, state } = useCascaderContext("Cascader.Back");
  const parent = state.parentNode;

  const label = resolveStateProp(
    ariaLabel ?? ((node: CascaderNode | null) => `Back to ${node?.label ?? "all options"}`),
    parent,
  );

  return useRender({
    defaultTagName: "button",
    enabled: state.level.length > 0,
    props: mergeProps<"button">(
      {
        "aria-label": label,
        onClick: (event) => {
          actions.back({ event: event.nativeEvent, reason: "back-press" });
          actions.focusSearch();
        },
        type: "button",
      },
      props,
    ),
    render,
  });
};

/**
 * A menu row back to the parent level, for a cascader without a search field. Renders nothing at
 * the top level or when the cascader is searchable.
 */
const CascaderBackItem = ({ onClick, ...props }: Menu.Item.Props) => {
  const { actions, state } = useCascaderContext("Cascader.BackItem");
  const level = state.levelNode;

  if (state.searchable || level === null) {
    return null;
  }

  return (
    <Menu.Item
      data-cascader-back=""
      closeOnClick={false}
      onClick={(event) => {
        onClick?.(event);
        changeLevel(
          event.currentTarget,
          () => {
            actions.back({ event: event.nativeEvent, reason: "back-press" });
          },
          level.value,
        );
      }}
      {...props}
    />
  );
};

// List

/** Base UI's `Menu.List` for the open level. Without a search field, it owns the back-level key. */
const CascaderList = ({ onKeyDown, ...props }: Menu.List.Props) => {
  const { actions, state } = useCascaderContext("Cascader.List");
  const keys = useLevelKeys();
  const level = state.levelNode;

  return (
    <Menu.List
      data-cascader-list=""
      onKeyDown={(event) => {
        onKeyDown?.(event);

        if (!state.searchable && level !== null && event.key === keys.back) {
          event.preventDefault();
          event.stopPropagation();
          changeLevel(
            event.target instanceof HTMLElement ? event.target : event.currentTarget,
            () => {
              actions.back({ event: event.nativeEvent, reason: "arrow-key" });
            },
            level.value,
          );
        }
      }}
      {...props}
    />
  );
};

/**
 * The group of the open level: `Menu.RadioGroup` in a single cascader, `Menu.Group` in a multiple
 * one. Carries `data-level-depth`.
 */
const CascaderLevel = (
  props: Omit<Menu.Group.Props, "children"> & { children?: React.ReactNode },
) => {
  const { actions, index, state } = useCascaderContext("Cascader.Level");
  const depth = state.level.length;

  if (state.multiple) {
    return <Menu.Group data-level-depth={depth} {...props} />;
  }

  return (
    <Menu.RadioGroup
      data-level-depth={depth}
      value={state.selected[0] ?? null}
      onValueChange={(value: string, details) => {
        const entry = index.get(value);

        if (entry !== undefined) {
          actions.select(entry.node, details.event);
        }
      }}
      {...props}
    />
  );
};

/** The open level's label, as Base UI's `Menu.GroupLabel`. Renders nothing at the top level. */
const CascaderLevelLabel = ({ children, ...props }: Menu.GroupLabel.Props) => {
  const { state } = useCascaderContext("Cascader.LevelLabel");

  if (state.levelNode === null) {
    return null;
  }

  return <Menu.GroupLabel {...props}>{children ?? state.levelNode.label}</Menu.GroupLabel>;
};

interface CascaderRowsProps<TData = unknown> {
  /** Renders one row; give the returned element `key={row.node.value}`. */
  children: (row: CascaderRow<TData>) => React.ReactNode;
}

/**
 * The rows of the open level, or its search matches at any depth below it. Renders no element of
 * its own.
 */
const CascaderRows = <TData,>({ children }: CascaderRowsProps<TData>) => {
  const { items, match, state } = useCascaderContext("Cascader.Rows");
  const query = React.useDeferredValue(state.query.trim());

  const nodes = React.useMemo(
    () => (state.levelNode === null ? items : (state.levelNode.children ?? [])),
    [items, state.levelNode],
  );

  const rows = React.useMemo(() => getLevelRows(nodes, query, match), [match, nodes, query]);

  // SAFETY: TData only types what the caller put in `data`; these rows hold the caller's own nodes.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- context cannot carry the caller's TData generic, so the rows are re-typed to the type the caller declared for their own items.
  return (rows as CascaderRow<TData>[]).map((row) => (
    <React.Fragment key={row.node.value}>{children(row)}</React.Fragment>
  ));
};

// Item

interface CascaderItemState extends Record<string, unknown> {
  kind: "leaf" | "branch";
  /** The leaf is selected. */
  checked: boolean;
  /** The branch holds a selected leaf below it. */
  selected: boolean;
  /** The row is a search match below the open level. */
  searchResult: boolean;
  highlighted: boolean;
  disabled: boolean;
}

type ItemRender =
  | React.ReactElement
  | ((props: React.HTMLAttributes<HTMLElement>, state: CascaderItemState) => React.ReactElement);

interface CascaderItemProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "className" | "children" | "onClick"
> {
  /** The row from `Cascader.Rows`. */
  row: CascaderRow;
  children?: React.ReactNode;
  className?: ClassName<CascaderItemState>;
  style?: React.CSSProperties;
  render?: ItemRender;
  onClick?: React.MouseEventHandler<HTMLElement>;
  /** Defaults to closing after a pick in a single cascader and staying open otherwise. */
  closeOnClick?: boolean;
  ref?: React.Ref<HTMLElement>;
}

interface BaseItemState {
  highlighted: boolean;
  disabled: boolean;
  checked?: boolean;
}

/**
 * One row. A branch is a `Menu.Item` that opens its level; a leaf is a `Menu.RadioItem` in a
 * single cascader or a `Menu.CheckboxItem` in a multiple one.
 */
const CascaderItem = ({
  row,
  className,
  render,
  onClick,
  onKeyDown,
  closeOnClick,
  ...props
}: CascaderItemProps) => {
  const context = useCascaderContext("Cascader.Item");
  const { actions, selectedCounts, state } = context;
  const keys = useLevelKeys();
  const { node } = row;
  const checked = row.kind === "leaf" && state.selected.includes(node.value);
  const selected = (selectedCounts.get(node.value) ?? 0) > 0;

  const toState = (base: BaseItemState): CascaderItemState => ({
    checked,
    disabled: base.disabled,
    highlighted: base.highlighted,
    kind: row.kind,
    searchResult: row.trail.length > 0,
    selected,
  });

  const shared = {
    ...props,
    className: (base: BaseItemState) => resolveStateProp(className, toState(base)),
    "data-kind": row.kind,
    "data-search-result": dataFlag(row.trail.length > 0),
    "data-selected": dataFlag(selected),
    "data-value": node.value,
    disabled: node.disabled === true,
    label: node.label,
    render:
      render === undefined || React.isValidElement(render)
        ? render
        : (renderProps: React.HTMLAttributes<HTMLElement>, base: BaseItemState) =>
            render(renderProps, toState(base)),
  };

  let item: React.ReactElement;

  if (row.kind === "branch") {
    const enter = (
      event: React.SyntheticEvent<HTMLElement>,
      reason: "branch-press" | "arrow-key",
    ) => {
      changeLevel(event.currentTarget, () => {
        actions.enter(node, { event: event.nativeEvent, reason });
      });
    };

    item = (
      <Menu.Item
        {...shared}
        aria-haspopup="true"
        closeOnClick={closeOnClick ?? false}
        onClick={(event) => {
          onClick?.(event);

          if (!event.defaultPrevented) {
            enter(event, "branch-press");
          }
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);

          // With a search field, the field handles the level keys.
          if (!event.defaultPrevented && !state.searchable && event.key === keys.enter) {
            event.preventDefault();
            event.stopPropagation();
            enter(event, "arrow-key");
          }
        }}
      />
    );
  } else if (state.multiple) {
    item = (
      <Menu.CheckboxItem
        {...shared}
        checked={checked}
        closeOnClick={closeOnClick ?? false}
        onClick={onClick}
        onKeyDown={onKeyDown}
        onCheckedChange={(next, details) => {
          actions.toggle(node, next, details.event);
        }}
      />
    );
  } else {
    item = (
      <Menu.RadioItem
        // SAFETY: `shared` holds item props plus a state-wrapping className and render; RadioItem's
        // state has the same highlighted, disabled and checked fields the wrappers read.
        // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- the three item kinds share one props object; Base UI types each kind's state separately, though the wrappers read only fields all three provide.
        {...(shared as Omit<Menu.RadioItem.Props, "value">)}
        value={node.value}
        closeOnClick={closeOnClick ?? true}
        onClick={onClick}
        onKeyDown={onKeyDown}
      />
    );
  }

  return <CascaderItemContext value={{ checked, row }}>{item}</CascaderItemContext>;
};

/**
 * The radio or checkbox indicator of a leaf (Base UI's item indicators, kept mounted so styles can
 * animate both states). Renders nothing for a branch.
 */
const CascaderItemIndicator = (
  props: Omit<Menu.CheckboxItemIndicator.Props, "className"> & { className?: string },
) => {
  const { row } = useCascaderItemContext("Cascader.ItemIndicator");
  const { state } = useCascaderContext("Cascader.ItemIndicator");

  if (row.kind === "branch") {
    return null;
  }

  return state.multiple ? (
    <Menu.CheckboxItemIndicator keepMounted {...props} />
  ) : (
    <Menu.RadioItemIndicator keepMounted {...props} />
  );
};

interface CascaderItemTrailProps extends Omit<useRender.ComponentProps<"span">, "children"> {
  /** Replaces the default text, the trail labels joined with " / ". */
  children?: (trail: CascaderNode[]) => React.ReactNode;
}

/** The path from the open level to a search match. Renders nothing for a direct child. */
const CascaderItemTrail = ({ children, render, ...props }: CascaderItemTrailProps) => {
  const { row } = useCascaderItemContext("Cascader.ItemTrail");

  return useRender({
    defaultTagName: "span",
    enabled: row.trail.length > 0,
    props: mergeProps<"span">(
      {
        children:
          children === undefined
            ? row.trail.map((node) => node.label).join(" / ")
            : children(row.trail),
      },
      props,
    ),
    render,
  });
};

interface CascaderItemCountState {
  /** The number shown: selected leaves below once any is selected in a multiple cascader. */
  count: number;
  /** Selected leaves below the branch. */
  selected: number;
  /** The branch's direct children. */
  childCount: number;
  multiple: boolean;
}

interface CascaderItemCountProps extends Omit<useRender.ComponentProps<"span">, "children"> {
  children?: (state: CascaderItemCountState) => React.ReactNode;
  /** Text for screen readers after the visible number. */
  srLabel?: (state: CascaderItemCountState) => string;
}

const defaultSrLabel = ({ childCount, multiple, selected }: CascaderItemCountState) => {
  const amount =
    multiple && selected > 0
      ? `, ${selected} selected`
      : `, ${childCount} ${childCount === 1 ? "option" : "options"}`;

  return !multiple && selected > 0 ? `${amount}, holds the selection` : amount;
};

/**
 * A branch's count: the selected leaves below it in a multiple cascader once any is selected,
 * otherwise its options. Renders nothing for a leaf.
 */
const CascaderItemCount = ({
  children,
  render,
  srLabel = defaultSrLabel,
  ...props
}: CascaderItemCountProps) => {
  const { row } = useCascaderItemContext("Cascader.ItemCount");
  const { selectedCounts, state } = useCascaderContext("Cascader.ItemCount");
  const selected = selectedCounts.get(row.node.value) ?? 0;
  const childCount = row.node.children?.length ?? 0;

  const countState: CascaderItemCountState = {
    childCount,
    count: state.multiple && selected > 0 ? selected : childCount,
    multiple: state.multiple,
    selected,
  };

  return useRender({
    defaultTagName: "span",
    enabled: row.kind === "branch",
    props: mergeProps<"span">(
      {
        children: (
          <>
            <span aria-hidden="true">
              {children === undefined ? countState.count : children(countState)}
            </span>
            {/* oxlint-disable-next-line shadcn/no-inline-styles -- a headless package ships no stylesheet, so screen-reader-only text needs its hiding styles inline; the object is a constant. */}
            <span style={visuallyHidden}>{srLabel(countState)}</span>
          </>
        ),
      },
      props,
    ),
    render,
  });
};

// Clear

/** Clears the selection and refocuses the search. Disabled while nothing is selected. */
const CascaderClear = ({ render, ...props }: useRender.ComponentProps<"button">) => {
  const { actions, state } = useCascaderContext("Cascader.Clear");
  const empty = state.selected.length === 0;

  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        disabled: empty,
        onClick: (event) => {
          actions.clear(event.nativeEvent);
          actions.focusSearch();
        },
        type: "button",
      },
      props,
    ),
    render,
    state: { disabled: empty },
  });
};

// Hook

interface UseCascaderReturnValue {
  state: CascaderState;
  actions: CascaderContextValue["actions"];
  /** Every node by value, with its path from the top. */
  index: CascaderContextValue["index"];
}

/** The cascader's state and actions, for parts the namespace does not cover. */
const useCascader = (): UseCascaderReturnValue => {
  const { actions, index, state } = useCascaderContext("useCascader");

  return { actions, index, state };
};

export {
  CascaderBack,
  CascaderBackItem,
  CascaderClear,
  CascaderEmpty,
  CascaderItem,
  CascaderItemCount,
  CascaderItemIndicator,
  CascaderItemTrail,
  CascaderLevel,
  CascaderLevelLabel,
  CascaderList,
  CascaderRows,
  CascaderSearch,
  CascaderSearchClear,
  CascaderTrigger,
  CascaderValue,
  useCascader,
};

export type {
  CascaderBackProps,
  CascaderItemCountProps,
  CascaderItemCountState,
  CascaderItemProps,
  CascaderItemState,
  CascaderItemTrailProps,
  CascaderRowsProps,
  CascaderSearchProps,
  CascaderValueProps,
  CascaderValueState,
  UseCascaderReturnValue,
};
