import { expect, test } from "vite-plus/test";
import manifest from "@erbium/showcase/manifest";
import { documentationSections } from "./documentation-sections";

test("every showcase belongs to exactly one semantic section", () => {
  const names = documentationSections.flatMap((section) => section.names);
  expect(new Set(names).size).toBe(names.length);
  expect([...names].sort()).toEqual(manifest.map((item) => item.name).sort());
});

test("foundations and helpers are separate from rendered UI components", () => {
  const sectionFor = (name: string) =>
    documentationSections.find((section) => section.names.includes(name))?.kind;
  for (const name of ["colors", "surfaces", "styles"]) expect(sectionFor(name)).toBe("foundation");
  for (const name of ["scroll-fade", "shake"]) expect(sectionFor(name)).toBe("utility");
  for (const name of ["csp-provider", "overlay-provider", "direction"])
    expect(sectionFor(name)).toBe("provider");
});
