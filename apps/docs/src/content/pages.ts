import { createIsomorphicFn } from "@tanstack/react-start";
import documents from "virtual:docs-pages";
import examplePreloads from "virtual:docs-example-preloads";
import { examplesRequest } from "@/components/preview-resources";
import type { DocPage } from "@/content/types";

// Prerendering waits for the examples so the HTML contains them, and lists their files for the
// browser to preload. Client navigation starts the same request without waiting: the page text
// renders as soon as its data arrives.
const loadExamples = createIsomorphicFn()
  .server(async (page: DocPage) => {
    await examplesRequest(page.path);

    return examplePreloads[page.path] ?? [];
  })
  .client((page: DocPage) => {
    void examplesRequest(page.path);

    return [];
  });

// Vite splits each compiled document into its own asset. Router owns preloading
// and caching; both SSR and client navigation use this same loader.
export const getDocPage = async (path: string) => {
  const load = Object.hasOwn(documents, path) ? documents[path] : undefined;

  if (!load) {
    return null;
  }

  const { default: page } = await load();
  const preloads = page.variants.length > 0 ? await loadExamples(page) : [];

  return { ...page, preloads };
};
