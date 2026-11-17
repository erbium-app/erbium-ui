import type { Meta, StoryObj } from "../types";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/use-drag-select-demo.tsx?raw";

const meta = {
  parameters: {
    docs: { description: { component: componentDocumentation("use-drag-select") } },
    layout: "centered",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("use-drag-select", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};
