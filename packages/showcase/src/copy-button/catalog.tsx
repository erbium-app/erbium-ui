import type { Meta, StoryObj } from "../types";
import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";
import OverviewExample from "./variants/overview";
import OverviewSource from "./variants/overview.tsx?raw";
import ButtonsExample from "./variants/buttons";
import ButtonsSource from "./variants/buttons.tsx?raw";
import InputExample from "./variants/input";
import InputSource from "./variants/input.tsx?raw";

import DisplayValueExample from "./variants/display-value";
import DisplayValueSource from "./variants/display-value.tsx?raw";

const meta = {
  parameters: {
    docs: { description: { component: componentDocumentation("copy-button") } },
    layout: "centered",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("copy-button", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Buttons: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("copy-button", "buttons") },
      source: { code: ButtonsSource },
    },
  },
  render: ButtonsExample,
};

export const Input: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("copy-button", "input") },
      source: { code: InputSource },
    },
  },
  render: InputExample,
};

export const DisplayValue: Story = {
  name: "Display Value",
  parameters: {
    docs: {
      description: { story: variantDocumentation("copy-button", "display-value") },
      source: { code: DisplayValueSource },
    },
  },
  render: DisplayValueExample,
};
