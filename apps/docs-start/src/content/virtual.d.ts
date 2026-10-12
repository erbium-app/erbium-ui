declare module "virtual:docs-pages" {
  const documents: Record<string, import("@/build/content/pages").DocPage>;
  export default documents;
}
