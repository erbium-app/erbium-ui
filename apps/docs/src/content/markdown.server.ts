import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import type { Root, Element, RootContent } from "hast";

const processor = unified().use(remarkParse).use(remarkGfm).use(remarkRehype).use(rehypeSlug);

export function compileMarkdown(markdown: string) {
  const tree = processor.runSync(processor.parse(markdown));

  function stripPositions(node: Root | Element) {
    delete node.position;

    for (const child of node.children) {
      delete child.position;

      if (child.type === "element") {
        stripPositions(child);
      }
    }
  }

  stripPositions(tree);

  return JSON.stringify(tree);
}

function nodeText(node: RootContent): string {
  if (node.type === "text") {
    return node.value;
  }

  return "children" in node ? node.children.map(nodeText).join("") : "";
}

export function headingsFor(serialized: string) {
  const tree: Root = JSON.parse(serialized);
  const headings: { id: string; title: string; depth: number }[] = [];

  function visit(node: Root | Element) {
    for (const child of node.children) {
      if (child.type !== "element") {
        continue;
      }

      if (child.tagName === "h2" || child.tagName === "h3") {
        headings.push({
          depth: Number(child.tagName.slice(1)),
          id: String(child.properties.id),
          title: nodeText(child),
        });
      }

      visit(child);
    }
  }

  visit(tree);

  return headings;
}
