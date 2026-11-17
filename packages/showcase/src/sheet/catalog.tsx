import { Sheet } from "@erbium/ui/components/sheet";

import type { Meta, StoryObj } from "../types";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/sheet-demo.tsx?raw";

import SideExample from "./variants/side";

import SideSource from "./examples/sheet-side.tsx?raw";

import NoCloseButtonExample from "./variants/no-close-button";

import NoCloseButtonSource from "./examples/sheet-no-close-button.tsx?raw";

const meta = {
  component: Sheet,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("sheet"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Sheet>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  side: "top" | "right" | "bottom" | "left";
  showCloseButton: boolean;
  defaultOpen: boolean;
}> = {
  argTypes: {
    defaultOpen: { control: "boolean" },
    showCloseButton: { control: "boolean" },
    side: { control: "select", options: ["top", "right", "bottom", "left"] },
  },
  args: PlaygroundDefaults,
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
