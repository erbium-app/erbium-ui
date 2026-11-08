import { documentationSections } from "@erbium/content/taxonomy";
import { components, guides } from "virtual:docs-catalog";

export { components, guides } from "virtual:docs-catalog";

export const pages = [...guides, ...components];

export const navigationGroups = [
  "Overview",
  "Guides",
  ...documentationSections.map((section) => section.title),
].map((title) => ({
  items: pages
    .filter((page) => page.section === title)
    .toSorted((a, b) => a.title.localeCompare(b.title)),
  title,
}));
