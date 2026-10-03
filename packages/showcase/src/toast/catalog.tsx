import { Toast } from "@erbium/ui/components/toast";

import type { Meta, StoryObj } from "../types";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import TypesExample from "./variants/types";

import TypesSource from "./variants/types.tsx?raw";

import PromiseExample from "./variants/promise";

import PromiseSource from "./variants/promise.tsx?raw";

import ActionExample from "./variants/action";

import ActionSource from "./variants/action.tsx?raw";

import ProgressExample from "./variants/progress";

import ProgressSource from "./variants/progress.tsx?raw";

import QueueExample from "./variants/queue";

import QueueSource from "./variants/queue.tsx?raw";

const meta = {
  component: Toast,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("toast"),
      },
    },
  },
} satisfies Meta<typeof Toast>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  type: "success" | "info" | "warning" | "error";
  description: string;
}> = {
  args: { type: "success", description: "Saved successfully" },
  argTypes: {
    type: { control: "select", options: ["success", "info", "warning", "error"] },
    description: { control: "text" },
  },
  parameters: {
    docs: {
      description: { story: variantDocumentation("toast", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("toast", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Types: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("toast", "types") },
      source: { code: TypesSource },
    },
  },
  render: TypesExample,
};

export const Promise: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("toast", "promise") },
      source: { code: PromiseSource },
    },
  },
  render: PromiseExample,
};

export const Action: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("toast", "action") },
      source: { code: ActionSource },
    },
  },
  render: ActionExample,
};

export const Progress: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("toast", "progress") },
      source: { code: ProgressSource },
    },
  },
  render: ProgressExample,
};

export const Queue: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("toast", "queue") },
      source: { code: QueueSource },
    },
  },
  render: QueueExample,
};
