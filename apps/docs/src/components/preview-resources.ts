import examples from "virtual:docs-preview-loaders";
import { createClientOnlyFn } from "@tanstack/react-start";

// Dynamic imports cache successful modules. Failed imports can be retried.
export const exampleResource = createClientOnlyFn(async (name: string, slug: string) => {
  const key = `${name}/${slug}`;
  const load = Object.hasOwn(examples, key) ? examples[key] : undefined;

  if (!load) {
    throw new Error(`Missing interactive example: ${key}`);
  }

  return await load();
});
