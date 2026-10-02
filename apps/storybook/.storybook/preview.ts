// @ts-expect-error Vite resolves CSS asset imports at runtime.
import "@erbium/ui/globals.css";
import { createElement } from "react";
import { withThemeByClassName } from "@storybook/addon-themes";
import { CSPProvider } from "@erbium/ui/components/csp-provider";
import { DrawerIndent } from "@erbium/ui/components/drawer";
import { OverlayProvider } from "@erbium/ui/components/overlay-provider";
import { Toaster } from "@erbium/ui/components/toast";
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
        CSPProvider,
        { disableStyleElements: true },
        createElement(
          OverlayProvider,
          null,
          // Docs render many stories inline, so only the canvas gets the page inset.
          isDocs
            ? createElement(Story)
            : createElement(
                DrawerIndent,
                { className: isCentered ? "flex items-center justify-center" : undefined },
                createElement(Story),
              ),
        ),
        isDocs ? null : createElement(Toaster),
      );
    },
  ],
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    docs: { container: ThemeAwareDocsContainer },
  },
};
export default preview;
