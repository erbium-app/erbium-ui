import { documentationSections } from "@erbium/content/taxonomy";
import components from "virtual:docs-navigation";
export { components };
export const guides = [
  { href: "/", file: "introduction", title: "Introduction", section: "Overview" },
  { href: "/docs/roadmap", file: "roadmap", title: "Roadmap", section: "Overview" },
  { href: "/docs/installation", file: "installation", title: "Installation", section: "Guides" },
  {
    href: "/docs/getting-started",
    file: "getting-started",
    title: "Using components",
    section: "Guides",
  },
  { href: "/docs/utilities/shimmer", file: "shimmer", title: "Shimmer", section: "Utilities" },
];
export const pages = [...guides, ...components];
export const navigationGroups = [
  "Overview",
  "Guides",
  ...documentationSections.map((section) => section.title),
].map((title) => ({
  title,
  items: pages
    .filter((page) => page.section === title)
    .sort((a, b) => a.title.localeCompare(b.title)),
}));
