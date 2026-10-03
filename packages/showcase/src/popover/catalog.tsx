import { Popover } from "@erbium/ui/components/popover";

import type { Meta, StoryObj } from "../types";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import BasicExample from "./variants/basic";

import BasicSource from "./variants/basic.tsx?raw";

import AlignExample from "./variants/align";

import AlignSource from "./variants/align.tsx?raw";

import WithFormExample from "./variants/with-form";

import WithFormSource from "./variants/with-form.tsx?raw";

const meta = {
  component: Popover,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("popover"),
      },
    },
  },
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
  defaultOpen: boolean;
}> = {
  args: { side: "bottom", align: "center", defaultOpen: false },
  argTypes: {
    side: { control: "select", options: ["top", "right", "bottom", "left"] },
    align: { control: "select", options: ["start", "center", "end"] },
    defaultOpen: { control: "boolean" },
  },
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
