interface HtmlNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HtmlNode[];
}

const site = "https://ui.erbium.app";

// Set external-link attributes while compiling Markdown without changing link content.
export function rehypeExternalLinks() {
  return (tree: HtmlNode) => {
    function renderLinks(node: HtmlNode) {
      if (node.tagName === "a" && typeof node.properties?.href === "string") {
        const url = new URL(node.properties.href, site);
        if (["http:", "https:"].includes(url.protocol) && url.origin !== site) {
          node.properties.target = "_blank";
          const rel = node.properties.rel;
          node.properties.rel = [
            ...new Set([
              ...(Array.isArray(rel) ? rel : typeof rel === "string" ? rel.split(/\s+/) : []),
              "noopener",
              "noreferrer",
            ]),
          ];
        }
      }
      for (const child of node.children ?? []) renderLinks(child);
    }
    renderLinks(tree);
  };
}
