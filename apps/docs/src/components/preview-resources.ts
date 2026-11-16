import examples from "virtual:docs-examples";
import { createRequestCache } from "@/content/request-cache";

// One module per page imports all of its examples, so they arrive in one request.
const pageExamples = createRequestCache(async (path) => {
  const load = Object.hasOwn(examples, path) ? examples[path] : undefined;

  if (!load) {
    throw new Error(`Missing examples: ${path}`);
  }

  const { default: modules } = await load();

  return modules;
});

/**
 * A page's examples, keyed `<name>/<slug>`. Server rendering awaits the request the loader
 * started, which puts the example markup in the prerendered HTML; hydration keeps that markup
 * while the chunk loads.
 */
export const examplesRequest = (path: string) => pageExamples(path);
