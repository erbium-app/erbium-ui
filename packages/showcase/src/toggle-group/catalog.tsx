import type { Meta, StoryObj } from "../types";

import { ToggleGroup } from "@erbium/ui/components/toggle-group";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/toggle-group-demo.tsx?raw";

import OutlineExample from "./variants/outline";

import OutlineSource from "./examples/toggle-group-outline.tsx?raw";

import SpacingExample from "./variants/spacing";

import SpacingSource from "./examples/toggle-group-spacing.tsx?raw";

import DisabledExample from "./variants/disabled";

import DisabledSource from "./examples/toggle-group-disabled.tsx?raw";

import FontWeightSelectorExample from "./variants/font-weight-selector";

import FontWeightSelectorSource from "./examples/toggle-group-font-weight-selector.tsx?raw";

import VerticalExample from "./variants/vertical";

import VerticalSource from "./examples/toggle-group-vertical.tsx?raw";

import SizeExample from "./variants/size";

import SizeSource from "./examples/toggle-group-sizes.tsx?raw";

const meta = {
  component: ToggleGroup,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("toggle-group"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ToggleGroup>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof ToggleGroup> = {
  argTypes: {
    multiple: { control: "boolean" },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    size: { control: "select", options: ["default", "sm", "lg"] },
    spacing: { control: { max: 8, min: 0, step: 1, type: "range" } },
    variant: { control: "select", options: ["default", "outline"] },
  },
  args: PlaygroundDefaults,
  parameters: {
    docs: {
      description: { story: variantDocumentation("toggle-group", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("toggle-group", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Outline: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("toggle-group", "outline") },
      source: { code: OutlineSource },
    },
  },
  render: OutlineExample,
};

export const Spacing: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("toggle-group", "spacing") },
      source: { code: SpacingSource },
    },
  },
  render: SpacingExample,
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("toggle-group", "disabled") },
      source: { code: DisabledSource },
    },
  },
  render: DisabledExample,
};

export const FontWeightSelector: Story = {
  name: "Custom",
  parameters: {
    docs: {
      description: { story: variantDocumentation("toggle-group", "font-weight-selector") },
      source: { code: FontWeightSelectorSource },
    },
  },
  render: FontWeightSelectorExample,
};

export const Vertical: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("toggle-group", "vertical") },
      source: { code: VerticalSource },
    },
  },
  render: VerticalExample,
};

export const Size: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("toggle-group", "size") },
      source: { code: SizeSource },
    },
  },
  render: SizeExample,
};
