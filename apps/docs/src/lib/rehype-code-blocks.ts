import { codeBlockStyles } from "./docs-styles";

interface HtmlNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HtmlNode[];
}

// Keep highlighted Markdown static, using the same shell as CodeBlock.astro.
export function rehypeCodeBlocks() {
  return (tree: HtmlNode) => {
    function wrapCodeBlocks(node: HtmlNode) {
      node.children = node.children?.map((child) => {
        if (child.tagName === "pre" && child.children?.some((item) => item.tagName === "code")) {
          return {
            type: "element",
            tagName: "docs-code-block",
            properties: { className: codeBlockStyles.split(" ") },
            children: [child],
          };
        }
        wrapCodeBlocks(child);
        return child;
      });
    }
    wrapCodeBlocks(tree);
  };
}
