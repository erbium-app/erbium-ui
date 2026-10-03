import { Toolbar } from "@erbium/ui/components/toolbar";

import type { Meta, StoryObj } from "../types";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import FormattingExample from "./variants/formatting";

import FormattingSource from "./variants/formatting.tsx?raw";

import VerticalExample from "./variants/vertical";

import VerticalSource from "./variants/vertical.tsx?raw";

import SearchAndLinkExample from "./variants/search-and-link";

import SearchAndLinkSource from "./variants/search-and-link.tsx?raw";

import DisabledExample from "./variants/disabled";

import DisabledSource from "./variants/disabled.tsx?raw";

import ShowcaseExample from "./variants/showcase";

import ShowcaseSource from "./variants/showcase.tsx?raw";

const meta = {
  component: Toolbar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("toolbar"),
      },
    },
  },
} satisfies Meta<typeof Toolbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Formatting: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("toolbar", "formatting") },
      source: { code: FormattingSource },
    },
  },
  render: FormattingExample,
};

export const Vertical: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("toolbar", "vertical") },
      source: { code: VerticalSource },
    },
  },
  render: VerticalExample,
};

export const SearchAndLink: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("toolbar", "search-and-link") },
      source: { code: SearchAndLinkSource },
    },
  },
  render: SearchAndLinkExample,
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("toolbar", "disabled") },
      source: { code: DisabledSource },
    },
  },
  render: DisabledExample,
};

export const Showcase: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("toolbar", "showcase") },
      source: { code: ShowcaseSource },
    },
  },
  render: ShowcaseExample,
};
