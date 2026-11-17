import type { Meta, StoryObj } from "../types";

import { Pagination } from "@erbium/ui/components/pagination";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/pagination-demo.tsx?raw";

import SimpleExample from "./variants/simple";

import SimpleSource from "./examples/pagination-simple.tsx?raw";

import IconsOnlyExample from "./variants/icons-only";

import IconsOnlySource from "./examples/pagination-icons-only.tsx?raw";

import RouterExample from "./variants/router";

import RouterSource from "./examples/pagination-router.tsx?raw";

import TableExample from "./variants/table";

import TableSource from "./examples/pagination-table.tsx?raw";

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
  args: PlaygroundDefaults,
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

export const Router: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("pagination", "router") },
      source: { code: RouterSource },
    },
  },
  render: RouterExample,
};

export const Table: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("pagination", "table") },
      source: { code: TableSource },
    },
  },
  render: TableExample,
};
