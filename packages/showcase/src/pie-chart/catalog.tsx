import type { Meta, StoryObj } from "../types";

import { PieChart } from "@erbium/ui/charts/pie-chart";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import CenterExample from "./variants/center";

import CenterSource from "./variants/center.tsx?raw";

const meta = {
  component: PieChart,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("pie-chart"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PieChart>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{ donut: boolean; legend: boolean; tooltip: boolean }> = {
  argTypes: {
    donut: { control: "boolean" },
    legend: { control: "boolean" },
    tooltip: { control: "boolean" },
  },
  args: PlaygroundDefaults,
  parameters: {
    docs: {
      description: { story: variantDocumentation("pie-chart", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Center: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("pie-chart", "center") },
      source: { code: CenterSource },
    },
  },
  render: CenterExample,
};
