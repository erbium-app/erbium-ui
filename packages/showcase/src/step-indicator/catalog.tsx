import type { Meta, StoryObj } from "../types";
import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";
import OverviewExample from "./variants/overview";
import OverviewSource from "./variants/overview.tsx?raw";
import ReadOnlyExample from "./variants/read-only";
import ReadOnlySource from "./variants/read-only.tsx?raw";
import BlockedExample from "./variants/blocked";
import BlockedSource from "./variants/blocked.tsx?raw";
import StatusExample from "./variants/status";
import StatusSource from "./variants/status.tsx?raw";
import ProgressExample from "./variants/progress";
import ProgressSource from "./variants/progress.tsx?raw";
import VerticalExample from "./variants/vertical";
import VerticalSource from "./variants/vertical.tsx?raw";
import TabsExample from "./variants/tabs";
import TabsSource from "./variants/tabs.tsx?raw";
import TanstackFormExample from "./variants/tanstack-form";
import TanstackFormSource from "./variants/tanstack-form.tsx?raw";

const meta = {
  parameters: {
    docs: { description: { component: componentDocumentation("step-indicator") } },
    layout: "centered",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("step-indicator", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const ReadOnly: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("step-indicator", "read-only") },
      source: { code: ReadOnlySource },
    },
  },
  render: ReadOnlyExample,
};

export const Blocked: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("step-indicator", "blocked") },
      source: { code: BlockedSource },
    },
  },
  render: BlockedExample,
};

export const Status: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("step-indicator", "status") },
      source: { code: StatusSource },
    },
  },
  render: StatusExample,
};

export const Progress: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("step-indicator", "progress") },
      source: { code: ProgressSource },
    },
  },
  render: ProgressExample,
};

export const Vertical: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("step-indicator", "vertical") },
      source: { code: VerticalSource },
    },
  },
  render: VerticalExample,
};

export const Tabs: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("step-indicator", "tabs") },
      source: { code: TabsSource },
    },
  },
  render: TabsExample,
};

export const TanstackForm: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("step-indicator", "tanstack-form") },
      source: { code: TanstackFormSource },
    },
  },
  render: TanstackFormExample,
};
