import sections from "./sections.json";

export type DocumentationKind =
  | "block"
  | "foundation"
  | "component"
  | "provider"
  | "utility"
  | "hook";

type DocumentationSection = {
  title: string;
  slug: string;
  kind: DocumentationKind;
  names: string[];
};

export const documentationSections = sections as DocumentationSection[];
export const kindPaths: Record<DocumentationKind, string> = {
  block: "blocks",
  foundation: "foundations",
  component: "components",
  provider: "providers",
  utility: "utilities",
  hook: "hooks",
};
export const kindTitles: Record<DocumentationKind, string> = {
  block: "Blocks",
  foundation: "Foundations",
  component: "Components",
  provider: "Providers",
  utility: "Utilities",
  hook: "Hooks",
};
