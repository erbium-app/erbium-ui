import type { ShowcaseStory } from "@erbium/showcase/catalog";
import { createClientOnlyFn } from "@tanstack/react-start";

const examples = import.meta.glob<{ default: ShowcaseStory["render"] }>(
  "../../../../packages/showcase/src/*/variants/*.tsx",
);

// Dynamic imports cache successful modules. Failed imports can be retried.
export const exampleResource = createClientOnlyFn(async (name: string, slug: string) => {
  const key = `../../../../packages/showcase/src/${name}/variants/${slug}.tsx`;
  const load = Object.hasOwn(examples, key) ? examples[key] : undefined;

  if (!load) {
    throw new Error(`Missing interactive example: ${name}/${slug}`);
  }

  return await load();
});
