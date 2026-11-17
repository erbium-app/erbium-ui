import type { Meta, StoryObj } from "../types";

import { Meter } from "@erbium/ui/components/meter";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/meter-demo.tsx?raw";

import RangeExample from "./variants/range";

import RangeSource from "./variants/range.tsx?raw";

const meta = {
  component: Meter,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("meter"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Meter>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof Meter> = {
  argTypes: {
    max: { control: "number" },
    min: { control: "number" },
    value: { control: { max: 100, min: 0, step: 1, type: "range" } },
  },
  args: PlaygroundDefaults,
  parameters: {
    docs: {
      description: { story: variantDocumentation("meter", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("meter", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Range: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("meter", "range") },
      source: { code: RangeSource },
    },
  },
  render: RangeExample,
};
