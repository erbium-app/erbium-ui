import type { Meta, StoryObj } from "../types";

import { Card } from "@erbium/ui/components/card";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/card-demo.tsx?raw";

import SmallExample from "./variants/small";

import SmallSource from "./variants/small.tsx?raw";

import EdgeToEdgeExample from "./variants/edge-to-edge";

import EdgeToEdgeSource from "./variants/edge-to-edge.tsx?raw";

import ImageExample from "./variants/image";

import ImageSource from "./variants/image.tsx?raw";

const meta = {
  component: Card,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("card"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof Card> = {
  argTypes: {
    className: { table: { disable: true } },
    size: { control: "select", options: ["default", "sm"] },
  },
  args: PlaygroundDefaults,
  parameters: {
    docs: {
      description: { story: variantDocumentation("card", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("card", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Small: Story = {
  name: "Size",
  parameters: {
    docs: {
      description: { story: variantDocumentation("card", "small") },
      source: { code: SmallSource },
    },
  },
  render: SmallExample,
};

export const EdgeToEdge: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("card", "edge-to-edge") },
      source: { code: EdgeToEdgeSource },
    },
  },
  render: EdgeToEdgeExample,
};

export const Image: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("card", "image") },
      source: { code: ImageSource },
    },
  },
  render: ImageExample,
};
