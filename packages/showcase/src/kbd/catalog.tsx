import type { Meta, StoryObj } from "../types";

import { Kbd } from "@erbium/ui/components/kbd";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import ButtonExample from "./variants/button";

import ButtonSource from "./variants/button.tsx?raw";

import TooltipExample from "./variants/tooltip";

import TooltipSource from "./variants/tooltip.tsx?raw";

import InputGroupExample from "./variants/input-group";

import InputGroupSource from "./variants/input-group.tsx?raw";

const meta = {
  component: Kbd,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("kbd"),
      },
    },
  },
} satisfies Meta<typeof Kbd>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof Kbd> = {
  args: { hotkey: "Mod+K", className: "" },
  argTypes: {},
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
