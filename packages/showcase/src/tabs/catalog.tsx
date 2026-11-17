import type { Meta, StoryObj } from "../types";

import { Tabs } from "@erbium/ui/components/tabs";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/tabs-demo.tsx?raw";

import SelectionExample from "./variants/selection";

import SelectionSource from "./variants/selection.tsx?raw";

import VerticalExample from "./variants/vertical";

import VerticalSource from "./examples/tabs-vertical.tsx?raw";

import DisabledExample from "./variants/disabled";

import DisabledSource from "./examples/tabs-disabled.tsx?raw";

import IconsExample from "./variants/icons";

import IconsSource from "./examples/tabs-icons.tsx?raw";

const meta = {
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("tabs"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof Tabs> = {
  argTypes: {
    defaultValue: { control: "select", options: ["one", "two"] },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
  args: PlaygroundDefaults,
  parameters: {
    docs: {
      description: { story: variantDocumentation("tabs", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("tabs", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Selection: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("tabs", "selection") },
      source: { code: SelectionSource },
    },
  },
  render: SelectionExample,
};

export const Vertical: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("tabs", "vertical") },
      source: { code: VerticalSource },
    },
  },
  render: VerticalExample,
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("tabs", "disabled") },
      source: { code: DisabledSource },
    },
  },
  render: DisabledExample,
};

export const Icons: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("tabs", "icons") },
      source: { code: IconsSource },
    },
  },
  render: IconsExample,
};
