import type { Meta, StoryObj } from "../types";

import { Card } from "@erbium/ui/components/card";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import SmallExample from "./variants/small";

import SmallSource from "./variants/small.tsx?raw";

import EdgeToEdgeExample from "./variants/edge-to-edge";

import EdgeToEdgeSource from "./variants/edge-to-edge.tsx?raw";

import ImageExample from "./variants/image";

import ImageSource from "./variants/image.tsx?raw";

const meta = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("card"),
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof Card> = {
  args: { size: "default" },
  argTypes: {
    size: { control: "select", options: ["default", "sm"] },
    className: { table: { disable: true } },
  },
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
