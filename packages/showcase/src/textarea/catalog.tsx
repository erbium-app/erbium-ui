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
  title: "UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("textarea"),
      },
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof Textarea> = {
  args: { placeholder: "Type here", disabled: false, rows: 3, className: "" },
  argTypes: {
    disabled: { control: "boolean" },
    rows: { control: { type: "number", min: 1, max: 12 } },
  },
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
