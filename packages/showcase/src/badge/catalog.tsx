import type { Meta, StoryObj } from "../types";

import { Badge } from "@erbium/ui/components/badge";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import VariantsExample from "./variants/variants";

import VariantsSource from "./variants/variants.tsx?raw";

import LinkExample from "./variants/link";

import LinkSource from "./variants/link.tsx?raw";

import WithIconExample from "./variants/with-icon";

import WithIconSource from "./variants/with-icon.tsx?raw";

import WithSpinnerExample from "./variants/with-spinner";

import WithSpinnerSource from "./variants/with-spinner.tsx?raw";

const meta = {
  component: Badge,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("badge"),
      },
    },
    layout: "centered",
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof Badge> = {
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "info",
        "success",
        "warning",
        "error",
        "ghost-error",
        "ghost-success",
        "ghost-warning",
        "ghost-info",
        "tag-gray",
        "tag-red",
        "tag-orange",
        "tag-yellow",
        "tag-green",
        "tag-cyan",
        "tag-blue",
        "tag-purple",
        "tag-magenta",
        "outline",
        "ghost",
        "link",
      ],
    },
  },
  args: { children: "Badge", className: "", variant: "default" },
  parameters: {
    docs: {
      description: { story: variantDocumentation("badge", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("badge", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("badge", "variants") },
      source: { code: VariantsSource },
    },
  },
  render: VariantsExample,
};

export const Link: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("badge", "link") },
      source: { code: LinkSource },
    },
  },
  render: LinkExample,
};

export const WithIcon: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("badge", "with-icon") },
      source: { code: WithIconSource },
    },
  },
  render: WithIconExample,
};

export const WithSpinner: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("badge", "with-spinner") },
      source: { code: WithSpinnerSource },
    },
  },
  render: WithSpinnerExample,
};
