import type { Meta, StoryObj } from "../types";

import { Progress } from "@erbium/ui/components/progress";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import PartialExample from "./variants/partial";

import PartialSource from "./variants/partial.tsx?raw";

import CompleteExample from "./variants/complete";

import CompleteSource from "./variants/complete.tsx?raw";

import LabelExample from "./variants/label";

import LabelSource from "./variants/label.tsx?raw";

import ControlledExample from "./variants/controlled";

import ControlledSource from "./variants/controlled.tsx?raw";

const meta = {
  title: "UI/Progress",
  component: Progress,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("progress"),
      },
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof Progress> = {
  args: { value: 45, className: "" },
  argTypes: { value: { control: { type: "range", min: 0, max: 100, step: 1 } } },
  parameters: {
    docs: {
      description: { story: variantDocumentation("progress", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("progress", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Partial: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("progress", "partial") },
      source: { code: PartialSource },
    },
  },
  render: PartialExample,
};

export const Complete: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("progress", "complete") },
      source: { code: CompleteSource },
    },
  },
  render: CompleteExample,
};

export const Label: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("progress", "label") },
      source: { code: LabelSource },
    },
  },
  render: LabelExample,
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("progress", "controlled") },
      source: { code: ControlledSource },
    },
  },
  render: ControlledExample,
};
