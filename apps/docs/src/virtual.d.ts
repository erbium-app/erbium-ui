declare module "virtual:docs-pages" {
  import type { DocPage } from "@/content/types";

  const documents: Record<string, () => Promise<{ default: DocPage }>>;
  export default documents;
}

declare module "virtual:docs-navigation" {
  import type { DocumentationKind } from "@erbium/content/taxonomy";

  const components: {
    name: string;
    title: string;
    description: string;
    kind: DocumentationKind;
    section: string;
    href: string;
    files: { path: string }[];
  }[];

  export default components;
}
