import type { Meta, StoryObj } from "../types";

import { Select } from "@erbium/ui/components/select";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import ScrollableExample from "./variants/scrollable";

import ScrollableSource from "./variants/scrollable.tsx?raw";

import GroupsExample from "./variants/groups";

import GroupsSource from "./variants/groups.tsx?raw";

import DisabledExample from "./variants/disabled";

import DisabledSource from "./variants/disabled.tsx?raw";

import InvalidExample from "./variants/invalid";

import InvalidSource from "./variants/invalid.tsx?raw";

import AlignItemWithTriggerExample from "./variants/align-item-with-trigger";

import AlignItemWithTriggerSource from "./variants/align-item-with-trigger.tsx?raw";

const meta = {
  title: "UI/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("select"),
      },
    },
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  size: "default" | "sm";
  disabled: boolean;
  placeholder: string;
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
}> = {
  args: {
    size: "default",
    disabled: false,
    placeholder: "Select a fruit",
    side: "bottom",
    align: "start",
  },
  argTypes: {
    size: { control: "select", options: ["default", "sm"] },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    side: { control: "select", options: ["top", "right", "bottom", "left"] },
    align: { control: "select", options: ["start", "center", "end"] },
  },
  parameters: {
    docs: {
      description: { story: variantDocumentation("select", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("select", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Scrollable: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("select", "scrollable") },
      source: { code: ScrollableSource },
    },
  },
  render: ScrollableExample,
};

export const Groups: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("select", "groups") },
      source: { code: GroupsSource },
    },
  },
  render: GroupsExample,
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("select", "disabled") },
      source: { code: DisabledSource },
    },
  },
  render: DisabledExample,
};

export const Invalid: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("select", "invalid") },
      source: { code: InvalidSource },
    },
  },
  render: InvalidExample,
};

export const AlignItemWithTrigger: Story = {
  parameters: {
    layout: "padded",
    docs: {
      description: { story: variantDocumentation("select", "align-item-with-trigger") },
      source: { code: AlignItemWithTriggerSource },
    },
  },
  render: AlignItemWithTriggerExample,
};
