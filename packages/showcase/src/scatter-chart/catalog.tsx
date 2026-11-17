import type { Meta, StoryObj } from "../types";

import { ScatterChart } from "@erbium/ui/charts/scatter-chart";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

const meta = {
  component: ScatterChart,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("scatter-chart"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ScatterChart>;

export default meta;

export const Playground: StoryObj<{
  grid: boolean;
  legend: boolean;
  radius: number;
  tooltip: boolean;
}> = {
  argTypes: {
    grid: { control: "boolean" },
    legend: { control: "boolean" },
    radius: { control: { max: 10, min: 2, type: "number" } },
    tooltip: { control: "boolean" },
  },
  args: PlaygroundDefaults,
  parameters: {
    docs: {
      description: { story: variantDocumentation("scatter-chart", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};
