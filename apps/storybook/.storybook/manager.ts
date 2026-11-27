import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";

addons.setConfig({
  theme: create({
    base: "light",
    // Without `brandImage`, the sidebar renders the title as markup, so the mark keeps its name.
    brandTitle:
      '<span style="display:flex;align-items:center;gap:6px"><img src="./logo.svg" alt="" width="24" height="24">Erbium UI</span>',
    brandUrl: "https://ui.erbium.app",
  }),
});
