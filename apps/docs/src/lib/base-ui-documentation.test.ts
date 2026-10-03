import { expect, it } from "vite-plus/test";
import { componentReferenceLinks } from "@erbium/content/markdown";

it("links renamed wrappers to their actual Base UI primitive", () => {
  for (const [name, slug] of [
    ["dropdown-menu", "menu"],
    ["sheet", "dialog"],
    ["hover-card", "preview-card"],
  ]) {
    expect(componentReferenceLinks(name).map((link) => link.href)).toContain(
      `https://base-ui.com/react/components/${slug}`,
    );
  }
});
it("deduplicates shared primitives and locates provider utilities", () => {
  const radio = componentReferenceLinks("radio-group");
  expect(radio.filter((link) => link.href.endsWith("/radio-group"))).toHaveLength(1);
  expect(componentReferenceLinks("csp-provider")[0].href).toBe(
    "https://base-ui.com/react/utils/csp-provider",
  );
  expect(componentReferenceLinks("skeleton")).toEqual([]);
});

it("shares reference text with Storybook component descriptions", async () => {
  const { componentDocumentation, componentReferences } = await import("@erbium/content/markdown");
  const references = componentReferences("checkbox");
  expect(references).toContain("## Base UI documentation");
  expect(componentDocumentation("checkbox")).toContain(references);
});
