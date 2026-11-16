import { documentationSections } from "@erbium/content/taxonomy";
import { components, guides } from "virtual:docs-catalog";

export { components, guides } from "virtual:docs-catalog";

export const pages = [...guides, ...components];

const pagesIn = (title: string) => pages.filter((page) => page.section === title);

// Overview and Guides keep the reading order declared in content-plugin.ts;
// component sections are alphabetical.
export const navigationGroups = [
  ...["Overview", "Guides"].map((title) => ({ items: pagesIn(title), title })),
  ...documentationSections.map(({ title }) => ({
    items: pagesIn(title).toSorted((a, b) => a.title.localeCompare(b.title)),
    title,
  })),
];
