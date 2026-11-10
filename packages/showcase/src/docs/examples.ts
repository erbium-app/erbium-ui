import type { ShowcaseStory } from "../catalog";

/** A variant module: its default export renders the example. */
export interface ShowcaseExampleModule {
  default: ShowcaseStory["render"];
}

// One lazy import per variant, so bundlers emit one chunk per example and the
// server and client resolve the same module for a given name and slug.
const variants = import.meta.glob<ShowcaseExampleModule>("../*/variants/*.tsx");

/**
 * Loads one example variant.
 *
 * @param name Showcase directory, e.g. "button".
 * @param slug Variant slug, e.g. "overview".
 * @returns The variant module.
 */
export const loadExample = async (name: string, slug: string) => {
  const key = `../${name}/variants/${slug}.tsx`;
  const load = Object.hasOwn(variants, key) ? variants[key] : undefined;

  if (!load) {
    throw new Error(`Missing showcase example: ${name}/${slug}`);
  }

  return await load();
};
