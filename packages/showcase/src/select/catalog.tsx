import ReadonlySelectionExample from "./variants/readonly-selection";
import ReadonlySelectionSource from "./variants/readonly-selection.tsx?raw";
import type { Meta, StoryObj } from "../types";

import { Select } from "@erbium/ui/components/select";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/select-demo.tsx?raw";

import ScrollableExample from "./variants/scrollable";

import ScrollableSource from "./examples/select-scrollable.tsx?raw";

import GroupsExample from "./variants/groups";

import GroupsSource from "./examples/select-groups.tsx?raw";

import DisabledExample from "./variants/disabled";

import DisabledSource from "./examples/select-disabled.tsx?raw";

import InvalidExample from "./variants/invalid";

import InvalidSource from "./examples/select-invalid.tsx?raw";

import AlignItemWithTriggerExample from "./variants/align-item-with-trigger";

import AlignItemWithTriggerSource from "./examples/select-align-item.tsx?raw";

const meta = {
  component: Select,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("select"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
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
  argTypes: {
    align: { control: "select", options: ["start", "center", "end"] },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    side: { control: "select", options: ["top", "right", "bottom", "left"] },
    size: { control: "select", options: ["default", "sm"] },
  },
  args: PlaygroundDefaults,
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
    docs: {
      description: { story: variantDocumentation("select", "align-item-with-trigger") },
      source: { code: AlignItemWithTriggerSource },
    },
    layout: "padded",
  },
  render: AlignItemWithTriggerExample,
};

export const ReadonlySelection: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("select", "readonly-selection") },
      source: { code: ReadonlySelectionSource },
    },
  },
  render: ReadonlySelectionExample,
};
