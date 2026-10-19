import groups from "virtual:docs-preview-loaders";
import { createClientOnlyFn } from "@tanstack/react-start";
import type { ShowcaseStory } from "@erbium/showcase/catalog";

interface PreviewModule {
  default: ShowcaseStory["render"];
}

const previews = new Map<string, Promise<PreviewModule>>();
const catalogs = new Map<string, ReturnType<(typeof groups)[string]>>();

// The shared entry lists components only. Each component's variant/dependency
// map is downloaded on demand, rather than every example's map on every page.
export const exampleResource = createClientOnlyFn(
  async (name: string, slug: string): Promise<PreviewModule> => {
    const key = `${name}/${slug}`;
    let resource = previews.get(key);

    if (resource) {
      return await resource;
    }

    const loadGroup = groups[name];

    if (!loadGroup) {
      throw new Error(`Missing interactive component: ${name}`);
    }

    let catalog = catalogs.get(name);

    if (!catalog) {
      catalog = loadGroup();
      catalogs.set(name, catalog);
    }

    resource = catalog.then(async ({ default: examples }) => {
      const loader = examples[slug];

      if (!loader) {
        throw new Error(`Missing interactive example: ${key}`);
      }

      return await loader();
    });
    previews.set(key, resource);
    // A failed speculative request must not permanently poison the preview.
    resource.catch(() => {
      previews.delete(key);
      catalogs.delete(name);
    });

    return await resource;
  },
);
