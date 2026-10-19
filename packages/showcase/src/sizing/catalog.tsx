import type { Meta, StoryObj } from "../types";
import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";
import ControlsExample from "./variants/controls";
import ControlsSource from "./variants/controls.tsx?raw";
import CompositionExample from "./variants/composition";
import CompositionSource from "./variants/composition.tsx?raw";
import WorkflowExample from "./variants/workflow";
import WorkflowSource from "./variants/workflow.tsx?raw";

const meta = {
  parameters: {
    docs: { description: { component: componentDocumentation("sizing") } },
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Controls: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("sizing", "controls") },
      source: { code: ControlsSource },
    },
  },
  render: ControlsExample,
};

export const Composition: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("sizing", "composition") },
      source: { code: CompositionSource },
    },
  },
  render: CompositionExample,
};

export const Workflow: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("sizing", "workflow") },
      source: { code: WorkflowSource },
    },
  },
  render: WorkflowExample,
};
