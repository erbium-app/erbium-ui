import documents from "virtual:docs-pages";
import { preloadExamples } from "@/components/preview-resources";

// Vite splits each compiled document into its own asset. Router owns preloading
// and caching; both SSR and client navigation use this same loader.
export const getDocPage = async (path: string) => {
  const load = Object.hasOwn(documents, path) ? documents[path] : undefined;

  if (!load) {
    return null;
  }

  const { default: page } = await load();

  // Example chunks load with the page so previews render with it, both in the
  // prerendered HTML and on client navigation, instead of after hydration.
  await preloadExamples(
    page.name,
    page.variants.map((variant) => variant.slug),
  );

  return page;
};
