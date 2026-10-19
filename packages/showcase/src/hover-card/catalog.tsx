import type { Meta, StoryObj } from "../types";

import { HoverCard } from "@erbium/ui/components/hover-card";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import BasicExample from "./variants/basic";

import BasicSource from "./variants/basic.tsx?raw";

import SidesExample from "./variants/sides";

import SidesSource from "./variants/sides.tsx?raw";

import TriggerDelaysExample from "./variants/trigger-delays";

import TriggerDelaysSource from "./variants/trigger-delays.tsx?raw";

import PositioningExample from "./variants/positioning";

import PositioningSource from "./variants/positioning.tsx?raw";

const meta = {
  component: HoverCard,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("hover-card"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof HoverCard>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
  sideOffset: number;
  defaultOpen: boolean;
}> = {
  argTypes: {
    align: { control: "select", options: ["start", "center", "end"] },
    defaultOpen: { control: "boolean" },
    side: { control: "select", options: ["top", "right", "bottom", "left"] },
    sideOffset: { control: "number" },
  },
  args: { align: "center", defaultOpen: false, side: "bottom", sideOffset: 4 },
  parameters: {
    docs: {
      description: { story: variantDocumentation("hover-card", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("hover-card", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Basic: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("hover-card", "basic") },
      source: { code: BasicSource },
    },
  },
  render: BasicExample,
};

export const Sides: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("hover-card", "sides") },
      source: { code: SidesSource },
    },
  },
  render: SidesExample,
};

export const TriggerDelays: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("hover-card", "trigger-delays") },
      source: { code: TriggerDelaysSource },
    },
  },
  render: TriggerDelaysExample,
};

export const Positioning: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("hover-card", "positioning") },
      source: { code: PositioningSource },
    },
  },
  render: PositioningExample,
};
