import type { Meta, StoryObj } from "../types";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import ValidationExample from "./variants/validation";

import ValidationSource from "./variants/validation.tsx?raw";

const meta = {
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("form"),
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  defaultEmail: string;
  required: boolean;
  submitLabel: string;
}> = {
  args: { defaultEmail: "", required: true, submitLabel: "Submit" },
  argTypes: {
    defaultEmail: { control: "text" },
    required: { control: "boolean" },
    submitLabel: { control: "text" },
  },
  parameters: {
    docs: {
      description: { story: variantDocumentation("form", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Validation: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("form", "validation") },
      source: { code: ValidationSource },
    },
  },
  render: ValidationExample,
};
