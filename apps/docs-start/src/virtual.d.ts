declare module "virtual:docs-navigation" {
  const components: Array<{
    name: string;
    title: string;
    description: string;
    kind: import("@erbium/content/taxonomy").DocumentationKind;
    section: string;
    href: string;
    files: Array<{ path: string }>;
  }>;
  export default components;
}

declare module "virtual:docs-preview-loaders" {
  type PreviewModule = { default: import("@erbium/showcase/catalog").ShowcaseStory["render"] };
  const groups: Record<
    string,
    () => Promise<{ default: Record<string, () => Promise<PreviewModule>> }>
  >;
  export default groups;
}
