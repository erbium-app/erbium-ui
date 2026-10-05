import { createThemeCss } from "@tanstack/highlight/theme";
import lightReference from "../../../../../.reference/vitesse-light.json";
import darkReference from "../../../../../.reference/vitesse-dark.json";

// Syntax roles come from the reference theme, not a copied docs palette.
function syntaxTheme(reference, type) {
  function token(scope) {
    const rule = reference.tokenColors.find((entry) =>
      Array.isArray(entry.scope) ? entry.scope.includes(scope) : entry.scope === scope,
    );
    if (!rule?.settings.foreground) throw new Error(`Missing Vitesse syntax role: ${scope}`);
    return rule.settings.foreground;
  }
  return {
    name: reference.name,
    type,
    background: "var(--code)",
    foreground: "var(--code-foreground)",
    tokens: {
      token: "var(--code-foreground)",
      attr: token("entity.other.attribute-name"),
      "code-inline": token("markup.raw"),
      command: token("entity.name.function"),
      comment: token("comment"),
      deleted: token("markup.deleted"),
      function: token("entity.name.function"),
      heading: token("markup.heading"),
      inserted: token("markup.inserted"),
      keyword: token("keyword"),
      link: reference.colors["textLink.foreground"],
      literal: token("constant.language.boolean"),
      meta: token("punctuation"),
      number: token("constant.numeric"),
      operator: token("keyword.operator"),
      property: token("property"),
      selector: token("entity.name.tag"),
      string: token("string"),
      tag: token("entity.name.tag"),
      type: token("support.type.primitive"),
      variable: token("variable"),
    },
  };
}

export const syntaxThemeCss = createThemeCss({
  light: syntaxTheme(lightReference, "light"),
  dark: syntaxTheme(darkReference, "dark"),
});

// Color documentation can pin a block's appearance independently of the page.
export const colorPreviewSyntaxThemeCss = createThemeCss({
  light: syntaxTheme(lightReference, "light"),
  dark: syntaxTheme(darkReference, "dark"),
  lightSelector: '[data-code-appearance="light"]',
  darkSelector: '[data-code-appearance="dark"]',
  includeBaseStyles: false,
});
