import { componentDocuments } from "@erbium/content/documents";
import manifest from "@erbium/showcase/manifest";
import registry from "../../../../packages/ui/registry.json";

type ComponentEntry = {
  name: string;
  title: string;
  description: string;
  files?: Array<{ path: string }>;
};

const pages = componentDocuments as Record<
  string,
  import("astro").MarkdownInstance<{ title: string; description: string }>
>;

export const components = manifest.map((entry) => {
  const item = (registry.items as ComponentEntry[]).find((item) => item.name === entry.name) ?? {
    name: entry.name,
    title: entry.title,
    description: "",
  };
  const page = pages[`../components/${item.name}/index.md`];
  if (!page) throw new Error(`Missing documentation for ${item.name}`);
  return { ...item, title: page.frontmatter.title, description: page.frontmatter.description };
});

export const componentGroups = [
  { label: "Foundations", names: ["button", "badge", "card", "separator", "skeleton"] },
  {
    label: "Forms",
    names: [
      "input",
      "textarea",
      "checkbox",
      "radio-group",
      "select",
      "autocomplete",
      "switch",
      "slider",
    ],
  },
  {
    label: "Navigation",
    names: ["breadcrumb", "pagination", "tabs", "menubar", "navigation-menu"],
  },
  { label: "Overlays", names: ["dialog", "alert-dialog", "popover", "tooltip", "sheet", "drawer"] },
  {
    label: "Data display",
    names: ["table", "avatar", "calendar", "carousel", "chart", "progress"],
  },
];
