import type { Meta, StoryObj } from "../types";

import { Tabs } from "@erbium/ui/components/tabs";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import SelectionExample from "./variants/selection";

import SelectionSource from "./variants/selection.tsx?raw";

import VerticalExample from "./variants/vertical";

import VerticalSource from "./variants/vertical.tsx?raw";

import DisabledExample from "./variants/disabled";

import DisabledSource from "./variants/disabled.tsx?raw";

import IconsExample from "./variants/icons";

import IconsSource from "./variants/icons.tsx?raw";

const meta = {
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("tabs"),
      },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof Tabs> = {
  args: { defaultValue: "one", orientation: "horizontal" },
  argTypes: {
    defaultValue: { control: "select", options: ["one", "two"] },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
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
