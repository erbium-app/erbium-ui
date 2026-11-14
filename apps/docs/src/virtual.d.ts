declare module "virtual:docs-pages" {
  import type { DocPage } from "@/content/types";

  const documents: Record<string, () => Promise<{ default: DocPage }>>;
  export default documents;
}

// Mirrors `docsCatalog()` in content-plugin.ts.
declare module "virtual:docs-catalog" {
  import type { DocumentationKind } from "@erbium/content/taxonomy";

  interface CatalogPage {
    title: string;
    description: string;
    section: string;
    href: string;
  }

  export const releases: {
    changed: Record<string, number[] | undefined>;
    version: string | null;
    builtOn: number;
  };
  export const changelogMarkdown: string;

  export const components: (CatalogPage & {
    name: string;
    kind: DocumentationKind;
    files: { path: string }[];
  })[];

  export const guides: (CatalogPage & {
    file: string;
    example?: { name: string; slug: string };
  })[];
}
