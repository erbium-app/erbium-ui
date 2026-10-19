import type { Meta, StoryObj } from "../types";

import { Textarea } from "@erbium/ui/components/textarea";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import DisabledControlExample from "./variants/disabled-control";

import DisabledControlSource from "./variants/disabled-control.tsx?raw";

import InvalidExample from "./variants/invalid";

import InvalidSource from "./variants/invalid.tsx?raw";

import DisabledExample from "./variants/disabled";

import DisabledSource from "./variants/disabled.tsx?raw";

import FieldExample from "./variants/field";

import FieldSource from "./variants/field.tsx?raw";

import ButtonExample from "./variants/button";

import ButtonSource from "./variants/button.tsx?raw";

const meta = {
  component: Textarea,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("textarea"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof Textarea> = {
  argTypes: {
    disabled: { control: "boolean" },
    rows: { control: { max: 12, min: 1, type: "number" } },
  },
  args: { className: "", disabled: false, placeholder: "Type here", rows: 3 },
  parameters: {
    docs: {
      description: { story: variantDocumentation("textarea", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("textarea", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const DisabledControl: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("textarea", "disabled-control") },
      source: { code: DisabledControlSource },
    },
  },
  render: DisabledControlExample,
};

export const Invalid: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("textarea", "invalid") },
      source: { code: InvalidSource },
    },
  },
  render: InvalidExample,
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("textarea", "disabled") },
      source: { code: DisabledSource },
    },
  },
  render: DisabledExample,
};

export const Field: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("textarea", "field") },
      source: { code: FieldSource },
    },
  },
  render: FieldExample,
};

export const Button: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("textarea", "button") },
      source: { code: ButtonSource },
    },
  },
  render: ButtonExample,
};
