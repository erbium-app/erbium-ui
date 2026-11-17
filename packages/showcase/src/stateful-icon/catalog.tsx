import CheckboxStateExample from "./variants/checkbox-state";
import CheckboxStateSource from "./variants/checkbox-state.tsx?raw";
import type { Meta, StoryObj } from "../types";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import CopyFeedbackExample from "./variants/copy-feedback";

import CopyFeedbackSource from "./examples/stateful-icon-demo.tsx?raw";

import RotatingChevronExample from "./variants/rotating-chevron";

import RotatingChevronSource from "./variants/rotating-chevron.tsx?raw";

import ExpandableChevronExample from "./variants/expandable-chevron";

import ExpandableChevronSource from "./variants/expandable-chevron.tsx?raw";

import SidebarToggleIconExample from "./variants/sidebar-toggle-icon";

import SidebarToggleIconSource from "./variants/sidebar-toggle-icon.tsx?raw";

import ThemeToggleIconExample from "./variants/theme-toggle-icon";

import ThemeToggleIconSource from "./variants/theme-toggle-icon.tsx?raw";

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

export const ExpandableChevron: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("stateful-icon", "expandable-chevron") },
      source: { code: ExpandableChevronSource },
    },
  },
  render: ExpandableChevronExample,
};

export const SidebarToggleIcon: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("stateful-icon", "sidebar-toggle-icon") },
      source: { code: SidebarToggleIconSource },
    },
  },
  render: SidebarToggleIconExample,
};

export const ThemeToggleIcon: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("stateful-icon", "theme-toggle-icon") },
      source: { code: ThemeToggleIconSource },
    },
  },
  render: ThemeToggleIconExample,
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
