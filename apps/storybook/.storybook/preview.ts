// @ts-expect-error Vite resolves CSS asset imports at runtime.
import "@erbium/ui/globals.css";
import { createElement, Fragment } from "react";
import { Toaster } from "@erbium/ui/components/toast";
import type { Preview } from "@storybook/tanstack-react";

const preview: Preview = {
  decorators: [
    (Story) => createElement(Fragment, null, createElement(Story), createElement(Toaster)),
  ],
  parameters: { controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } } },
};
export default preview;
