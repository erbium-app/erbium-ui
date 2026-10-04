import type { Meta, StoryObj } from "../types";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

const meta = {
  parameters: {
    layout: "centered",
    docs: { description: { component: componentDocumentation("use-copy-to-clipboard") } },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("use-copy-to-clipboard", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

import CustomButtonExample from "./variants/custom-button";
import CustomButtonSource from "./variants/custom-button.tsx?raw";

export const CustomButton: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("use-copy-to-clipboard", "custom-button") },
      source: { code: CustomButtonSource },
    },
  },
  render: CustomButtonExample,
};
