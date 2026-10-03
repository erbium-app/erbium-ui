import { createThemeCss } from "@tanstack/highlight/theme";

// Vitesse palettes adapted from .reference/vitesse-{light,dark}.json.
/** @type {import("@tanstack/highlight/theme").HighlightTheme} */
const light = {
  name: "vitesse-light",
  type: "light",
  background: "#ffffff",
  foreground: "#393a34",
  tokens: {
    token: "#393a34",
    attr: "#b07d48",
    "code-inline": "#1c6b48",
    command: "#59873a",
    comment: "#a0ada0",
    deleted: "#b31d28",
    function: "#59873a",
    heading: "#1c6b48",
    inserted: "#22863a",
    keyword: "#1e754f",
    link: "#1c6b48",
    literal: "#1e754f",
    meta: "#999999",
    number: "#2f798a",
    operator: "#ab5959",
    property: "#998418",
    selector: "#1e754f",
    string: "#b56959",
    tag: "#1e754f",
    type: "#2e8f82",
    variable: "#b07d48",
  },
};

/** @type {import("@tanstack/highlight/theme").HighlightTheme} */
const dark = {
  name: "vitesse-dark",
  type: "dark",
  background: "#121212",
  foreground: "#dbd7caee",
  tokens: {
    token: "#dbd7caee",
    attr: "#bd976a",
    "code-inline": "#4d9375",
    command: "#80a665",
    comment: "#758575dd",
    deleted: "#fdaeb7",
    function: "#80a665",
    heading: "#4d9375",
    inserted: "#85e89d",
    keyword: "#4d9375",
    link: "#4d9375",
    literal: "#4d9375",
    meta: "#666666",
    number: "#4C9A91",
    operator: "#cb7676",
    property: "#b8a965",
    selector: "#4d9375",
    string: "#c98a7d",
    tag: "#4d9375",
    type: "#5DA994",
    variable: "#bd976a",
  },
};

export const syntaxThemeCss = createThemeCss({ light, dark });
