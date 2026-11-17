import type { Meta, StoryObj } from "../types";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/overlay-provider-demo.tsx?raw";

const meta = {
  parameters: {
    docs: { description: { component: componentDocumentation("overlay-provider") } },
    layout: "centered",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("overlay-provider", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};
