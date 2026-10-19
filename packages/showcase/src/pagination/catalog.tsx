import type { Meta, StoryObj } from "../types";

import { Pagination } from "@erbium/ui/components/pagination";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import SimpleExample from "./variants/simple";

import SimpleSource from "./variants/simple.tsx?raw";

import IconsOnlyExample from "./variants/icons-only";

import IconsOnlySource from "./variants/icons-only.tsx?raw";

const meta = {
  component: Pagination,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("pagination"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof Pagination> = {
  argTypes: { className: { control: "text" } },
  args: { className: "" },
  parameters: {
    docs: {
      description: { story: variantDocumentation("pagination", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("pagination", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Simple: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("pagination", "simple") },
      source: { code: SimpleSource },
    },
  },
  render: SimpleExample,
};

export const IconsOnly: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("pagination", "icons-only") },
      source: { code: IconsOnlySource },
    },
  },
  render: IconsOnlyExample,
};
