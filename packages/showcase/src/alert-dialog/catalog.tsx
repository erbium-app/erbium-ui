import { AlertDialog } from "@erbium/ui/components/alert-dialog";

import type { Meta, StoryObj } from "../types";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import BasicExample from "./variants/basic";

import BasicSource from "./variants/basic.tsx?raw";

import SmallExample from "./variants/small";

import SmallSource from "./variants/small.tsx?raw";

import MediaExample from "./variants/media";

import MediaSource from "./variants/media.tsx?raw";

import SmallMediaExample from "./variants/small-media";

import SmallMediaSource from "./variants/small-media.tsx?raw";

import ErrorVariantExample from "./variants/error-variant";

import ErrorVariantSource from "./variants/error-variant.tsx?raw";

const meta = {
  component: AlertDialog,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("alert-dialog"),
      },
    },
  },
} satisfies Meta<typeof AlertDialog>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{ size: "default" | "sm"; defaultOpen: boolean }> = {
  args: { size: "default", defaultOpen: false },
  argTypes: {
    size: { control: "select", options: ["default", "sm"] },
    defaultOpen: { control: "boolean" },
  },
  parameters: {
    docs: {
      description: { story: variantDocumentation("alert-dialog", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("alert-dialog", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Basic: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("alert-dialog", "basic") },
      source: { code: BasicSource },
    },
  },
  render: BasicExample,
};

export const Small: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("alert-dialog", "small") },
      source: { code: SmallSource },
    },
  },
  render: SmallExample,
};

export const Media: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("alert-dialog", "media") },
      source: { code: MediaSource },
    },
  },
  render: MediaExample,
};

export const SmallMedia: Story = {
  name: "Small with Media",
  parameters: {
    docs: {
      description: { story: variantDocumentation("alert-dialog", "small-media") },
      source: { code: SmallMediaSource },
    },
  },
  render: SmallMediaExample,
};

export const ErrorVariant: Story = {
  name: "Error",
  parameters: {
    docs: {
      description: { story: variantDocumentation("alert-dialog", "error-variant") },
      source: { code: ErrorVariantSource },
    },
  },
  render: ErrorVariantExample,
};
