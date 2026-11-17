import type { Meta, StoryObj } from "../types";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/resizable-demo.tsx?raw";

import VerticalExample from "./variants/vertical";

import VerticalSource from "./examples/resizable-vertical.tsx?raw";

import HandleExample from "./variants/handle";

import HandleSource from "./examples/resizable-handle.tsx?raw";

const meta = {
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("resizable"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  orientation: "horizontal" | "vertical";
  firstPanelSize: number;
  showHandle: boolean;
}> = {
  argTypes: {
    firstPanelSize: { control: { max: 90, min: 10, step: 5, type: "range" } },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    showHandle: { control: "boolean" },
  },
  args: PlaygroundDefaults,
  parameters: {
    docs: {
      description: { story: variantDocumentation("resizable", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("resizable", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Vertical: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("resizable", "vertical") },
      source: { code: VerticalSource },
    },
  },
  render: VerticalExample,
};

export const Handle: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("resizable", "handle") },
      source: { code: HandleSource },
    },
  },
  render: HandleExample,
};
