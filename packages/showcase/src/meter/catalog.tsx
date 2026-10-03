import type { Meta, StoryObj } from "../types";

import { Meter } from "@erbium/ui/components/meter";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import RangeExample from "./variants/range";

import RangeSource from "./variants/range.tsx?raw";

const meta = {
  component: Meter,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("meter"),
      },
    },
  },
} satisfies Meta<typeof Meter>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof Meter> = {
  args: { value: 24, min: 0, max: 100 },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    min: { control: "number" },
    max: { control: "number" },
  },
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
