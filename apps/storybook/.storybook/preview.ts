// @ts-expect-error Vite resolves CSS asset imports at runtime.
import "@erbium/ui/globals.css";
import type { Preview } from "@storybook/tanstack-react";

const preview: Preview = {
  parameters: { controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } } },
};
export default preview;
