import type { Meta, StoryObj } from "../types";

import { DirectionProvider } from "@erbium/ui/components/direction";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

const meta = {
  component: DirectionProvider,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("direction"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DirectionProvider>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{ direction: "ltr" | "rtl" }> = {
  argTypes: { direction: { control: "select", options: ["ltr", "rtl"] } },
  args: { direction: "ltr" },
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
