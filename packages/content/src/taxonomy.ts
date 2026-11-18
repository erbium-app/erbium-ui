import sections from "./sections.json" with { type: "json" };

export type DocumentationKind =
  | "block"
  | "chart"
  | "foundation"
  | "component"
  | "provider"
  | "utility"
  | "hook"
  | "primitive";

interface DocumentationSection {
  title: string;
  slug: string;
  kind: DocumentationKind;
  names: string[];
}

export const kindPaths: Record<DocumentationKind, string> = {
  block: "blocks",
  chart: "charts",
  component: "components",
  foundation: "foundations",
  hook: "hooks",
  primitive: "react",
  provider: "providers",
  utility: "utilities",
};

const isDocumentationKind = (value: string): value is DocumentationKind =>
  Object.hasOwn(kindPaths, value);

export const documentationSections: DocumentationSection[] = sections.map((section) => {
  const { kind } = section;

  if (!isDocumentationKind(kind)) {
    throw new Error(`Unknown documentation kind "${kind}" in section "${section.title}"`);
  }

  return { ...section, kind };
});

export const kindTitles: Record<DocumentationKind, string> = {
  block: "Blocks",
  chart: "Charts",
  component: "Components",
  foundation: "Foundations",
  hook: "Hooks",
  primitive: "React",
  provider: "Providers",
  utility: "Utilities",
};

/**
 * The Markdown file of a documentation page, without its extension. Pages of the styled
 * components live in their own folders with example pages beside them; @erbium-ui/react pages
 * document code and API only, one file each.
 */
export const documentFile = (kind: DocumentationKind, name: string) =>
  kind === "primitive" ? `react/${name}` : `components/${name}/index`;
