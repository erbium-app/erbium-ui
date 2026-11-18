/*
 * The cascader's data model, without React. A cascader shows one level of an option tree at a
 * time; these functions index the tree, list the rows of a level (or its search matches at any
 * depth), and find where the selection sits. Safe to import on a server.
 */

/** One option. A node with `children` is a branch that opens a level; a node without is a leaf. */
interface CascaderNode<TData = unknown> {
  /** Unique across the whole tree. A leaf's value is what gets selected. */
  value: string;
  /** Text for search, typeahead, and the default value display. */
  label: string;
  /** Extra terms the search matches alongside the label. */
  keywords?: readonly string[];
  /** Keeps the node visible but unselectable. A disabled branch cannot be opened. */
  disabled?: boolean;
  /** Nodes of the next level. */
  children?: readonly CascaderNode<TData>[];
  /** Anything a styled layer renders with the node, such as an icon or a description. */
  data?: TData;
}

interface CascaderEntry<TNode extends CascaderNode> {
  node: TNode;
  /** The node's ancestors and the node itself, root first. */
  path: TNode[];
}

type CascaderIndex<TNode extends CascaderNode = CascaderNode> = ReadonlyMap<
  string,
  CascaderEntry<TNode>
>;

/** A node type whose descendants use the same shape. */
type CascaderTreeNode<TNode> = CascaderNode & { children?: readonly TNode[] };

/** One row of the open level. */
interface CascaderRow<TNode extends CascaderNode = CascaderNode> {
  node: TNode;
  /** Whether the row picks a value or opens a level. */
  kind: "leaf" | "branch";
  /** Ancestors between the open level and a search match, root first. Empty for direct children. */
  trail: TNode[];
}

type CascaderMatch<TNode extends CascaderNode = CascaderNode> = (
  node: TNode,
  query: string,
) => boolean;

const noNodes: readonly never[] = [];

const isBranch = (node: CascaderNode) => node.children !== undefined;

/** Indexes every node by value in one pass. When two nodes share a value, the first one wins. */
const createCascaderIndex = <TNode extends CascaderTreeNode<TNode>>(
  items: readonly TNode[],
): CascaderIndex<TNode> => {
  const index = new Map<string, CascaderEntry<TNode>>();

  const visit = (nodes: readonly TNode[], ancestors: TNode[]) => {
    for (const node of nodes) {
      if (!index.has(node.value)) {
        const path = [...ancestors, node];

        index.set(node.value, { node, path });
        visit(node.children ?? noNodes, path);
      }
    }
  };

  visit(items, []);

  return index;
};

const toRow = <TNode extends CascaderNode>(node: TNode, trail: TNode[]): CascaderRow<TNode> => ({
  kind: isBranch(node) ? "branch" : "leaf",
  node,
  trail,
});

/**
 * The rows of a level. Without a query they are the level's nodes; with one, every node at any
 * depth below the level that matches, each with the trail that leads to it.
 */
const getLevelRows = <TNode extends CascaderTreeNode<TNode>>(
  nodes: readonly TNode[],
  query: string,
  match: CascaderMatch<TNode>,
): CascaderRow<TNode>[] => {
  if (query === "") {
    return nodes.map((node) => toRow(node, []));
  }

  const rows: CascaderRow<TNode>[] = [];

  const visit = (level: readonly TNode[], trail: TNode[]) => {
    for (const node of level) {
      if (match(node, query)) {
        rows.push(toRow(node, trail));
      }

      if (node.children !== undefined) {
        visit(node.children, [...trail, node]);
      }
    }
  };

  visit(nodes, []);

  return rows;
};

/** How many selected leaves sit below each branch, keyed by the branch's value. */
const countSelectedBelow = <TNode extends CascaderNode>(
  index: CascaderIndex<TNode>,
  selected: readonly string[],
): Map<string, number> => {
  const counts = new Map<string, number>();

  for (const value of selected) {
    for (const ancestor of index.get(value)?.path.slice(0, -1) ?? noNodes) {
      counts.set(ancestor.value, (counts.get(ancestor.value) ?? 0) + 1);
    }
  }

  return counts;
};

/** The branch values from the top to the level that holds `value`, or none at the top level. */
const getLevelOf = <TNode extends CascaderNode>(
  index: CascaderIndex<TNode>,
  value: string | undefined,
): string[] => {
  const path = value === undefined ? undefined : index.get(value)?.path;

  return path === undefined ? [] : path.slice(0, -1).map((node) => node.value);
};

/** The branch values from the top down to and including `value`, to open that branch's level. */
const getPathTo = <TNode extends CascaderNode>(
  index: CascaderIndex<TNode>,
  value: string,
): string[] => index.get(value)?.path.map((node) => node.value) ?? [value];

/** A matcher from a text test: a node matches on its label or any keyword. */
const createMatch =
  <TNode extends CascaderNode>(
    contains: (text: string, query: string) => boolean,
  ): CascaderMatch<TNode> =>
  (node, query) =>
    contains(node.label, query) ||
    (node.keywords?.some((keyword) => contains(keyword, query)) ?? false);

export {
  countSelectedBelow,
  createCascaderIndex,
  createMatch,
  getLevelOf,
  getLevelRows,
  getPathTo,
  isBranch,
};

export type {
  CascaderEntry,
  CascaderIndex,
  CascaderMatch,
  CascaderNode,
  CascaderRow,
  CascaderTreeNode,
};
