import type { Meta, StoryObj } from "../types";

import { Toggle } from "@erbium/ui/components/toggle";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import PressedExample from "./variants/pressed";

import PressedSource from "./variants/pressed.tsx?raw";

import DisabledControlExample from "./variants/disabled-control";

import DisabledControlSource from "./variants/disabled-control.tsx?raw";

import OutlineExample from "./variants/outline";

import OutlineSource from "./variants/outline.tsx?raw";

import DisabledExample from "./variants/disabled";

import DisabledSource from "./variants/disabled.tsx?raw";

import WithTextExample from "./variants/with-text";

import WithTextSource from "./variants/with-text.tsx?raw";

import SizeExample from "./variants/size";

import SizeSource from "./variants/size.tsx?raw";

const meta = {
  component: Toggle,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("toggle"),
      },
    },
  },
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof Toggle> = {
  args: { variant: "default", size: "default", defaultPressed: false, className: "" },
  argTypes: {
    variant: { control: "select", options: ["default", "outline"] },
    size: { control: "select", options: ["default", "sm", "lg"] },
    defaultPressed: { control: "boolean" },
  },
  parameters: {
    docs: {
      description: { story: variantDocumentation("toggle", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("toggle", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Pressed: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("toggle", "pressed") },
      source: { code: PressedSource },
    },
  },
  render: PressedExample,
};

export const DisabledControl: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("toggle", "disabled-control") },
      source: { code: DisabledControlSource },
    },
  },
  render: DisabledControlExample,
};

export const Outline: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("toggle", "outline") },
      source: { code: OutlineSource },
    },
  },
  render: OutlineExample,
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("toggle", "disabled") },
      source: { code: DisabledSource },
    },
  },
  render: DisabledExample,
};

export const WithText: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("toggle", "with-text") },
      source: { code: WithTextSource },
    },
  },
  render: WithTextExample,
};

export const Size: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("toggle", "size") },
      source: { code: SizeSource },
    },
  },
  render: SizeExample,
};
