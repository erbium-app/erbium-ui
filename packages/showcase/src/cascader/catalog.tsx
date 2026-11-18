import type { Meta, StoryObj } from "../types";

import { Cascader } from "@erbium/ui/components/cascader";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/cascader-demo.tsx?raw";

import ControlledExample from "./variants/controlled";

import ControlledSource from "./variants/controlled.tsx?raw";

import MultipleExample from "./variants/multiple";

import MultipleSource from "./variants/multiple.tsx?raw";

import CustomExample from "./variants/custom";

import CustomSource from "./variants/custom.tsx?raw";

import DisabledExample from "./variants/disabled";

import DisabledSource from "./variants/disabled.tsx?raw";

import FormExample from "./variants/form";

import FormSource from "./variants/form.tsx?raw";

const meta = {
  component: Cascader,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("cascader"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Cascader>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  disabled: boolean;
  multiple: boolean;
  searchable: boolean;
  size: "sm" | "default";
}> = {
  argTypes: {
    disabled: { control: "boolean" },
    multiple: { control: "boolean" },
    searchable: { control: "boolean" },
    size: { control: "select", options: ["sm", "default"] },
  },
  args: PlaygroundDefaults,
  parameters: {
    docs: {
      description: { story: variantDocumentation("cascader", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("cascader", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("cascader", "controlled") },
      source: { code: ControlledSource },
    },
  },
  render: ControlledExample,
};

export const Multiple: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("cascader", "multiple") },
      source: { code: MultipleSource },
    },
  },
  render: MultipleExample,
};

export const Custom: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("cascader", "custom") },
      source: { code: CustomSource },
    },
  },
  render: CustomExample,
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("cascader", "disabled") },
      source: { code: DisabledSource },
    },
  },
  render: DisabledExample,
};

export const Form: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("cascader", "form") },
      source: { code: FormSource },
    },
  },
  render: FormExample,
};
