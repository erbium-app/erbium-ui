import { AppShell } from "@erbium/ui/blocks/app-shell";
import type { Meta, StoryObj } from "../types";
import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";
import OverviewExample from "./variants/overview";
import OverviewSource from "./examples/app-shell-demo.tsx?raw";
import DocumentationExample from "./variants/documentation";
import DocumentationSource from "./variants/documentation.tsx?raw";

const meta = {
  component: AppShell,
  parameters: {
    docs: { description: { component: componentDocumentation("app-shell") } },
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AppShell>;

export default meta;

type Story = StoryObj;

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("app-shell", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Documentation: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("app-shell", "documentation") },
      source: { code: DocumentationSource },
    },
  },
  render: DocumentationExample,
};
