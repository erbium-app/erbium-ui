import { Sheet } from "@erbium/ui/components/sheet";

import type { Meta, StoryObj } from "../types";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import SideExample from "./variants/side";

import SideSource from "./variants/side.tsx?raw";

import NoCloseButtonExample from "./variants/no-close-button";

import NoCloseButtonSource from "./variants/no-close-button.tsx?raw";

const meta = {
  title: "UI/Sheet",
  component: Sheet,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("sheet"),
      },
    },
  },
} satisfies Meta<typeof Sheet>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  side: "top" | "right" | "bottom" | "left";
  showCloseButton: boolean;
  defaultOpen: boolean;
}> = {
  args: { side: "right", showCloseButton: true, defaultOpen: false },
  argTypes: {
    side: { control: "select", options: ["top", "right", "bottom", "left"] },
    showCloseButton: { control: "boolean" },
    defaultOpen: { control: "boolean" },
  },
  parameters: {
    docs: {
      description: { story: variantDocumentation("sheet", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("sheet", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Side: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("sheet", "side") },
      source: { code: SideSource },
    },
  },
  render: SideExample,
};

export const NoCloseButton: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("sheet", "no-close-button") },
      source: { code: NoCloseButtonSource },
    },
  },
  render: NoCloseButtonExample,
};
