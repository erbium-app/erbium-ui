import type { ShowcaseStory } from "@erbium/showcase/catalog";
import { createRequestCache } from "@/content/request-cache";

interface ExampleModule {
  default: ShowcaseStory["render"];
}

const examples = import.meta.glob<ExampleModule>(
  "../../../../packages/showcase/src/*/variants/*.tsx",
);

const exampleModule = createRequestCache(async (key) => {
  const load = Object.hasOwn(examples, key) ? examples[key] : undefined;

  if (!load) {
    throw new Error(`Missing interactive example: ${key}`);
  }

  return await load();
});

// Server rendering awaits the same request the loader started, which puts the example
// markup in the prerendered HTML; hydration keeps that markup while the chunk loads.
export const exampleRequest = (name: string, slug: string) =>
  exampleModule(`../../../../packages/showcase/src/${name}/variants/${slug}.tsx`);

/** Starts every example request for a page; failures surface in each preview's boundary. */
export const preloadExamples = async (name: string, slugs: readonly string[]) => {
  await Promise.allSettled(slugs.map(async (slug) => await exampleRequest(name, slug)));
};
