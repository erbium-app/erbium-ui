// @ts-expect-error Vite resolves CSS asset imports at runtime.
import "@erbium/ui/styles.css";
import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
  parameters: { controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } } },
};
export default preview;
