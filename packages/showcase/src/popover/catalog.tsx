import { Popover } from "@erbium/ui/components/popover";

import type { Meta, StoryObj } from "../types";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/popover-demo.tsx?raw";

import BasicExample from "./variants/basic";

import BasicSource from "./examples/popover-basic.tsx?raw";

import AlignExample from "./variants/align";

import AlignSource from "./examples/popover-alignments.tsx?raw";

import WithFormExample from "./variants/with-form";

import WithFormSource from "./examples/popover-form.tsx?raw";

const meta = {
  component: Popover,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("popover"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
  defaultOpen: boolean;
}> = {
  argTypes: {
    align: { control: "select", options: ["start", "center", "end"] },
    defaultOpen: { control: "boolean" },
    side: { control: "select", options: ["top", "right", "bottom", "left"] },
  },
  args: PlaygroundDefaults,
  parameters: {
    docs: {
      description: { story: variantDocumentation("popover", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("popover", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Basic: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("popover", "basic") },
      source: { code: BasicSource },
    },
  },
  render: BasicExample,
};

export const Align: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("popover", "align") },
      source: { code: AlignSource },
    },
  },
  render: AlignExample,
};

export const WithForm: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("popover", "with-form") },
      source: { code: WithFormSource },
    },
  },
  render: WithFormExample,
};
