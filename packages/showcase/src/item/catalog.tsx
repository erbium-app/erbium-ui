import type { Meta, StoryObj } from "../types";

import { Item } from "@erbium/ui/components/item";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/item-demo.tsx?raw";

import VariantExample from "./variants/variant";

import VariantSource from "./examples/item-variant.tsx?raw";

import SizeExample from "./variants/size";

import SizeSource from "./examples/item-size.tsx?raw";

import IconExample from "./variants/icon";

import IconSource from "./examples/item-icon.tsx?raw";

import AvatarExample from "./variants/avatar";

import AvatarSource from "./examples/item-avatar.tsx?raw";

import GroupExample from "./variants/group";

import GroupSource from "./examples/item-group.tsx?raw";

import SettingsPanelExample from "./variants/settings-panel";

import SettingsPanelSource from "./variants/settings-panel.tsx?raw";

import BookLibraryExample from "./variants/book-library";

import BookLibrarySource from "./examples/item-book-library.tsx?raw";

import JoinedSelectionExample from "./variants/joined-selection";

import JoinedSelectionSource from "./examples/item-joined-selection.tsx?raw";

import LinkExample from "./variants/link";

import LinkSource from "./examples/item-link.tsx?raw";

import DropdownExample from "./variants/dropdown";

import DropdownSource from "./examples/item-dropdown.tsx?raw";

import HeaderExample from "./variants/header";

import HeaderSource from "./examples/item-header.tsx?raw";

import ImageExample from "./variants/image";

import ImageSource from "./examples/item-image.tsx?raw";

const meta = {
  component: Item,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("item"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Item>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  variant: "default" | "card";
  size: "default" | "sm" | "xs";
  mediaVariant: "default" | "icon" | "image";
  asLink: boolean;
  className: string;
}> = {
  argTypes: {
    asLink: { control: "boolean" },
    className: { control: "text" },
    mediaVariant: { control: "select", options: ["default", "icon", "image"] },
    size: { control: "select", options: ["default", "sm", "xs"] },
    variant: { control: "select", options: ["default", "card"] },
  },
  args: PlaygroundDefaults,
  parameters: {
    docs: {
      description: { story: variantDocumentation("item", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("item", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Variant: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("item", "variant") },
      source: { code: VariantSource },
    },
  },
  render: VariantExample,
};

export const Size: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("item", "size") },
      source: { code: SizeSource },
    },
  },
  render: SizeExample,
};

export const Icon: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("item", "icon") },
      source: { code: IconSource },
    },
  },
  render: IconExample,
};

export const Avatar: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("item", "avatar") },
      source: { code: AvatarSource },
    },
  },
  render: AvatarExample,
};

export const Group: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("item", "group") },
      source: { code: GroupSource },
    },
  },
  render: GroupExample,
};

export const SettingsPanel: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("item", "settings-panel") },
      source: { code: SettingsPanelSource },
    },
    layout: "fullscreen",
  },
  render: SettingsPanelExample,
};

export const BookLibrary: Story = {
  name: "Book Library",
  parameters: {
    docs: {
      description: { story: variantDocumentation("item", "book-library") },
      source: { code: BookLibrarySource },
    },
  },
  render: BookLibraryExample,
};

export const JoinedSelection: Story = {
  name: "Joined Selection",
  parameters: {
    docs: {
      description: { story: variantDocumentation("item", "joined-selection") },
      source: { code: JoinedSelectionSource },
    },
  },
  render: JoinedSelectionExample,
};

export const Link: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("item", "link") },
      source: { code: LinkSource },
    },
  },
  render: LinkExample,
};

export const Dropdown: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("item", "dropdown") },
      source: { code: DropdownSource },
    },
  },
  render: DropdownExample,
};

export const Header: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("item", "header") },
      source: { code: HeaderSource },
    },
  },
  render: HeaderExample,
};

export const Image: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("item", "image") },
      source: { code: ImageSource },
    },
  },
  render: ImageExample,
};
