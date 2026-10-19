import type { Meta, StoryObj } from "../types";

import { Bubble } from "@erbium/ui/components/bubble";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import AlignmentExample from "./variants/alignment";

import AlignmentSource from "./variants/alignment.tsx?raw";

import GroupDemoExample from "./variants/group-demo";

import GroupDemoSource from "./variants/group-demo.tsx?raw";

import CollapsibleExample from "./variants/collapsible";

import CollapsibleSource from "./variants/collapsible.tsx?raw";

import TooltipExample from "./variants/tooltip";

import TooltipSource from "./variants/tooltip.tsx?raw";

import PopoverExample from "./variants/popover";

import PopoverSource from "./variants/popover.tsx?raw";

import LinkButtonExample from "./variants/link-button";

import LinkButtonSource from "./variants/link-button.tsx?raw";

import ReactionsExample from "./variants/reactions";

import ReactionsSource from "./variants/reactions.tsx?raw";

import VariantsExample from "./variants/variants";

import VariantsSource from "./variants/variants.tsx?raw";

const meta = {
  component: Bubble,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("bubble"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Bubble>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  variant: "default" | "secondary" | "muted" | "tinted" | "outline" | "ghost" | "error";
  align: "start" | "end";
  reactionSide: "top" | "bottom";
  reactionAlign: "start" | "end";
  contentAs: "text" | "button" | "link";
  className: string;
}> = {
  argTypes: {
    align: { control: "select", options: ["start", "end"] },
    className: { control: "text" },
    contentAs: { control: "select", options: ["text", "button", "link"] },
    reactionAlign: { control: "select", options: ["start", "end"] },
    reactionSide: { control: "select", options: ["top", "bottom"] },
    variant: {
      control: "select",
      options: ["default", "secondary", "muted", "tinted", "outline", "ghost", "error"],
    },
  },
  args: {
    align: "start",
    className: "",
    contentAs: "text",
    reactionAlign: "end",
    reactionSide: "bottom",
    variant: "default",
  },
  parameters: {
    docs: {
      description: { story: variantDocumentation("bubble", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("bubble", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Alignment: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("bubble", "alignment") },
      source: { code: AlignmentSource },
    },
  },
  render: AlignmentExample,
};

export const GroupDemo: Story = {
  name: "Bubble Group",
  parameters: {
    docs: {
      description: { story: variantDocumentation("bubble", "group-demo") },
      source: { code: GroupDemoSource },
    },
  },
  render: GroupDemoExample,
};

export const Collapsible: Story = {
  name: "Show More / Collapsible",
  parameters: {
    docs: {
      description: { story: variantDocumentation("bubble", "collapsible") },
      source: { code: CollapsibleSource },
    },
  },
  render: CollapsibleExample,
};

export const Tooltip: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("bubble", "tooltip") },
      source: { code: TooltipSource },
    },
  },
  render: TooltipExample,
};

export const Popover: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("bubble", "popover") },
      source: { code: PopoverSource },
    },
  },
  render: PopoverExample,
};

export const LinkButton: Story = {
  name: "Links and Buttons",
  parameters: {
    docs: {
      description: { story: variantDocumentation("bubble", "link-button") },
      source: { code: LinkButtonSource },
    },
  },
  render: LinkButtonExample,
};

export const Reactions: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("bubble", "reactions") },
      source: { code: ReactionsSource },
    },
  },
  render: ReactionsExample,
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("bubble", "variants") },
      source: { code: VariantsSource },
    },
  },
  render: VariantsExample,
};
