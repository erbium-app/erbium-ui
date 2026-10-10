import { DiffView } from "@erbium/ui/blocks/diff-view";
import type { Meta, StoryObj } from "../types";
import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";
import OverviewExample from "./variants/overview";
import OverviewSource from "./variants/overview.tsx?raw";
import LayoutsExample from "./variants/layouts";
import LayoutsSource from "./variants/layouts.tsx?raw";
import HighlightingExample from "./variants/highlighting";
import HighlightingSource from "./variants/highlighting.tsx?raw";
import ContextExample from "./variants/context";
import ContextSource from "./variants/context.tsx?raw";
import AnnotationsExample from "./variants/annotations";
import AnnotationsSource from "./variants/annotations.tsx?raw";
import CompositionExample from "./variants/composition";
import CompositionSource from "./variants/composition.tsx?raw";
import StatesExample from "./variants/states";
import StatesSource from "./variants/states.tsx?raw";
import ChangingSourceExample from "./variants/changing-source";
import ChangingSourceSource from "./variants/changing-source.tsx?raw";
import PatchExample from "./variants/patch";
import PatchSource from "./variants/patch.tsx?raw";
const meta = {
  component: DiffView,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: { description: { component: componentDocumentation("diff-view") } },
  },
} satisfies Meta<typeof DiffView>;
export default meta;
type Story = StoryObj;

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("diff-view", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Layouts: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("diff-view", "layouts") },
      source: { code: LayoutsSource },
    },
  },
  render: LayoutsExample,
};

export const Highlighting: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("diff-view", "highlighting") },
      source: { code: HighlightingSource },
    },
  },
  render: HighlightingExample,
};

export const Context: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("diff-view", "context") },
      source: { code: ContextSource },
    },
  },
  render: ContextExample,
};

export const Annotations: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("diff-view", "annotations") },
      source: { code: AnnotationsSource },
    },
  },
  render: AnnotationsExample,
};

export const Composition: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("diff-view", "composition") },
      source: { code: CompositionSource },
    },
  },
  render: CompositionExample,
};

export const States: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("diff-view", "states") },
      source: { code: StatesSource },
    },
  },
  render: StatesExample,
};

export const ChangingSource: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("diff-view", "changing-source") },
      source: { code: ChangingSourceSource },
    },
  },
  render: ChangingSourceExample,
};

export const Patch: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("diff-view", "patch") },
      source: { code: PatchSource },
    },
  },
  render: PatchExample,
};
