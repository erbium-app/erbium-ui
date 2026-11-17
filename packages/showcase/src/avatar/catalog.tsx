import type { Meta, StoryObj } from "../types";

import { Avatar } from "@erbium/ui/components/avatar";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/avatar-demo.tsx?raw";

import FallbackExample from "./variants/fallback";

import FallbackSource from "./variants/fallback.tsx?raw";

import ImageExample from "./variants/image";

import ImageSource from "./variants/image.tsx?raw";

import BasicExample from "./variants/basic";

import BasicSource from "./examples/avatar-basic.tsx?raw";

import BadgeExample from "./variants/badge";

import BadgeSource from "./examples/avatar-badge.tsx?raw";

import DropdownExample from "./variants/dropdown";

import DropdownSource from "./examples/avatar-dropdown.tsx?raw";

import BadgeWithIconExample from "./variants/badge-with-icon";

import BadgeWithIconSource from "./examples/avatar-badge-icon.tsx?raw";

import AvatarGroupExample from "./variants/avatar-group";

import AvatarGroupSource from "./examples/avatar-group.tsx?raw";

import AvatarGroupCountExample from "./variants/avatar-group-count";

import AvatarGroupCountSource from "./examples/avatar-group-count.tsx?raw";

import AvatarGroupWithIconExample from "./variants/avatar-group-with-icon";

import AvatarGroupWithIconSource from "./examples/avatar-group-count-icon.tsx?raw";

import SizesExample from "./variants/sizes";

import SizesSource from "./examples/avatar-size.tsx?raw";

const meta = {
  component: Avatar,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("avatar"),
      },
    },
    layout: "centered",
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
  argTypes: {
    alt: { control: "text" },
    className: { control: "text" },
    fallback: { control: "text" },
    size: { control: "select", options: ["default", "sm", "lg"] },
    src: { control: "text" },
  },
  args: PlaygroundDefaults,
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
