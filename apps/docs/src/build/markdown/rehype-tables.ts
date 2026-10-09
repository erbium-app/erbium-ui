interface HtmlNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HtmlNode[];
}

// The wrapper owns overflow; tables keep their native layout and semantics.
export function rehypeTables() {
  return (tree: HtmlNode) => {
    function wrapTables(node: HtmlNode) {
      const classes = node.properties?.className;
      const ownsScroll = Array.isArray(classes) && classes.includes("typeset-scroll");
      node.children = node.children?.map((child) => {
        if (child.tagName === "table" && !ownsScroll) {
          return {
            type: "element",
            tagName: "div",
            properties: {
              className: ["typeset-scroll", "docs-table-scroll"],
              tabIndex: 0,
              role: "region",
              ariaLabel: "Scrollable table",
            },
            children: [child],
          };
        }
        wrapTables(child);
        return child;
      });
    }
    wrapTables(tree);
  };
}
