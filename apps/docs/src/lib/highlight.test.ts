// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import { rehypeHighlightCodeBlocks } from "@tanstack/highlight/rehype";
import { highlighter, highlightSource } from "./highlight.ts";

describe("documentation highlighting", () => {
  it("preserves exact copy text and escapes executable markup in source panels", () => {
    const source = 'const node = <Button title="<script>alert(1)</script>">Hello</Button>;\n\n';
    const document = new DOMParser().parseFromString(
      `<pre><code>${highlightSource(source, "example.tsx")}</code></pre>`,
      "text/html",
    );
    expect(document.querySelector("code")?.textContent).toBe(source);
    expect(document.querySelector("script")).toBeNull();
    expect(document.querySelector(".th-tag")?.textContent).toBe("Button");
    const unknown = new DOMParser().parseFromString(
      `<code>${highlightSource("<script>alert(1)</script>", "unknown.xyz")}</code>`,
      "text/html",
    );
    expect(unknown.querySelector("script")).toBeNull();
    expect(unknown.querySelector("code")?.textContent).toBe("<script>alert(1)</script>");
  });

  it("highlights Markdown fences through Astro without Shiki markup", async () => {
    const processor = await createMarkdownProcessor({
      syntaxHighlight: false,
      rehypePlugins: [
        () => {
          const transform = rehypeHighlightCodeBlocks({ highlighter });
          return (tree) => transform(tree as Parameters<typeof transform>[0]);
        },
      ],
    });
    const result = await processor.render(
      "```tsx\nconst node = <Button />;\n```\n\n```sh\nbun add example\n```",
    );
    const document = new DOMParser().parseFromString(result.code, "text/html");
    expect(document.querySelectorAll("pre.th-code")).toHaveLength(2);
    expect(document.querySelector(".th-keyword")?.textContent).toBe("const");
    expect(document.querySelector(".th-tag")?.textContent).toBe("Button");
    expect(document.querySelector(".astro-code")).toBeNull();
    expect(document.querySelector("[style]")).toBeNull();
  });
});
