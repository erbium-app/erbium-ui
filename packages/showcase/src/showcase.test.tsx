import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";
import manifest from "../manifest.json";
import uiRegistry from "../../ui/registry.json";
import { ShowcaseProviders } from "./preview";
import type { ShowcaseCatalog, ShowcaseStory } from "./catalog";

const catalogs = import.meta.glob<ShowcaseCatalog>("./*/catalog.tsx", { eager: true });
const entries = manifest.flatMap((component) =>
  component.variants.map((variant) => ({ ...variant, component: component.name })),
);

it("every public UI component has a shared catalog and Markdown", () => {
  for (const item of uiRegistry.items.filter((item) => item.name !== "utils")) {
    expect(manifest.find((entry) => entry.name === item.name)).toBeDefined();
    expect(componentDocumentation(item.name).length).toBeGreaterThan(40);
  }
});
it.each(entries)(
  "$component/$slug renders and has shared content",
  ({ component, exportName, slug, source }) => {
    const catalog = catalogs[`./${component}/catalog.tsx`];
    const story = catalog[exportName] as ShowcaseStory;
    expect(story).toBeDefined();
    expect(variantDocumentation(component, slug)).toBe(story.parameters?.docs?.description?.story);
    expect(existsSync(fileURLToPath(new URL(`../${source}`, import.meta.url)))).toBe(true);
    expect(() =>
      renderToString(
        createElement(ShowcaseProviders, null, createElement(story.render, story.args ?? {})),
      ),
    ).not.toThrow();
  },
);
it.each(manifest)("$name preserves the Storybook export list", ({ name, variants }) => {
  const source = readFileSync(
    fileURLToPath(
      new URL(`../../../apps/storybook/src/stories/${name}.stories.tsx`, import.meta.url),
    ),
    "utf8",
  );
  expect([...source.matchAll(/export const (\w+)/g)].map((match) => match[1])).toEqual(
    variants.map((variant) => variant.exportName),
  );
});
