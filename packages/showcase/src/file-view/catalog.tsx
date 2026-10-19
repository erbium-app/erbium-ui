import { FileView } from "@erbium/ui/blocks/file-view";
import type { Meta, StoryObj } from "../types";
import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";
import OverviewExample from "./variants/overview";
import OverviewSource from "./variants/overview.tsx?raw";
import CompositionExample from "./variants/composition";
import CompositionSource from "./variants/composition.tsx?raw";
import AnnotationsExample from "./variants/annotations";
import AnnotationsSource from "./variants/annotations.tsx?raw";
import StatesExample from "./variants/states";
import StatesSource from "./variants/states.tsx?raw";

const meta = {
  component: FileView,
  parameters: {
    docs: { description: { component: componentDocumentation("file-view") } },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FileView>;

export default meta;

type Story = StoryObj;

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("file-view", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Composition: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("file-view", "composition") },
      source: { code: CompositionSource },
    },
  },
  render: CompositionExample,
};

export const Annotations: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("file-view", "annotations") },
      source: { code: AnnotationsSource },
    },
  },
  render: AnnotationsExample,
};

export const States: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("file-view", "states") },
      source: { code: StatesSource },
    },
  },
  render: StatesExample,
};
