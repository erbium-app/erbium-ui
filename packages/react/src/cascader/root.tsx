import * as React from "react";
import { Menu } from "@base-ui/react/menu";
import { createChangeDetails } from "../internal/change-details";
import { useControlledState } from "../internal/use-controlled-state";
import { CascaderContext } from "./context";
import type {
  CascaderActions,
  CascaderContextValue,
  CascaderLevelChangeCause,
  CascaderLevelChangeDetails,
  CascaderLevelChangeReason,
  CascaderValueChangeDetails,
  CascaderValueChangeReason,
} from "./context";
import {
  countSelectedBelow,
  createCascaderIndex,
  createMatch,
  getLevelOf,
  getPathTo,
} from "./tree";
import type { CascaderMatch, CascaderNode, CascaderTreeNode } from "./tree";

interface CascaderRootSharedProps<TNode extends CascaderNode> extends Omit<
  Menu.Root.Props,
  "children" | "defaultValue" | "value"
> {
  /** The option tree. Type `data` on the nodes for what a styled layer renders. */
  items: readonly TNode[];
  children?: React.ReactNode;
  /**
   * Adds a search field that filters the open level and finds options at any depth below it.
   * Changes the keyboard model: level keys are handled by the field.
   */
  searchable?: boolean;
  /** Replaces the search match. Defaults to a locale-aware substring test on label and keywords. */
  filter?: CascaderMatch<TNode>;
  /** The open level as branch values from the top. Controlled. */
  level?: readonly string[];
  /** The open level when uncontrolled. */
  defaultLevel?: readonly string[];
  onLevelChange?: (level: string[], details: CascaderLevelChangeDetails) => void;
  /**
   * On open, a single selection opens the level that holds it; a multiple one opens at the top.
   * Set to `false` to always open at the top.
   */
  revealSelected?: boolean;
  /** Submits each selected value under this name with a surrounding form. */
  name?: string;
  /** The id of the form the hidden inputs belong to, when the cascader is outside it. */
  form?: string;
}

interface CascaderRootSingleProps<
  TNode extends CascaderNode = CascaderNode,
> extends CascaderRootSharedProps<TNode> {
  multiple?: false;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null, details: CascaderValueChangeDetails<TNode>) => void;
}

interface CascaderRootMultipleProps<
  TNode extends CascaderNode = CascaderNode,
> extends CascaderRootSharedProps<TNode> {
  /** Picks any number of leaves. The popup stays open while picking. */
  multiple: true;
  value?: readonly string[];
  defaultValue?: readonly string[];
  onValueChange?: (value: string[], details: CascaderValueChangeDetails<TNode>) => void;
}

type CascaderRootProps<TNode extends CascaderNode = CascaderNode> =
  | CascaderRootSingleProps<TNode>
  | CascaderRootMultipleProps<TNode>;

const toList = (value: string | null): readonly string[] => (value === null ? [] : [value]);

/** The props that differ between single and multiple roots, as one shape. */
const selectionOf = <TNode extends CascaderNode>(props: CascaderRootProps<TNode>) =>
  props.multiple === true
    ? {
        defaultValue: props.defaultValue ?? [],
        onMultipleChange: props.onValueChange,
        onSingleChange: null,
        value: props.value,
      }
    : {
        defaultValue: toList(props.defaultValue ?? null),
        onMultipleChange: null,
        onSingleChange: props.onValueChange,
        value: props.value === undefined ? undefined : toList(props.value),
      };

/**
 * Holds the selection, the open level and the search text, and renders Base UI's `Menu.Root`.
 * Every `Menu.Root` prop passes through.
 */
