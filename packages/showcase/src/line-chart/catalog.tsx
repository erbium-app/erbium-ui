import type { Meta, StoryObj } from "../types";

import { LineChart } from "@erbium/ui/charts/line-chart";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import TimeExample from "./variants/time";

import TimeSource from "./variants/time.tsx?raw";

const meta = {
  component: LineChart,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("line-chart"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof LineChart>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  axis: boolean;
  curve: "smooth" | "linear" | "step";
  grid: boolean;
  legend: boolean;
  points: boolean;
  tooltip: boolean;
}> = {
  argTypes: {
    axis: { control: "boolean" },
    curve: { control: "inline-radio", options: ["smooth", "linear", "step"] },
    grid: { control: "boolean" },
    legend: { control: "boolean" },
    points: { control: "boolean" },
    tooltip: { control: "boolean" },
  },
  args: PlaygroundDefaults,
  parameters: {
    docs: {
      description: { story: variantDocumentation("line-chart", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Time: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("line-chart", "time") },
      source: { code: TimeSource },
    },
  },
  render: TimeExample,
};
