import type { Meta, StoryObj } from "../types";

import { Sidebar } from "@erbium/ui/components/sidebar";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/sidebar-demo.tsx?raw";

import ControlledSidebarExample from "./variants/controlled-sidebar";

import ControlledSidebarSource from "./examples/sidebar-controlled.tsx?raw";

const meta = {
  component: Sidebar,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("sidebar"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Sidebar>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  side: "left" | "right";
  variant: "sidebar" | "floating" | "inset";
  collapsible: "offcanvas" | "icon" | "none";
  defaultOpen: boolean;
}> = {
  argTypes: {
    collapsible: { control: "select", options: ["offcanvas", "icon", "none"] },
    defaultOpen: { control: "boolean" },
    side: { control: "select", options: ["left", "right"] },
    variant: { control: "select", options: ["sidebar", "floating", "inset"] },
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

export const ControlledSidebar: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("sidebar", "controlled-sidebar") },
      source: { code: ControlledSidebarSource },
    },
  },
  render: ControlledSidebarExample,
};
