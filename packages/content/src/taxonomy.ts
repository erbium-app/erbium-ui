import sections from "./sections.json" with { type: "json" };

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

export const kindPaths: Record<DocumentationKind, string> = {
  block: "blocks",
  component: "components",
  foundation: "foundations",
  hook: "hooks",
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
  component: "Components",
  foundation: "Foundations",
  hook: "Hooks",
  provider: "Providers",
  utility: "Utilities",
};
