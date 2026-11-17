import type { Meta, StoryObj } from "../types";

import { LogoLoader } from "@erbium/ui/components/logo-loader";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import RequestExample from "./variants/request";

import RequestSource from "./examples/logo-loader-request.tsx?raw";

import ReplayExample from "./variants/replay";

import ReplaySource from "./variants/replay.tsx?raw";

const meta = {
  component: LogoLoader,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("logo-loader"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof LogoLoader>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof LogoLoader> = {
  argTypes: {
    delay: { control: { max: 1000, min: 0, step: 50, type: "number" } },
    loading: { control: "boolean" },
  },
  args: PlaygroundDefaults,
  parameters: {
    docs: {
      description: { story: variantDocumentation("logo-loader", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Request: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("logo-loader", "request") },
      source: { code: RequestSource },
    },
  },
  render: RequestExample,
};

export const Replay: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("logo-loader", "replay") },
      source: { code: ReplaySource },
    },
  },
  render: ReplayExample,
};
