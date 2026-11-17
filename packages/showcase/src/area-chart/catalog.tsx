import type { Meta, StoryObj } from "../types";

import { AreaChart } from "@erbium/ui/charts/area-chart";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import StackedExample from "./variants/stacked";

import StackedSource from "./variants/stacked.tsx?raw";

const meta = {
  component: AreaChart,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("area-chart"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AreaChart>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  axis: boolean;
  curve: "smooth" | "linear" | "step";
  fill: "gradient" | "solid";
  grid: boolean;
  legend: boolean;
  stacked: boolean;
  tooltip: boolean;
}> = {
  argTypes: {
    axis: { control: "boolean" },
    curve: { control: "inline-radio", options: ["smooth", "linear", "step"] },
    fill: { control: "inline-radio", options: ["gradient", "solid"] },
    grid: { control: "boolean" },
    legend: { control: "boolean" },
    stacked: { control: "boolean" },
    tooltip: { control: "boolean" },
  },
  args: {
    axis: true,
    curve: "smooth",
    fill: "gradient",
    grid: true,
    legend: true,
    stacked: false,
    tooltip: true,
  },
  parameters: {
    docs: {
      description: { story: variantDocumentation("area-chart", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Stacked: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("area-chart", "stacked") },
      source: { code: StackedSource },
    },
  },
  render: StackedExample,
};
