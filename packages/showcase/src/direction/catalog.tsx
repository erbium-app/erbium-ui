import type { Meta, StoryObj } from "../types";

import { DirectionProvider } from "@erbium/ui/components/direction";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

const meta = {
  component: DirectionProvider,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("direction"),
      },
    },
  },
} satisfies Meta<typeof DirectionProvider>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{ direction: "ltr" | "rtl" }> = {
  args: { direction: "ltr" },
  argTypes: { direction: { control: "select", options: ["ltr", "rtl"] } },
  parameters: {
    docs: {
      description: { story: variantDocumentation("direction", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("direction", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};
