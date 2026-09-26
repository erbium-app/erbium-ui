// @ts-expect-error Vite resolves CSS asset imports at runtime.
import "@erbium/ui/globals.css";
import { createElement, Fragment } from "react";
import {
  Controls,
  Description,
  Primary,
  Stories,
  Subtitle,
  Title,
} from "@storybook/addon-docs/blocks";
import { Toaster } from "@erbium/ui/components/toast";
import type { Preview } from "@storybook/tanstack-react";

const preview: Preview = {
  decorators: [
    (Story) => createElement(Fragment, null, createElement(Story), createElement(Toaster)),
  ],
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    docs: {
      page: () =>
        createElement(
          Fragment,
          null,
          createElement(Title),
          createElement(Subtitle),
          createElement(Description, { of: "meta" }),
          createElement(Primary),
          createElement(Controls),
          createElement(Stories, { includePrimary: false }),
        ),
    },
  },
};
export default preview;
