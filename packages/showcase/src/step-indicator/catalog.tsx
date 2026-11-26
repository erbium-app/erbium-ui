import type { Meta, StoryObj } from "../types";
import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";
import OverviewExample from "./variants/overview";
import OverviewSource from "./variants/overview.tsx?raw";
import ReadOnlyExample from "./variants/read-only";
import ReadOnlySource from "./variants/read-only.tsx?raw";
import StatusExample from "./variants/status";
import StatusSource from "./variants/status.tsx?raw";
import ProgressExample from "./variants/progress";
import ProgressSource from "./variants/progress.tsx?raw";
import AutoplayExample from "./variants/autoplay";
import AutoplaySource from "./variants/autoplay.tsx?raw";
import VerticalExample from "./variants/vertical";
import VerticalSource from "./variants/vertical.tsx?raw";
import TabsExample from "./variants/tabs";
import TabsSource from "./variants/tabs.tsx?raw";

const COMPONENT = "step-indicator";

const meta = {
  parameters: {
    docs: { description: { component: componentDocumentation(COMPONENT) } },
    layout: "centered",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation(COMPONENT, "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const ReadOnly: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation(COMPONENT, "read-only") },
      source: { code: ReadOnlySource },
    },
  },
  render: ReadOnlyExample,
};

export const Status: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation(COMPONENT, "status") },
      source: { code: StatusSource },
    },
  },
  render: StatusExample,
};

export const Progress: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation(COMPONENT, "progress") },
      source: { code: ProgressSource },
    },
  },
  render: ProgressExample,
};

export const Autoplay: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation(COMPONENT, "autoplay") },
      source: { code: AutoplaySource },
    },
  },
  render: AutoplayExample,
};

export const Vertical: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation(COMPONENT, "vertical") },
      source: { code: VerticalSource },
    },
  },
  render: VerticalExample,
};

export const Tabs: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation(COMPONENT, "tabs") },
      source: { code: TabsSource },
    },
  },
  render: TabsExample,
};
