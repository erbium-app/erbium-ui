import type { Meta, StoryObj } from "../types";

import { SegmentedControl } from "@erbium/ui/components/segmented-control";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/segmented-control-demo.tsx?raw";

import FilterExample from "./variants/filter";

import FilterSource from "./examples/segmented-control-filter.tsx?raw";

import NavigationExample from "./variants/navigation";

import NavigationSource from "./examples/segmented-control-navigation.tsx?raw";

import FormExample from "./variants/form";

import FormSource from "./examples/segmented-control-form.tsx?raw";

const name = "segmented-control";

const meta = {
  component: SegmentedControl,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation(name),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SegmentedControl>;

export default meta;

type Story = StoryObj;

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation(name, "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Filter: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation(name, "filter") },
      source: { code: FilterSource },
    },
  },
  render: FilterExample,
};

export const Navigation: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation(name, "navigation") },
      source: { code: NavigationSource },
    },
  },
  render: NavigationExample,
};

export const Form: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation(name, "form") },
      source: { code: FormSource },
    },
  },
  render: FormExample,
};
