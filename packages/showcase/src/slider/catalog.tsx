import type { Meta, StoryObj } from "../types";

import { Slider } from "@erbium/ui/components/slider";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import MidpointExample from "./variants/midpoint";

import MidpointSource from "./variants/midpoint.tsx?raw";

import DisabledExample from "./variants/disabled";

import DisabledSource from "./variants/disabled.tsx?raw";

import RangeExample from "./variants/range";

import RangeSource from "./variants/range.tsx?raw";

import VerticalExample from "./variants/vertical";

import VerticalSource from "./variants/vertical.tsx?raw";

import ControlledExample from "./variants/controlled";

import ControlledSource from "./variants/controlled.tsx?raw";

import MultipleThumbsExample from "./variants/multiple-thumbs";

import MultipleThumbsSource from "./variants/multiple-thumbs.tsx?raw";

const meta = {
  title: "UI/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("slider"),
      },
    },
  },
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof Slider> = {
  args: { defaultValue: [50], min: 0, max: 100, step: 1, disabled: false },
  argTypes: {
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    disabled: { control: "boolean" },
    defaultValue: { control: "object" },
  },
  parameters: {
    docs: {
      description: { story: variantDocumentation("slider", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("slider", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Midpoint: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("slider", "midpoint") },
      source: { code: MidpointSource },
    },
  },
  render: MidpointExample,
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("slider", "disabled") },
      source: { code: DisabledSource },
    },
  },
  render: DisabledExample,
};

export const Range: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("slider", "range") },
      source: { code: RangeSource },
    },
  },
  render: RangeExample,
};

export const Vertical: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("slider", "vertical") },
      source: { code: VerticalSource },
    },
  },
  render: VerticalExample,
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("slider", "controlled") },
      source: { code: ControlledSource },
    },
  },
  render: ControlledExample,
};

export const MultipleThumbs: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("slider", "multiple-thumbs") },
      source: { code: MultipleThumbsSource },
    },
  },
  render: MultipleThumbsExample,
};
