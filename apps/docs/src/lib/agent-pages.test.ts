import { describe, expect, it, vi } from "vite-plus/test";
import { parseFrontmatter } from "@astrojs/markdown-remark";
import manifest from "@erbium/showcase/manifest";
import { showcaseSource } from "@erbium/showcase/sources";
import { components } from "../data/components";
import { agentPages, llmsFull, llmsIndex, markdownPath, pageIndex } from "./agent-pages";

vi.mock("@erbium/content/documents", () => {
  const raw = import.meta.glob<string>("../../../../packages/content/components/*/index.md", {
    eager: true,
    query: "?raw",
    import: "default",
  });
  return {
    componentDocuments: Object.fromEntries(
      Object.entries(raw).map(([path, source]) => {
        return [
          path.replace("../../../../packages/content/", "../"),
          { frontmatter: parseFrontmatter(source).frontmatter },
        ];
      }),
    ),
  };
});

describe("agent documentation", () => {
  it("publishes unique mirrors for all canonical pages", () => {
    expect(agentPages).toHaveLength(89);
    expect(new Set(agentPages.map((page) => page.route)).size).toBe(agentPages.length);
    expect(markdownPath("/")).toBe("/index.md");
    for (const entry of pageIndex) {
      expect(llmsIndex).toContain(entry.markdownUrl);
      expect(llmsFull).toContain(`Source: ${entry.url}`);
    }
  });
  it("includes every variant description and exact example source", () => {
    for (const catalog of manifest) {
      const component = components.find((item) => item.name === catalog.name)!;
      const page = agentPages.find((entry) => entry.route === component.href)!;
      for (const variant of catalog.variants) {
        expect(page.markdown).toContain(`## ${variant.title}`);
        expect(page.markdown).toContain(showcaseSource(variant.source));
      }
      for (const file of component.files ?? [])
        expect(page.markdown).toContain(`packages/ui/${file.path}`);
    }
  });
  it("uses canonical absolute links for guides", () => {
    const introduction = agentPages.find((entry) => entry.route === "/docs")!;
    expect(introduction.markdown).toContain("https://ui.erbium.app/docs/utilities/scroll-fade");
    expect(introduction.markdown).not.toContain("](/docs/");
  });
});
