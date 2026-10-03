import type { Meta, StoryObj } from "../types";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import VerticalExample from "./variants/vertical";

import VerticalSource from "./variants/vertical.tsx?raw";

import HandleExample from "./variants/handle";

import HandleSource from "./variants/handle.tsx?raw";

const meta = {
  title: "UI/Resizable",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("resizable"),
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  orientation: "horizontal" | "vertical";
  firstPanelSize: number;
  showHandle: boolean;
}> = {
  args: { orientation: "horizontal", firstPanelSize: 50, showHandle: true },
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    firstPanelSize: { control: { type: "range", min: 10, max: 90, step: 5 } },
    showHandle: { control: "boolean" },
  },
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
