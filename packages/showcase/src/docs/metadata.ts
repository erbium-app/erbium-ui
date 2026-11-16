// Build-time showcase data for the documentation site. It reads generated JSON and
// evaluates catalogs, so import it from build code only; the docs import each page's
// example variants through a generated module.
import manifest from "../../manifest.json";
import registry from "../../registry.json";
import { loadShowcase } from "../catalog";
import type { ShowcaseStory } from "../catalog";

export { showcaseSource } from "../sources";

/** A file that installing the example copies, relative to the showcase package. */
export interface ShowcaseExampleFile {
  path: string;
}

export interface ShowcaseExample {
  /** Documentation slug, which names the variant file and its Markdown. */
  slug: string;
  title: string;
  /** Story export name in the component's catalog. */
  exportName: string;
  /** Variant source, relative to the showcase package. */
  source: string;
  /** Files of the installable registry item, or the variant source when it has none. */
  files: ShowcaseExampleFile[];
}

/** An example with the Storybook controls its catalog declares. */
export interface ShowcaseExampleControls extends ShowcaseExample {
  args: NonNullable<ShowcaseStory["args"]>;
  argTypes: NonNullable<ShowcaseStory["argTypes"]>;
}

const registryFiles = new Map(
  registry.items.map((item) => [
    item.name,
    (item.files ?? []).map((file): ShowcaseExampleFile => ({ path: file.path })),
  ]),
);

/**
 * Lists a component's documented examples in catalog order.
 *
 * @param name Showcase directory, e.g. "button".
 * @returns The examples, or an empty list when the component has no showcase.
 */
export const showcaseExamples = (name: string): ShowcaseExample[] =>
  (manifest.find((entry) => entry.name === name)?.variants ?? []).map((variant) => ({
    exportName: variant.exportName,
    files: registryFiles.get(`${name}-${variant.slug}`) ?? [{ path: variant.source }],
    slug: variant.slug,
    source: variant.source,
    title: variant.title,
  }));

/** Every catalog story is a CSF object with a render function. */
const isStory = (value: unknown): value is ShowcaseStory =>
  typeof value === "object" && value !== null && "render" in value;

/**
 * Lists a component's examples with their args and argTypes. It evaluates the
 * component's catalog once, because CSF args are only known at runtime.
 *
 * @param name Showcase directory, e.g. "button".
 * @returns The examples with controls.
 */
export const showcaseExampleControls = async (name: string): Promise<ShowcaseExampleControls[]> => {
  const examples = showcaseExamples(name);

  if (examples.length === 0) {
    return [];
  }

  const catalog = await loadShowcase(name);

  return examples.map((example) => {
    const story = catalog[example.exportName];
    const controls = isStory(story) ? story : undefined;

    return { ...example, argTypes: controls?.argTypes ?? {}, args: controls?.args ?? {} };
  });
};

const portableStories = import.meta.glob<{ files: { path: string; content: string }[] }>(
  "../../public/r/*-stories.json",
  { eager: true, import: "default" },
);

/**
 * Returns the files of a component's portable stories registry item, with the
 * registry's installable import paths.
 *
 * @param name Showcase directory, e.g. "button".
 * @returns The files, or undefined when the component has no stories item.
 */
export const showcaseStoryFiles = (name: string) =>
  portableStories[`../../public/r/${name}-stories.json`]?.files;
