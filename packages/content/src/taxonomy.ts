import sections from "./sections.json";

export type DocumentationKind =
  | "block"
  | "foundation"
  | "component"
  | "provider"
  | "utility"
  | "hook";

interface DocumentationSection {
  title: string;
  slug: string;
  kind: DocumentationKind;
  names: string[];
}

export const documentationSections = sections as DocumentationSection[];

export const kindPaths: Record<DocumentationKind, string> = {
  block: "blocks",
  component: "components",
  foundation: "foundations",
  hook: "hooks",
  provider: "providers",
  utility: "utilities",
};

export const kindTitles: Record<DocumentationKind, string> = {
  block: "Blocks",
  component: "Components",
  foundation: "Foundations",
  hook: "Hooks",
  provider: "Providers",
  utility: "Utilities",
};
