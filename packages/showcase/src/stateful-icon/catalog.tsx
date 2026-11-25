// oxlint-disable sonarjs/no-duplicate-string -- the registry build inlines these docs calls by their literal text
import CheckboxStateExample from "./variants/checkbox-state";
import CheckboxStateSource from "./variants/checkbox-state.tsx?raw";
import type { Meta, StoryObj } from "../types";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import CopyFeedbackExample from "./variants/copy-feedback";

import CopyFeedbackSource from "./examples/stateful-icon-demo.tsx?raw";

import RotatingChevronExample from "./variants/rotating-chevron";

import RotatingChevronSource from "./variants/rotating-chevron.tsx?raw";

const meta = {
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("stateful-icon"),
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const CopyFeedback: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("stateful-icon", "copy-feedback") },
      source: { code: CopyFeedbackSource },
    },
  },
  render: CopyFeedbackExample,
};

export const RotatingChevron: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("stateful-icon", "rotating-chevron") },
      source: { code: RotatingChevronSource },
    },
  },
  render: RotatingChevronExample,
};

export const CheckboxState: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("stateful-icon", "checkbox-state") },
      source: { code: CheckboxStateSource },
    },
  },
  render: CheckboxStateExample,
};
