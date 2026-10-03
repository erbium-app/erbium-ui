import type { Meta, StoryObj } from "../types";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import SemanticExample from "./variants/semantic";

import SemanticSource from "./variants/semantic.tsx?raw";

const meta = {
  title: "Foundations/Colors",
  parameters: {
    docs: { description: { component: componentDocumentation("colors") } },
    layout: "padded",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Semantic: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("colors", "semantic") },
      source: { code: SemanticSource },
    },
  },
  render: SemanticExample,
};
