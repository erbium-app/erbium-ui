import ArrowUpRight01Icon from "@hugeicons/core-free-icons/ArrowUpRight01Icon";

interface HtmlNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HtmlNode[];
}

const site = "https://ui.erbium.app";

function externalIcon(): HtmlNode {
  return {
    type: "element",
    tagName: "svg",
    properties: {
      xmlns: "http://www.w3.org/2000/svg",
      width: 14,
      height: 14,
      viewBox: "0 0 24 24",
      fill: "none",
      ariaHidden: "true",
      className: ["external-link-icon"],
    },
    children: ArrowUpRight01Icon.map(([tagName, attributes]) => ({
      type: "element",
      tagName,
      properties: Object.fromEntries(
        Object.entries(attributes)
          .filter(([key]) => key !== "key")
          .map(([key, value]) => [key, key === "strokeWidth" ? 1.5 : value]),
      ),
      children: [],
    })),
  };
}

// Emit complete external links while compiling Markdown, before HTML reaches the browser.
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
          node.children ??= [];
          node.children.push(externalIcon());
        }
      }
      for (const child of node.children ?? []) renderLinks(child);
    }
    renderLinks(tree);
  };
}
