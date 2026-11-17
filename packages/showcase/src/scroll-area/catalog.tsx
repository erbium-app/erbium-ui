import type { Meta, StoryObj } from "../types";

import { ScrollArea } from "@erbium/ui/components/scroll-area";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/scroll-area-demo.tsx?raw";

import HorizontalExample from "./variants/horizontal";

import HorizontalSource from "./variants/horizontal.tsx?raw";

const meta = {
  component: ScrollArea,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("scroll-area"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ScrollArea>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof ScrollArea> = {
  argTypes: {
    fade: { control: "select", options: ["vertical", "horizontal", false] },
    scrollbar: { control: "select", options: ["thin", "default", "none"] },
    scrollbarVisibility: { control: "select", options: ["always", "hover", "scroll"] },
  },
  args: PlaygroundDefaults,
  parameters: {
    docs: {
      description: { story: variantDocumentation("scroll-area", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("scroll-area", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Horizontal: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("scroll-area", "horizontal") },
      source: { code: HorizontalSource },
    },
  },
  render: HorizontalExample,
};
