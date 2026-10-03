import type { Meta, StoryObj } from "../types";

import { AspectRatio } from "@erbium/ui/components/aspect-ratio";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import SquareExample from "./variants/square";

import SquareSource from "./variants/square.tsx?raw";

import PortraitExample from "./variants/portrait";

import PortraitSource from "./variants/portrait.tsx?raw";

const meta = {
  title: "UI/Aspect Ratio",
  component: AspectRatio,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("aspect-ratio"),
      },
    },
  },
} satisfies Meta<typeof AspectRatio>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof AspectRatio> = {
  args: { ratio: 16 / 9, className: "" },
  argTypes: { ratio: { control: { type: "number", min: 0.25, max: 4, step: 0.25 } } },
  parameters: {
    docs: {
      description: { story: variantDocumentation("aspect-ratio", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("aspect-ratio", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Square: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("aspect-ratio", "square") },
      source: { code: SquareSource },
    },
  },
  render: SquareExample,
};

export const Portrait: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("aspect-ratio", "portrait") },
      source: { code: PortraitSource },
    },
  },
  render: PortraitExample,
};
