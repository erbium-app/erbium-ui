import * as React from "react";
import type { ChangeDetails } from "../internal/change-details";
import { missingContext } from "../internal/dom";
import type { CascaderIndex, CascaderMatch, CascaderNode, CascaderRow } from "./tree";

type CascaderValueChangeReason = "item-press" | "clear-press";

/** Why the open level changed. */
type CascaderLevelChangeReason =
  | "branch-press"
  | "back-press"
  | "arrow-key"
  | "backspace-key"
  | "open";

type CascaderValueChangeDetails<TNode extends CascaderNode = CascaderNode> = ChangeDetails<
  CascaderValueChangeReason,
  {
    /** The leaf that was picked or toggled, or `null` when the selection was cleared. */
    node: TNode | null;
    /** The leaf's ancestors and the leaf itself, root first. Empty when cleared. */
    path: TNode[];
  }
>;

type CascaderLevelChangeDetails = ChangeDetails<CascaderLevelChangeReason>;

/** What a level change reports: its reason and the DOM event behind it. */
interface CascaderLevelChangeCause {
  reason?: CascaderLevelChangeReason;
  event?: Event;
}

interface CascaderState<TNode extends CascaderNode = CascaderNode> {
  multiple: boolean;
  /** Selected leaf values, in selection order. */
  selected: readonly string[];
  /** Branch values from the top to the open level. Empty at the top level. */
  level: readonly string[];
  /** The branch whose children are on screen, or `null` at the top level. */
  levelNode: TNode | null;
  /** The branch above the open level, or `null` at or one below the top. */
  parentNode: TNode | null;
  /** The search text of the open level. */
  query: string;
  searchable: boolean;
  disabled: boolean;
}

interface CascaderActions {
  /** Selects a leaf in a single cascader. */
  select: (node: CascaderNode, event?: Event) => void;
  /** Checks or unchecks a leaf in a multiple cascader. */
  toggle: (node: CascaderNode, checked: boolean, event?: Event) => void;
  clear: (event?: Event) => void;
  /** Opens a branch's level, with its ancestors, in place of the current one. */
  enter: (node: CascaderNode, cause?: CascaderLevelChangeCause) => void;
  /** Returns to the parent level. */
  back: (cause?: CascaderLevelChangeCause) => void;
  /** Moves focus to the search field, when there is one. */
  focusSearch: () => boolean;
}

interface CascaderContextValue<TNode extends CascaderNode = CascaderNode> {
  state: CascaderState<TNode>;
  actions: CascaderActions;
  index: CascaderIndex<TNode>;
  items: readonly TNode[];
  match: CascaderMatch<TNode>;
  /** Selected leaves below each branch. */
  selectedCounts: ReadonlyMap<string, number>;
  /** Registers the search field, which keeps focus while levels change. */
  registerSearch: (input: HTMLInputElement | null) => void;
}

const CascaderContext = React.createContext<CascaderContextValue | null>(null);

const useCascaderContext = <TNode extends CascaderNode = CascaderNode>(part: string) =>
  // SAFETY: Callers use the same node type for the root and its typed parts.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  (React.use(CascaderContext) as CascaderContextValue<TNode> | null) ??
  missingContext(part, "<Cascader.Root>");

interface CascaderItemContextValue {
  row: CascaderRow;
  checked: boolean;
}

const CascaderItemContext = React.createContext<CascaderItemContextValue | null>(null);

const useCascaderItemContext = (part: string) =>
  React.use(CascaderItemContext) ?? missingContext(part, "<Cascader.Item>");

export { CascaderContext, CascaderItemContext, useCascaderContext, useCascaderItemContext };

export type {
  CascaderActions,
  CascaderContextValue,
  CascaderItemContextValue,
  CascaderLevelChangeCause,
  CascaderLevelChangeDetails,
  CascaderLevelChangeReason,
  CascaderState,
  CascaderValueChangeDetails,
  CascaderValueChangeReason,
};
