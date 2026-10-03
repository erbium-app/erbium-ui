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
  title: "UI/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("tooltip"),
      },
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
  sideOffset: number;
  defaultOpen: boolean;
}> = {
  args: { side: "top", align: "center", sideOffset: 4, defaultOpen: false },
  argTypes: {
    side: { control: "select", options: ["top", "right", "bottom", "left"] },
    align: { control: "select", options: ["start", "center", "end"] },
    sideOffset: { control: "number" },
    defaultOpen: { control: "boolean" },
  },
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
