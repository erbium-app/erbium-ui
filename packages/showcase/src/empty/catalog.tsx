import type { Meta, StoryObj } from "../types";

import { Empty } from "@erbium/ui/components/empty";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import AvatarExample from "./variants/avatar";

import AvatarSource from "./variants/avatar.tsx?raw";

import AvatarGroupExample from "./variants/avatar-group";

import AvatarGroupSource from "./variants/avatar-group.tsx?raw";

import InputgroupExample from "./variants/inputgroup";

import InputgroupSource from "./variants/inputgroup.tsx?raw";

import InputGroupExample from "./variants/input-group";

import InputGroupSource from "./variants/input-group.tsx?raw";

import OutlineExample from "./variants/outline";

import OutlineSource from "./variants/outline.tsx?raw";

import BackgroundExample from "./variants/background";

import BackgroundSource from "./variants/background.tsx?raw";

const meta = {
  component: Empty,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("empty"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Empty>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  className: string;
  mediaVariant: "default" | "icon";
  title: string;
  description: string;
}> = {
  argTypes: {
    className: { control: "text" },
    description: { control: "text" },
    mediaVariant: { control: "select", options: ["default", "icon"] },
    title: { control: "text" },
  },
  args: {
    className: "",
    description: "Try another search.",
    mediaVariant: "icon",
    title: "No results",
  },
  parameters: {
    docs: {
      description: { story: variantDocumentation("empty", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("empty", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Avatar: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("empty", "avatar") },
      source: { code: AvatarSource },
    },
  },
  render: AvatarExample,
};

export const AvatarGroup: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("empty", "avatar-group") },
      source: { code: AvatarGroupSource },
    },
  },
  render: AvatarGroupExample,
};

export const Inputgroup: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("empty", "inputgroup") },
      source: { code: InputgroupSource },
    },
  },
  render: InputgroupExample,
};

export const InputGroup: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("empty", "input-group") },
      source: { code: InputGroupSource },
    },
  },
  render: InputGroupExample,
};

export const Outline: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("empty", "outline") },
      source: { code: OutlineSource },
    },
  },
  render: OutlineExample,
};

export const Background: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("empty", "background") },
      source: { code: BackgroundSource },
    },
  },
  render: BackgroundExample,
};
