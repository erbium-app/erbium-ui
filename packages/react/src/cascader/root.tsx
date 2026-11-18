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
import type { CascaderMatch, CascaderNode } from "./tree";

interface CascaderRootSharedProps extends Omit<
  Menu.Root.Props,
  "children" | "defaultValue" | "value"
> {
  /** The option tree. Type `data` on the nodes for what a styled layer renders. */
  items: readonly CascaderNode[];
  children?: React.ReactNode;
  /**
   * Adds a search field that filters the open level and finds options at any depth below it.
   * Changes the keyboard model: level keys are handled by the field.
   */
  searchable?: boolean;
  /** Replaces the search match. Defaults to a locale-aware substring test on label and keywords. */
  filter?: CascaderMatch;
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

interface CascaderRootSingleProps extends CascaderRootSharedProps {
  multiple?: false;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null, details: CascaderValueChangeDetails) => void;
}

interface CascaderRootMultipleProps extends CascaderRootSharedProps {
  /** Picks any number of leaves. The popup stays open while picking. */
  multiple: true;
  value?: readonly string[];
  defaultValue?: readonly string[];
  onValueChange?: (value: string[], details: CascaderValueChangeDetails) => void;
}

type CascaderRootProps = CascaderRootSingleProps | CascaderRootMultipleProps;

const toList = (value: string | null): readonly string[] => (value === null ? [] : [value]);

/** The props that differ between single and multiple roots, as one shape. */
const selectionOf = (props: CascaderRootProps) =>
  props.multiple === true
    ? {
        defaultValue: props.defaultValue ?? [],
        onMultipleChange: props.onValueChange,
        onSingleChange: undefined,
        value: props.value,
      }
    : {
        defaultValue: toList(props.defaultValue ?? null),
        onMultipleChange: undefined,
        onSingleChange: props.onValueChange,
        value: props.value === undefined ? undefined : toList(props.value),
      };

/**
 * Holds the selection, the open level and the search text, and renders Base UI's `Menu.Root`.
 * Every `Menu.Root` prop passes through.
 */
const CascaderRoot = (props: CascaderRootProps) => {
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
  const match = React.useMemo(() => filter ?? createMatch(contains), [contains, filter]);

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
      const details: CascaderValueChangeDetails = createChangeDetails(reason, event, {
        node,
        path: node === null ? [] : (index.get(node.value)?.path ?? [node]),
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
      // A search match can sit deeper than the open level, so its whole path opens.
      enter: (node, { reason = "branch-press", event }: CascaderLevelChangeCause = {}) => {
        if (node.children !== undefined && node.disabled !== true) {
          setLevel(getPathTo(index, node.value), reason, event);
        }
      },
      focusSearch: () => {
        searchRef.current?.focus();
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
};

export { CascaderRoot };

export type { CascaderRootMultipleProps, CascaderRootProps, CascaderRootSingleProps };
