// @ts-expect-error Vite resolves CSS asset imports at runtime.
import "../src/styles.css";
import { createElement } from "react";
import { withThemeByClassName } from "@storybook/addon-themes";
import { ShowcaseProviders, ShowcaseSurface } from "@erbium/showcase/preview";
import { DrawerIndent } from "@erbium/ui/components/drawer";
import type { Preview } from "@storybook/tanstack-react";
import { ThemeAwareDocsContainer } from "./docs-container";

const preview: Preview = {
  tags: ["autodocs"],
  decorators: [
    withThemeByClassName({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
    (Story, context) => {
      const isDocs = context.viewMode === "docs";
      const isCentered = context.parameters.layout === "centered";
      return createElement(
        ShowcaseProviders,
        { toast: !isDocs },
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
  },
};
export default preview;
