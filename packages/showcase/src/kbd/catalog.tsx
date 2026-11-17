import type { Meta, StoryObj } from "../types";

import { Kbd } from "@erbium/ui/components/kbd";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/kbd-demo.tsx?raw";

import ButtonExample from "./variants/button";

import ButtonSource from "./examples/kbd-button.tsx?raw";

import HintExample from "./variants/hint";

import HintSource from "./examples/kbd-hint.tsx?raw";

import TooltipExample from "./variants/tooltip";

import TooltipSource from "./examples/kbd-tooltip.tsx?raw";

import InputGroupExample from "./variants/input-group";

import InputGroupSource from "./examples/kbd-input-group.tsx?raw";

const meta = {
  component: Kbd,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("kbd"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Kbd>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof Kbd> = {
  argTypes: {},
  args: PlaygroundDefaults,
  parameters: {
    docs: {
      description: { story: variantDocumentation("kbd", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("kbd", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Button: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("kbd", "button") },
      source: { code: ButtonSource },
    },
  },
  render: ButtonExample,
};

export const Hint: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("kbd", "hint") },
      source: { code: HintSource },
    },
  },
  render: HintExample,
};

export const Tooltip: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("kbd", "tooltip") },
      source: { code: TooltipSource },
    },
  },
  render: TooltipExample,
};

export const InputGroup: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("kbd", "input-group") },
      source: { code: InputGroupSource },
    },
  },
  render: InputGroupExample,
};
