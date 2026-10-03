import { Drawer } from "@erbium/ui/components/drawer";

import type { Meta, StoryObj } from "../types";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import SwipeHandleExample from "./variants/swipe-handle";

import SwipeHandleSource from "./variants/swipe-handle.tsx?raw";

import NonModalExample from "./variants/non-modal";

import NonModalSource from "./variants/non-modal.tsx?raw";

import SnapPointsExample from "./variants/snap-points";

import SnapPointsSource from "./variants/snap-points.tsx?raw";

import PositionExample from "./variants/position";

import PositionSource from "./variants/position.tsx?raw";

import NestedExample from "./variants/nested";

import NestedSource from "./variants/nested.tsx?raw";

import CustomSizesExample from "./variants/custom-sizes";

import CustomSizesSource from "./variants/custom-sizes.tsx?raw";

import StylingExample from "./variants/styling";

import StylingSource from "./variants/styling.tsx?raw";

import ResponsiveExample from "./variants/responsive";

import ResponsiveSource from "./variants/responsive.tsx?raw";

const meta = {
  component: Drawer,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("drawer"),
      },
    },
  },
} satisfies Meta<typeof Drawer>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  swipeDirection: "up" | "down" | "left" | "right";
  modal: boolean;
  showSwipeHandle: boolean;
  showCloseButton: boolean;
}> = {
  args: { swipeDirection: "down", modal: true, showSwipeHandle: true, showCloseButton: false },
  argTypes: {
    swipeDirection: { control: "select", options: ["up", "down", "left", "right"] },
    modal: { control: "boolean" },
    showSwipeHandle: { control: "boolean" },
    showCloseButton: { control: "boolean" },
  },
  parameters: {
    docs: {
      description: { story: variantDocumentation("drawer", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("drawer", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const SwipeHandle: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("drawer", "swipe-handle") },
      source: { code: SwipeHandleSource },
    },
  },
  render: SwipeHandleExample,
};

export const NonModal: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("drawer", "non-modal") },
      source: { code: NonModalSource },
    },
  },
  render: NonModalExample,
};

export const SnapPoints: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("drawer", "snap-points") },
      source: { code: SnapPointsSource },
    },
  },
  render: SnapPointsExample,
};

export const Position: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("drawer", "position") },
      source: { code: PositionSource },
    },
  },
  render: PositionExample,
};

export const Nested: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("drawer", "nested") },
      source: { code: NestedSource },
    },
  },
  render: NestedExample,
};

export const CustomSizes: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("drawer", "custom-sizes") },
      source: { code: CustomSizesSource },
    },
  },
  render: CustomSizesExample,
};

export const Styling: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("drawer", "styling") },
      source: { code: StylingSource },
    },
  },
  render: StylingExample,
};

export const Responsive: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("drawer", "responsive") },
      source: { code: ResponsiveSource },
    },
  },
  render: ResponsiveExample,
};
