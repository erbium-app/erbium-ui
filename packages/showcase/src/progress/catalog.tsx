import type { Meta, StoryObj } from "../types";

import { Progress } from "@erbium/ui/components/progress";
import IndeterminateExample from "./variants/indeterminate";
import IndeterminateSource from "./variants/indeterminate.tsx?raw";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/progress-demo.tsx?raw";

import PartialExample from "./variants/partial";

import PartialSource from "./variants/partial.tsx?raw";

import CompleteExample from "./variants/complete";

import CompleteSource from "./variants/complete.tsx?raw";

import LabelExample from "./variants/label";

import LabelSource from "./examples/progress-label.tsx?raw";

import ControlledExample from "./variants/controlled";

import ControlledSource from "./examples/progress-controlled.tsx?raw";

const meta = {
  component: Progress,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("progress"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Progress>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof Progress> = {
  argTypes: { value: { control: { max: 100, min: 0, step: 1, type: "range" } } },
  args: PlaygroundDefaults,
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

export const Indeterminate: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("progress", "indeterminate") },
      source: { code: IndeterminateSource },
    },
  },
  render: IndeterminateExample,
};
