import type { Meta, StoryObj } from "../types";

import { ToggleGroup } from "@erbium/ui/components/toggle-group";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import OutlineExample from "./variants/outline";

import OutlineSource from "./variants/outline.tsx?raw";

import SpacingExample from "./variants/spacing";

import SpacingSource from "./variants/spacing.tsx?raw";

import DisabledExample from "./variants/disabled";

import DisabledSource from "./variants/disabled.tsx?raw";

import FontWeightSelectorExample from "./variants/font-weight-selector";

import FontWeightSelectorSource from "./variants/font-weight-selector.tsx?raw";

import VerticalExample from "./variants/vertical";

import VerticalSource from "./variants/vertical.tsx?raw";

import SizeExample from "./variants/size";

import SizeSource from "./variants/size.tsx?raw";

const meta = {
  title: "UI/Toggle Group",
  component: ToggleGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("toggle-group"),
      },
    },
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof ToggleGroup> = {
  args: {
    variant: "default",
    size: "default",
    spacing: 2,
    orientation: "horizontal",
    multiple: false,
  },
  argTypes: {
    variant: { control: "select", options: ["default", "outline"] },
    size: { control: "select", options: ["default", "sm", "lg"] },
    spacing: { control: { type: "range", min: 0, max: 8, step: 1 } },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    multiple: { control: "boolean" },
  },
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
