import type { Meta, StoryObj } from "../types";
import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";
import { latencyArgType } from "../loading";
import PlaygroundExample from "./variants/playground";
import PlaygroundSource from "./variants/playground.tsx?raw";
import OverviewExample from "./variants/overview";
import OverviewSource from "./variants/overview.tsx?raw";
import PartialFailureExample from "./variants/partial-failure";
import PartialFailureSource from "./variants/partial-failure.tsx?raw";

const meta = {
  parameters: {
    docs: { description: { component: componentDocumentation("account-settings") } },
    layout: "centered",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: StoryObj<typeof PlaygroundExample> = {
  argTypes: { ...latencyArgType, failSessions: { control: "boolean" } },
  args: { failSessions: false, latency: 1200 },
  parameters: {
    docs: {
      description: { story: variantDocumentation("account-settings", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("account-settings", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const PartialFailure: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("account-settings", "partial-failure") },
      source: { code: PartialFailureSource },
    },
  },
  render: PartialFailureExample,
};
