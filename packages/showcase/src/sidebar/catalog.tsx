import type { Meta, StoryObj } from "../types";

import { Sidebar } from "@erbium/ui/components/sidebar";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/sidebar-demo.tsx?raw";

const PlaygroundSource = OverviewSource;

const meta = {
  component: Sidebar,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("sidebar"),
      },
    },
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Sidebar>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  side: "left" | "right";
  variant: "sidebar" | "inset";
  collapsible: "offcanvas" | "icon" | "none";
  defaultOpen: boolean;
}> = {
  argTypes: {
    collapsible: { control: "select", options: ["offcanvas", "icon", "none"] },
    defaultOpen: { control: "boolean" },
    side: { control: "select", options: ["left", "right"] },
    variant: { control: "select", options: ["sidebar", "inset"] },
  },
  args: PlaygroundDefaults,
  parameters: {
    docs: {
      description: { story: variantDocumentation("sidebar", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("sidebar", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};
