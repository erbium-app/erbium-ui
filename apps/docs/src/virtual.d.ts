declare module "virtual:docs-preview-loaders" {
  type PreviewModule = { default: import("@erbium/showcase/catalog").ShowcaseStory["render"] };
  const groups: Record<
    string,
    () => Promise<{ default: Record<string, () => Promise<PreviewModule>> }>
  >;
  export default groups;
}
