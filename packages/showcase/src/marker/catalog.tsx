import type { Meta, StoryObj } from "../types";

import { Marker } from "@erbium/ui/components/marker";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import VariantsExample from "./variants/variants";

import VariantsSource from "./variants/variants.tsx?raw";

import StatusExample from "./variants/status";

import StatusSource from "./variants/status.tsx?raw";

import ShimmerExample from "./variants/shimmer";

import ShimmerSource from "./variants/shimmer.tsx?raw";

import SeparatorExample from "./variants/separator";

import SeparatorSource from "./variants/separator.tsx?raw";

import BorderExample from "./variants/border";

import BorderSource from "./variants/border.tsx?raw";

import IconExample from "./variants/icon";

import IconSource from "./variants/icon.tsx?raw";

import LinkButtonExample from "./variants/link-button";

import LinkButtonSource from "./variants/link-button.tsx?raw";

const meta = {
  component: Marker,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("marker"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Marker>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  variant: "default" | "separator" | "border";
  asSpan: boolean;
  className: string;
}> = {
  argTypes: {
    asSpan: { control: "boolean" },
    className: { control: "text" },
    variant: {
      control: "select",
      options: ["default", "separator", "border"],
    },
  },
  args: { asSpan: false, className: "", variant: "default" },
  parameters: {
    docs: {
      description: { story: variantDocumentation("marker", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("marker", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("marker", "variants") },
      source: { code: VariantsSource },
    },
  },
  render: VariantsExample,
};

export const Status: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("marker", "status") },
      source: { code: StatusSource },
    },
  },
  render: StatusExample,
};

export const Shimmer: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("marker", "shimmer") },
      source: { code: ShimmerSource },
    },
  },
  render: ShimmerExample,
};

export const Separator: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("marker", "separator") },
      source: { code: SeparatorSource },
    },
  },
  render: SeparatorExample,
};

export const Border: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("marker", "border") },
      source: { code: BorderSource },
    },
  },
  render: BorderExample,
};

export const Icon: Story = {
  name: "With Icon",
  parameters: {
    docs: {
      description: { story: variantDocumentation("marker", "icon") },
      source: { code: IconSource },
    },
  },
  render: IconExample,
};

export const LinkButton: Story = {
  name: "Links and Buttons",
  parameters: {
    docs: {
      description: { story: variantDocumentation("marker", "link-button") },
      source: { code: LinkButtonSource },
    },
  },
  render: LinkButtonExample,
};