function CascaderRoot<TNode extends CascaderTreeNode<TNode>>(
  props: CascaderRootProps<TNode>,
): React.JSX.Element;
function CascaderRoot(props: CascaderRootProps): React.JSX.Element;
function CascaderRoot<TNode extends CascaderTreeNode<TNode>>(props: CascaderRootProps<TNode>) {
  const {
    children,
    defaultLevel,
    defaultValue: _defaultValue,
    filter,
    form,
    items,
    level: levelProp,
    multiple: multipleProp,
    name,
    onLevelChange,
    onOpenChange,
    onValueChange: _onValueChange,
    revealSelected = true,
    searchable = false,
    value: _value,
    ...menuProps
  } = props;

  const multiple = multipleProp === true;
  const disabled = menuProps.disabled === true;
  const selection = selectionOf(props);
  const { onMultipleChange, onSingleChange } = selection;
  const index = React.useMemo(() => createCascaderIndex(items), [items]);

  const [selected, setSelected] = useControlledState(selection.value, selection.defaultValue);

  const revealLevel = React.useCallback(
    () => (revealSelected && !multiple ? getLevelOf(index, selected[0]) : []),
    [index, multiple, revealSelected, selected],
  );

  const [level, setLevelState] = useControlledState<readonly string[]>(
    levelProp,
    () => defaultLevel ?? (menuProps.defaultOpen === true ? revealLevel() : []),
  );

  const [query, setQuery] = React.useState("");
  const searchRef = React.useRef<HTMLInputElement | null>(null);

  const registerSearch = React.useCallback((input: HTMLInputElement | null) => {
    searchRef.current = input;
  }, []);

  const { contains } = Menu.useFilter();

  const match = React.useMemo<CascaderMatch>(() => {
    if (filter === undefined) {
      return createMatch(contains);
    }

    return (node, search) =>
      // SAFETY: Rows are built from this root's items, including nodes in nested levels.
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      filter(node as TNode, search);
  }, [contains, filter]);

  const selectedCounts = React.useMemo(
    () => countSelectedBelow(index, selected),
    [index, selected],
  );

  const setLevel = React.useCallback(
    (next: string[], reason: CascaderLevelChangeReason, event?: Event) => {
      const details = createChangeDetails(reason, event);

      onLevelChange?.(next, details);

      if (!details.isCanceled) {
        setLevelState(next);
        setQuery("");
      }
    },
    [onLevelChange, setLevelState],
  );

  const actions = React.useMemo<CascaderActions>(() => {
    const commit = (
      next: readonly string[],
      reason: CascaderValueChangeReason,
      node: CascaderNode | null,
      event: Event | undefined,
    ) => {
      const entry = node === null ? undefined : index.get(node.value);

      const details: CascaderValueChangeDetails<TNode> = createChangeDetails(reason, event, {
        node: entry?.node ?? null,
        path: entry?.path ?? [],
      });

      onMultipleChange?.([...next], details);
      onSingleChange?.(next[0] ?? null, details);

      if (!details.isCanceled) {
        setSelected(next);
      }
    };

    return {
      back: ({ reason = "back-press", event }: CascaderLevelChangeCause = {}) => {
        if (level.length > 0) {
          setLevel(level.slice(0, -1), reason, event);
        }
      },
      clear: (event) => {
        if (selected.length > 0) {
          commit([], "clear-press", null, event);
        }
      },
      clearSearch: () => {
        setQuery("");
      },
      // A search match can sit deeper than the open level, so its whole path opens.
      enter: (node, { reason = "branch-press", event }: CascaderLevelChangeCause = {}) => {
        if (node.children !== undefined && node.disabled !== true) {
          setLevel(getPathTo(index, node.value), reason, event);
        }
      },
      focusSearch: () => {
        const input = searchRef.current;

        if (input === null || input.disabled) {
          return false;
        }

        input.focus();

        return true;
      },
      select: (node, event) => {
        if (selected[0] !== node.value || selected.length !== 1) {
          commit([node.value], "item-press", node, event);
        }
      },
      toggle: (node, checked, event) => {
        const rest = selected.filter((current) => current !== node.value);

        commit(checked ? [...rest, node.value] : rest, "item-press", node, event);
      },
    };
  }, [index, level, onMultipleChange, onSingleChange, selected, setLevel, setSelected]);

  const levelNode = index.get(level.at(-1) ?? "")?.node ?? null;
  const parentNode = index.get(level.at(-2) ?? "")?.node ?? null;

  const context = React.useMemo<CascaderContextValue>(
    () => ({
      actions,
      index,
      items,
      match,
      registerSearch,
      selectedCounts,
      state: { disabled, level, levelNode, multiple, parentNode, query, searchable, selected },
    }),
    [
      actions,
      disabled,
      index,
      items,
      level,
      levelNode,
      match,
      multiple,
      parentNode,
      query,
      registerSearch,
      searchable,
      selected,
      selectedCounts,
    ],
  );

  const handleOpenChange: Menu.Root.Props["onOpenChange"] = (open, details) => {
    onOpenChange?.(open, details);

    if (open && !details.isCanceled) {
      setLevel(revealLevel(), "open", details.event);
    }
  };

  const menu = (
    <Menu.Root {...menuProps} onOpenChange={handleOpenChange}>
      {children}
    </Menu.Root>
  );

  return (
    <CascaderContext value={context}>
      {searchable ? (
        <Menu.FilterProvider filter={null} autoHighlight value={query} onValueChange={setQuery}>
          {menu}
        </Menu.FilterProvider>
      ) : (
        menu
      )}
      {name === undefined
        ? null
        : selected.map((selectedValue) => (
            <input
              key={selectedValue}
              type="hidden"
              name={name}
              form={form}
              value={selectedValue}
              disabled={disabled}
            />
          ))}
    </CascaderContext>
  );
}

export { CascaderRoot };

export type { CascaderRootMultipleProps, CascaderRootProps, CascaderRootSingleProps };
