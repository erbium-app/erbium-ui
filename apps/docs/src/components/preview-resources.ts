import { loadExample } from "@erbium/showcase/docs/examples";
import { createRequestCache } from "@/content/request-cache";

const exampleModule = createRequestCache(async (key) => {
  const [name = "", slug = ""] = key.split("/");

  return await loadExample(name, slug);
});

// Server rendering awaits the same request the loader started, which puts the example
// markup in the prerendered HTML; hydration keeps that markup while the chunk loads.
export const exampleRequest = (name: string, slug: string) => exampleModule(`${name}/${slug}`);

/** Starts every example request for a page; failures surface in each preview's boundary. */
export const preloadExamples = async (examples: readonly { name: string; slug: string }[]) => {
  await Promise.allSettled(
    examples.map(async ({ name, slug }) => await exampleRequest(name, slug)),
  );
};
