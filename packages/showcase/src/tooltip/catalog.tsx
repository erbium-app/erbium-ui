import { Tooltip } from "@erbium/ui/components/tooltip";

import type { Meta, StoryObj } from "../types";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import SideExample from "./variants/side";

import SideSource from "./variants/side.tsx?raw";

import WithKeyboardShortcutExample from "./variants/with-keyboard-shortcut";

import WithKeyboardShortcutSource from "./variants/with-keyboard-shortcut.tsx?raw";

import DisabledButtonExample from "./variants/disabled-button";

import DisabledButtonSource from "./variants/disabled-button.tsx?raw";

const meta = {
  component: Tooltip,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("tooltip"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
  sideOffset: number;
  defaultOpen: boolean;
}> = {
  argTypes: {
    align: { control: "select", options: ["start", "center", "end"] },
    defaultOpen: { control: "boolean" },
    side: { control: "select", options: ["top", "right", "bottom", "left"] },
    sideOffset: { control: "number" },
  },
  args: { align: "center", defaultOpen: false, side: "top", sideOffset: 4 },
  parameters: {
    docs: {
      description: { story: variantDocumentation("tooltip", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("tooltip", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Side: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("tooltip", "side") },
      source: { code: SideSource },
    },
  },
  render: SideExample,
};

export const WithKeyboardShortcut: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("tooltip", "with-keyboard-shortcut") },
      source: { code: WithKeyboardShortcutSource },
    },
  },
  render: WithKeyboardShortcutExample,
};

export const DisabledButton: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("tooltip", "disabled-button") },
      source: { code: DisabledButtonSource },
    },
  },
  render: DisabledButtonExample,
};
