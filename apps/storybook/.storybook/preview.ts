// @ts-expect-error Vite resolves CSS asset imports at runtime.
import "../src/styles.css";
import { createElement } from "react";
import { withThemeByClassName } from "@storybook/addon-themes";
import { ShowcaseProviders, ShowcaseSurface } from "@erbium/showcase/preview";
import { IconSprite } from "@erbium/ui/components/icon-sprite";
import { DrawerIndent } from "@erbium/ui/components/drawer";
import type { Preview } from "@storybook/tanstack-react";
import { ThemeAwareDocsContainer } from "./docs-container";

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      defaultTheme: "light",
      themes: {
        dark: "dark",
        light: "",
      },
    }),
    (Story, context) => {
      const isDocs = context.viewMode === "docs";
      const isCentered = context.parameters.layout === "centered";

      return createElement(
        ShowcaseProviders,
        { toast: !isDocs },
        !isDocs && createElement(IconSprite),
        isDocs
          ? createElement(ShowcaseSurface, null, createElement(Story))
          : createElement(
              DrawerIndent,
              { className: isCentered ? "flex items-center justify-center" : undefined },
              createElement(ShowcaseSurface, null, createElement(Story)),
            ),
      );
    },
  ],
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    docs: { container: ThemeAwareDocsContainer },
    options: {
      storySort: {
        method: "alphabetical",
        order: ["Foundations", "Components", "Hooks", "Utilities", "Providers"],
      },
    },
  },
  tags: ["autodocs"],
};

export default preview;
