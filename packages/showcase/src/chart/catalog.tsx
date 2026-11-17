import type { Meta, StoryObj } from "../types";

import { Chart } from "@erbium/ui/charts/chart";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import CompositionExample from "./variants/composition";

import CompositionSource from "./variants/composition.tsx?raw";

const meta = {
  component: Chart,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("chart"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Chart>;

export default meta;

type Story = StoryObj;

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("chart", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Composition: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("chart", "composition") },
      source: { code: CompositionSource },
    },
  },
  render: CompositionExample,
};
