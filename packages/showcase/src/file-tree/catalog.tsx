import { FileTree } from "@erbium/ui/blocks/file-tree";
import type { Meta, StoryObj } from "../types";
import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";
import OverviewExample from "./variants/overview";
import OverviewSource from "./variants/overview.tsx?raw";
import CompositionExample from "./variants/composition";
import CompositionSource from "./variants/composition.tsx?raw";
import ChangesExample from "./variants/changes";
import ChangesSource from "./variants/changes.tsx?raw";
const meta = {
  component: FileTree,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: { description: { component: componentDocumentation("file-tree") } },
  },
} satisfies Meta<typeof FileTree>;
export default meta;
type Story = StoryObj;
export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("file-tree", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};
export const Composition: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("file-tree", "composition") },
      source: { code: CompositionSource },
    },
  },
  render: CompositionExample,
};
export const Changes: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("file-tree", "changes") },
      source: { code: ChangesSource },
    },
  },
  render: ChangesExample,
};
