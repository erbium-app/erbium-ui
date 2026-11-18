declare module "virtual:docs-pages" {
  import type { DocPage } from "@/content/types";

  const documents: Record<string, () => Promise<{ default: DocPage }>>;
  export default documents;
}

declare module "virtual:docs-examples" {
  import type { ShowcaseStory } from "@erbium/showcase/catalog";

  const examples: Record<
    string,
    () => Promise<{ default: Record<string, ShowcaseStory["render"]> }>
  >;

  export default examples;
}

declare module "virtual:docs-example-preloads" {
  const preloads: Record<string, string[]>;
  export default preloads;
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
    /** The page's Markdown file under packages/content, without its extension. */
    file: string;
    files: { path: string }[];
  })[];

  export const guides: (CatalogPage & {
    file: string;
    example?: { name: string; slug: string };
  })[];
}
