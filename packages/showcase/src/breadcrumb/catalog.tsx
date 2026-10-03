import type { Meta, StoryObj } from "../types";

import { Breadcrumb } from "@erbium/ui/components/breadcrumb";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import EllipsisExample from "./variants/ellipsis";

import EllipsisSource from "./variants/ellipsis.tsx?raw";

import BasicExample from "./variants/basic";

import BasicSource from "./variants/basic.tsx?raw";

import DropdownExample from "./variants/dropdown";

import DropdownSource from "./variants/dropdown.tsx?raw";

import CustomSeparatorExample from "./variants/custom-separator";

import CustomSeparatorSource from "./variants/custom-separator.tsx?raw";

import LinkComponentExample from "./variants/link-component";

import LinkComponentSource from "./variants/link-component.tsx?raw";

const meta = {
  component: Breadcrumb,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("breadcrumb"),
      },
    },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{ separator: string; currentPage: string }> = {
  args: { separator: "/", currentPage: "Current page" },
  argTypes: { separator: { control: "text" }, currentPage: { control: "text" } },
  parameters: {
    docs: {
      description: { story: variantDocumentation("breadcrumb", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("breadcrumb", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Ellipsis: Story = {
  name: "Collapsed",
  parameters: {
    docs: {
      description: { story: variantDocumentation("breadcrumb", "ellipsis") },
      source: { code: EllipsisSource },
    },
  },
  render: EllipsisExample,
};

export const Basic: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("breadcrumb", "basic") },
      source: { code: BasicSource },
    },
  },
  render: BasicExample,
};

export const Dropdown: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("breadcrumb", "dropdown") },
      source: { code: DropdownSource },
    },
  },
  render: DropdownExample,
};

export const CustomSeparator: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("breadcrumb", "custom-separator") },
      source: { code: CustomSeparatorSource },
    },
  },
  render: CustomSeparatorExample,
};

export const LinkComponent: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("breadcrumb", "link-component") },
      source: { code: LinkComponentSource },
    },
  },
  render: LinkComponentExample,
};
