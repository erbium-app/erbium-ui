// @ts-expect-error Vite resolves CSS asset imports at runtime.
import "@erbium/ui/globals.css";
import { createElement, Fragment } from "react";
import { withThemeByClassName } from "@storybook/addon-themes";
import { Toaster } from "@erbium/ui/components/toast";
import type { Preview } from "@storybook/tanstack-react";

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
    (Story) => createElement(Fragment, null, createElement(Story), createElement(Toaster)),
  ],
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
};
export default preview;
