import type { Meta, StoryObj } from "../types";

import { Sidebar } from "@erbium/ui/components/sidebar";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import ControlledSidebarExample from "./variants/controlled-sidebar";

import ControlledSidebarSource from "./variants/controlled-sidebar.tsx?raw";

const meta = {
  title: "UI/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("sidebar"),
      },
    },
  },
} satisfies Meta<typeof Sidebar>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  side: "left" | "right";
  variant: "sidebar" | "floating" | "inset";
  collapsible: "offcanvas" | "icon" | "none";
  defaultOpen: boolean;
}> = {
  args: { side: "left", variant: "sidebar", collapsible: "none", defaultOpen: true },
  argTypes: {
    side: { control: "select", options: ["left", "right"] },
    variant: { control: "select", options: ["sidebar", "floating", "inset"] },
    collapsible: { control: "select", options: ["offcanvas", "icon", "none"] },
    defaultOpen: { control: "boolean" },
  },
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
