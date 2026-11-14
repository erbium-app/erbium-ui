import { createIsomorphicFn } from "@tanstack/react-start";
import documents from "virtual:docs-pages";
import { preloadExamples } from "@/components/preview-resources";
import type { DocPage } from "@/content/types";

// Prerendering waits for every example so the HTML contains them. Client navigation
// starts the same requests without waiting: the page text renders as soon as its data
// arrives, and examples already warmed by a hover preload render in the same pass.
const loadExamples = createIsomorphicFn()
  .server(async (page: DocPage) => {
    await preloadExamples(page.variants);
  })
  .client((page: DocPage) => {
    void preloadExamples(page.variants);
  });

// Vite splits each compiled document into its own asset. Router owns preloading
// and caching; both SSR and client navigation use this same loader.
export const getDocPage = async (path: string) => {
  const load = Object.hasOwn(documents, path) ? documents[path] : undefined;

  if (!load) {
    return null;
  }

  const { default: page } = await load();

  await loadExamples(page);

  return page;
};
