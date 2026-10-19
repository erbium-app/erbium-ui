import { documentationSections } from "@erbium/content/taxonomy";
import components from "virtual:docs-navigation";

export { components };

export const guides = [
  { file: "introduction", href: "/", section: "Overview", title: "Introduction" },
  { file: "roadmap", href: "/docs/roadmap", section: "Overview", title: "Roadmap" },
  { file: "installation", href: "/docs/installation", section: "Guides", title: "Installation" },
  {
    file: "getting-started",
    href: "/docs/getting-started",
    section: "Guides",
    title: "Using components",
  },
  { file: "shimmer", href: "/docs/utilities/shimmer", section: "Utilities", title: "Shimmer" },
];

export const pages = [...guides, ...components];

export const navigationGroups = [
  "Overview",
  "Guides",
  ...documentationSections.map((section) => section.title),
].map((title) => ({
  items: pages
    .filter((page) => page.section === title)
    .sort((a, b) => a.title.localeCompare(b.title)),
  title,
}));
