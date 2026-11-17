import SearchAndControlsExample from "./variants/search-and-controls";
import SearchAndControlsSource from "./variants/search-and-controls.tsx?raw";
import { Drawer } from "@erbium/ui/components/drawer";

import type { Meta, StoryObj } from "../types";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/drawer-demo.tsx?raw";

import SwipeHandleExample from "./variants/swipe-handle";

import SwipeHandleSource from "./examples/drawer-swipe-handle.tsx?raw";

import NonModalExample from "./variants/non-modal";

import NonModalSource from "./examples/drawer-non-modal.tsx?raw";

import SnapPointsExample from "./variants/snap-points";

import SnapPointsSource from "./examples/drawer-snap-points.tsx?raw";

import PositionExample from "./variants/position";

import PositionSource from "./examples/drawer-sides.tsx?raw";

import NestedExample from "./variants/nested";

import NestedSource from "./examples/drawer-nested.tsx?raw";

import CustomSizesExample from "./variants/custom-sizes";

import CustomSizesSource from "./variants/custom-sizes.tsx?raw";

import StylingExample from "./variants/styling";

import StylingSource from "./variants/styling.tsx?raw";

import ResponsiveExample from "./variants/responsive";

import ResponsiveSource from "./variants/responsive.tsx?raw";

const meta = {
  component: Drawer,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("drawer"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Drawer>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  swipeDirection: "up" | "down" | "left" | "right";
  modal: boolean;
  showSwipeHandle: boolean;
  showCloseButton: boolean;
}> = {
  argTypes: {
    modal: { control: "boolean" },
    showCloseButton: { control: "boolean" },
    showSwipeHandle: { control: "boolean" },
    swipeDirection: { control: "select", options: ["up", "down", "left", "right"] },
  },
  args: PlaygroundDefaults,
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

export const SearchAndControls: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("drawer", "search-and-controls") },
      source: { code: SearchAndControlsSource },
    },
  },
  render: SearchAndControlsExample,
};
