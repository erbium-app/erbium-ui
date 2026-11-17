import type { Meta, StoryObj } from "../types";
import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";
import { latencyArgType } from "../loading";
import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";
import PlaygroundSource from "./variants/playground.tsx?raw";
import OverviewExample from "./variants/overview";
import OverviewSource from "./variants/overview.tsx?raw";
import ClientExample from "./variants/client";
import ClientSource from "./variants/client.tsx?raw";
import RouterExample from "./variants/router";
import RouterSource from "./variants/router.tsx?raw";
import EmptyStateExample from "./variants/empty";
import EmptyStateSource from "./variants/empty.tsx?raw";
import ErrorStateExample from "./variants/error";
import ErrorStateSource from "./variants/error.tsx?raw";
import RtlExample from "./variants/rtl";
import RtlSource from "./variants/rtl.tsx?raw";

const meta = {
  parameters: {
    docs: { description: { component: componentDocumentation("data-table") } },
    layout: "centered",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: StoryObj<typeof PlaygroundExample> = {
  argTypes: {
    ...latencyArgType,
    empty: { control: "boolean" },
    fail: { control: "boolean" },
    pageSize: { control: { max: 12, min: 3, type: "number" } },
  },
  args: PlaygroundDefaults,
  parameters: {
    docs: {
      description: { story: variantDocumentation("data-table", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("data-table", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Client: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("data-table", "client") },
      source: { code: ClientSource },
    },
  },
  render: ClientExample,
};

export const Router: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("data-table", "router") },
      source: { code: RouterSource },
    },
  },
  render: RouterExample,
};

export const EmptyState: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("data-table", "empty") },
      source: { code: EmptyStateSource },
    },
  },
  render: EmptyStateExample,
};

export const ErrorState: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("data-table", "error") },
      source: { code: ErrorStateSource },
    },
  },
  render: ErrorStateExample,
};

export const Rtl: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("data-table", "rtl") },
      source: { code: RtlSource },
    },
  },
  render: RtlExample,
};
