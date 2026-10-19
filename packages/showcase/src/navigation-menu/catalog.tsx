import type { Meta, StoryObj } from "../types";

import { NavigationMenu } from "@erbium/ui/components/navigation-menu";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import LinkComponentExample from "./variants/link-component";

import LinkComponentSource from "./variants/link-component.tsx?raw";

const meta = {
  component: NavigationMenu,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("navigation-menu"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof NavigationMenu>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  orientation: "horizontal" | "vertical";
  align: "start" | "center" | "end";
}> = {
  argTypes: {
    align: { control: "select", options: ["start", "center", "end"] },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
  args: { align: "start", orientation: "horizontal" },
  parameters: {
    docs: {
      description: { story: variantDocumentation("navigation-menu", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("navigation-menu", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const LinkComponent: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("navigation-menu", "link-component") },
      source: { code: LinkComponentSource },
    },
  },
  render: LinkComponentExample,
};
