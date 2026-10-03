import type { Meta, StoryObj } from "../types";

import { Avatar } from "@erbium/ui/components/avatar";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import FallbackExample from "./variants/fallback";

import FallbackSource from "./variants/fallback.tsx?raw";

import ImageExample from "./variants/image";

import ImageSource from "./variants/image.tsx?raw";

import BasicExample from "./variants/basic";

import BasicSource from "./variants/basic.tsx?raw";

import BadgeExample from "./variants/badge";

import BadgeSource from "./variants/badge.tsx?raw";

import DropdownExample from "./variants/dropdown";

import DropdownSource from "./variants/dropdown.tsx?raw";

import BadgeWithIconExample from "./variants/badge-with-icon";

import BadgeWithIconSource from "./variants/badge-with-icon.tsx?raw";

import AvatarGroupExample from "./variants/avatar-group";

import AvatarGroupSource from "./variants/avatar-group.tsx?raw";

import AvatarGroupCountExample from "./variants/avatar-group-count";

import AvatarGroupCountSource from "./variants/avatar-group-count.tsx?raw";

import AvatarGroupWithIconExample from "./variants/avatar-group-with-icon";

import AvatarGroupWithIconSource from "./variants/avatar-group-with-icon.tsx?raw";

import SizesExample from "./variants/sizes";

import SizesSource from "./variants/sizes.tsx?raw";

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("avatar"),
      },
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  size: "default" | "sm" | "lg";
  src: string;
  alt: string;
  fallback: string;
  className: string;
}> = {
  args: { size: "default", src: "", alt: "Profile photo", fallback: "AN", className: "" },
  argTypes: {
    size: { control: "select", options: ["default", "sm", "lg"] },
    src: { control: "text" },
    alt: { control: "text" },
    fallback: { control: "text" },
    className: { control: "text" },
  },
  parameters: {
    docs: {
      description: { story: variantDocumentation("avatar", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("avatar", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Fallback: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("avatar", "fallback") },
      source: { code: FallbackSource },
    },
  },
  render: FallbackExample,
};

export const Image: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("avatar", "image") },
      source: { code: ImageSource },
    },
  },
  render: ImageExample,
};

export const Basic: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("avatar", "basic") },
      source: { code: BasicSource },
    },
  },
  render: BasicExample,
};

export const Badge: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("avatar", "badge") },
      source: { code: BadgeSource },
    },
  },
  render: BadgeExample,
};

export const Dropdown: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("avatar", "dropdown") },
      source: { code: DropdownSource },
    },
  },
  render: DropdownExample,
};

export const BadgeWithIcon: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("avatar", "badge-with-icon") },
      source: { code: BadgeWithIconSource },
    },
  },
  render: BadgeWithIconExample,
};

export const AvatarGroup: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("avatar", "avatar-group") },
      source: { code: AvatarGroupSource },
    },
  },
  render: AvatarGroupExample,
};

export const AvatarGroupCount: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("avatar", "avatar-group-count") },
      source: { code: AvatarGroupCountSource },
    },
  },
  render: AvatarGroupCountExample,
};

export const AvatarGroupWithIcon: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("avatar", "avatar-group-with-icon") },
      source: { code: AvatarGroupWithIconSource },
    },
  },
  render: AvatarGroupWithIconExample,
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("avatar", "sizes") },
      source: { code: SizesSource },
    },
  },
  render: SizesExample,
};
