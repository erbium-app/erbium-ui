import type { Meta, StoryObj } from "../types";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

const meta = {
  parameters: {
    layout: "centered",
    docs: { description: { component: componentDocumentation("overlay-provider") } },
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
