import type { Meta, StoryObj } from "../types";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/shake-demo.tsx?raw";

const meta = {
  parameters: {
    docs: { description: { component: componentDocumentation("shake") } },
    layout: "centered",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("shake", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};
