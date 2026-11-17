import type { Meta, StoryObj } from "../types";

import { BarChart } from "@erbium/ui/charts/bar-chart";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import StackedExample from "./variants/stacked";

import StackedSource from "./variants/stacked.tsx?raw";

import HorizontalExample from "./variants/horizontal";

import HorizontalSource from "./variants/horizontal.tsx?raw";

const meta = {
  component: BarChart,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("bar-chart"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BarChart>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  axis: boolean;
  grid: boolean;
  legend: boolean;
  orientation: "vertical" | "horizontal";
  stacked: boolean;
  tooltip: boolean;
}> = {
  argTypes: {
    axis: { control: "boolean" },
    grid: { control: "boolean" },
    legend: { control: "boolean" },
    orientation: { control: "inline-radio", options: ["vertical", "horizontal"] },
    stacked: { control: "boolean" },
    tooltip: { control: "boolean" },
  },
  args: {
    axis: true,
    grid: true,
    legend: true,
    orientation: "vertical",
    stacked: false,
    tooltip: true,
  },
  parameters: {
    docs: {
      description: { story: variantDocumentation("bar-chart", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Stacked: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("bar-chart", "stacked") },
      source: { code: StackedSource },
    },
  },
  render: StackedExample,
};

export const Horizontal: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("bar-chart", "horizontal") },
      source: { code: HorizontalSource },
    },
  },
  render: HorizontalExample,
};
