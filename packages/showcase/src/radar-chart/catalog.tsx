import type { Meta, StoryObj } from "../types";

import { RadarChart } from "@erbium/ui/charts/radar-chart";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

const meta = {
  component: RadarChart,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("radar-chart"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RadarChart>;

export default meta;

export const Playground: StoryObj<{
  legend: boolean;
  points: boolean;
  rings: number;
  tooltip: boolean;
}> = {
  argTypes: {
    legend: { control: "boolean" },
    points: { control: "boolean" },
    rings: { control: { max: 8, min: 2, type: "number" } },
    tooltip: { control: "boolean" },
  },
  args: PlaygroundDefaults,
  parameters: {
    docs: {
      description: { story: variantDocumentation("radar-chart", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};
