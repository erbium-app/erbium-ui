import type { Meta, StoryObj } from "../types";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import VerticalExample from "./variants/vertical";

import VerticalSource from "./variants/vertical.tsx?raw";

import HorizontalRTLExample from "./variants/horizontal-rtl";

import HorizontalRTLSource from "./variants/horizontal-rtl.tsx?raw";

import SingleEdgeAndCustomDepthExample from "./variants/single-edge-and-custom-depth";

import SingleEdgeAndCustomDepthSource from "./variants/single-edge-and-custom-depth.tsx?raw";

const meta = {
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("scroll-fade"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Vertical: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("scroll-fade", "vertical") },
      source: { code: VerticalSource },
    },
  },
  render: VerticalExample,
};

export const HorizontalRTL: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("scroll-fade", "horizontal-rtl") },
      source: { code: HorizontalRTLSource },
    },
  },
  render: HorizontalRTLExample,
};

export const SingleEdgeAndCustomDepth: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("scroll-fade", "single-edge-and-custom-depth") },
      source: { code: SingleEdgeAndCustomDepthSource },
    },
  },
  render: SingleEdgeAndCustomDepthExample,
};
