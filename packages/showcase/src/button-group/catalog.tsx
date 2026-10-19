import type { Meta, StoryObj } from "../types";

import { ButtonGroup } from "@erbium/ui/components/button-group";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import OrientationExample from "./variants/orientation";

import OrientationSource from "./variants/orientation.tsx?raw";

import SizeExample from "./variants/size";

import SizeSource from "./variants/size.tsx?raw";

import NestedExample from "./variants/nested";

import NestedSource from "./variants/nested.tsx?raw";

import SeparatorExample from "./variants/separator";

import SeparatorSource from "./variants/separator.tsx?raw";

import InputExample from "./variants/input";

import InputSource from "./variants/input.tsx?raw";

import InputGroupExample from "./variants/input-group";

import InputGroupSource from "./variants/input-group.tsx?raw";

import DropdownMenuExample from "./variants/dropdown-menu";

import DropdownMenuSource from "./variants/dropdown-menu.tsx?raw";

import SelectExample from "./variants/select";

import SelectSource from "./variants/select.tsx?raw";

import PopoverExample from "./variants/popover";

import PopoverSource from "./variants/popover.tsx?raw";

import SplitExample from "./variants/split";

import SplitSource from "./variants/split.tsx?raw";

const meta = {
  component: ButtonGroup,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("button-group"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ButtonGroup>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  orientation: "horizontal" | "vertical";
  size: "default" | "xs" | "sm" | "lg";
}> = {
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    size: { control: "select", options: ["default", "xs", "sm", "lg"] },
  },
  args: { orientation: "horizontal", size: "default" },
  parameters: {
    docs: {
      description: { story: variantDocumentation("button-group", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("button-group", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Orientation: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("button-group", "orientation") },
      source: { code: OrientationSource },
    },
  },
  render: OrientationExample,
};

export const Size: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("button-group", "size") },
      source: { code: SizeSource },
    },
  },
  render: SizeExample,
};

export const Nested: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("button-group", "nested") },
      source: { code: NestedSource },
    },
  },
  render: NestedExample,
};

export const Separator: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("button-group", "separator") },
      source: { code: SeparatorSource },
    },
  },
  render: SeparatorExample,
};

export const Input: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("button-group", "input") },
      source: { code: InputSource },
    },
  },
  render: InputExample,
};

export const InputGroup: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("button-group", "input-group") },
      source: { code: InputGroupSource },
    },
  },
  render: InputGroupExample,
};

export const DropdownMenu: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("button-group", "dropdown-menu") },
      source: { code: DropdownMenuSource },
    },
  },
  render: DropdownMenuExample,
};

export const Select: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("button-group", "select") },
      source: { code: SelectSource },
    },
  },
  render: SelectExample,
};

export const Popover: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("button-group", "popover") },
      source: { code: PopoverSource },
    },
  },
  render: PopoverExample,
};

export const Split: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("button-group", "split") },
      source: { code: SplitSource },
    },
  },
  render: SplitExample,
};
