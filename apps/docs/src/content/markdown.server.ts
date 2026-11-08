import GithubSlugger from "github-slugger";
import { parseMarkdown } from "@tanstack/markdown/parser";
import { collectMarkdownHeadings } from "@tanstack/markdown/extensions/headings";
import { autolinksExtension } from "@tanstack/markdown/extensions/autolinks";
import type { MarkdownDocument } from "@tanstack/markdown";

export const compileMarkdown = (markdown: string) => {
  const slugger = new GithubSlugger();

  return parseMarkdown(markdown, {
    extensions: [autolinksExtension()],
    headingIds: (text) => slugger.slug(text),
  });
};

export const headingsFor = (document: MarkdownDocument) =>
  collectMarkdownHeadings(document)
    .filter((heading) => heading.level === 2 || heading.level === 3)
    .map((heading) => ({ depth: heading.level, id: heading.id, title: heading.text }));
