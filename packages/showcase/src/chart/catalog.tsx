import type { Meta, StoryObj } from "../types";

import { Chart } from "@erbium/ui/components/chart";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import ExampleExample from "./variants/example";

import ExampleSource from "./variants/example.tsx?raw";

import ExampleGridExample from "./variants/example-grid";

import ExampleGridSource from "./variants/example-grid.tsx?raw";

import ExampleAxisExample from "./variants/example-axis";

import ExampleAxisSource from "./variants/example-axis.tsx?raw";

import ExampleTooltipExample from "./variants/example-tooltip";

import ExampleTooltipSource from "./variants/example-tooltip.tsx?raw";

import ExampleLegendExample from "./variants/example-legend";

import ExampleLegendSource from "./variants/example-legend.tsx?raw";

const meta = {
  title: "UI/Chart",
  component: Chart,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("chart"),
      },
    },
  },
} satisfies Meta<typeof Chart>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  height: number;
  initialWidth: number;
  grid: boolean;
  axis: boolean;
  tooltip: boolean;
  legend: boolean;
}> = {
  args: { height: 240, initialWidth: 640, grid: false, axis: false, tooltip: false, legend: false },
  argTypes: {
    height: { control: { type: "number", min: 120, max: 600 } },
    initialWidth: { control: { type: "number", min: 320, max: 960 } },
    grid: { control: "boolean" },
    axis: { control: "boolean" },
    tooltip: { control: "boolean" },
    legend: { control: "boolean" },
  },
  parameters: {
    docs: {
      description: { story: variantDocumentation("chart", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("chart", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Example: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("chart", "example") },
      source: { code: ExampleSource },
    },
  },
  render: ExampleExample,
};

export const ExampleGrid: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("chart", "example-grid") },
      source: { code: ExampleGridSource },
    },
  },
  render: ExampleGridExample,
};

export const ExampleAxis: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("chart", "example-axis") },
      source: { code: ExampleAxisSource },
    },
  },
  render: ExampleAxisExample,
};

export const ExampleTooltip: Story = {
  name: "Tooltip",
  parameters: {
    docs: {
      description: { story: variantDocumentation("chart", "example-tooltip") },
      source: { code: ExampleTooltipSource },
    },
  },
  render: ExampleTooltipExample,
};

export const ExampleLegend: Story = {
  name: "Legend",
  parameters: {
    docs: {
      description: { story: variantDocumentation("chart", "example-legend") },
      source: { code: ExampleLegendSource },
    },
  },
  render: ExampleLegendExample,
};
