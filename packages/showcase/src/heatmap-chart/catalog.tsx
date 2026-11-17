import type { Meta, StoryObj } from "../types";

import { HeatmapChart } from "@erbium/ui/charts/heatmap-chart";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

const meta = {
  component: HeatmapChart,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("heatmap-chart"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof HeatmapChart>;

export default meta;

export const Playground: StoryObj<{ legend: boolean; tooltip: boolean }> = {
  argTypes: { legend: { control: "boolean" }, tooltip: { control: "boolean" } },
  args: PlaygroundDefaults,
  parameters: {
    docs: {
      description: { story: variantDocumentation("heatmap-chart", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};
