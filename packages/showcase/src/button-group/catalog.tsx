import type { Meta, StoryObj } from "../types";

import { ButtonGroup } from "@erbium/ui/components/button-group";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/button-group-demo.tsx?raw";

import OrientationExample from "./variants/orientation";

import OrientationSource from "./examples/button-group-orientation.tsx?raw";

import SizeExample from "./variants/size";

import SizeSource from "./examples/button-group-size.tsx?raw";

import NestedExample from "./variants/nested";

import NestedSource from "./examples/button-group-nested.tsx?raw";

import SeparatorExample from "./variants/separator";

import SeparatorSource from "./examples/button-group-separator.tsx?raw";

import InputExample from "./variants/input";

import InputSource from "./examples/button-group-input.tsx?raw";

import InputGroupExample from "./variants/input-group";

import InputGroupSource from "./examples/button-group-input-group.tsx?raw";

import DropdownMenuExample from "./variants/dropdown-menu";

import DropdownMenuSource from "./examples/button-group-dropdown.tsx?raw";

import SelectExample from "./variants/select";

import SelectSource from "./examples/button-group-select.tsx?raw";

import PopoverExample from "./variants/popover";

import PopoverSource from "./examples/button-group-popover.tsx?raw";

import SplitExample from "./variants/split";

import SplitSource from "./examples/button-group-split.tsx?raw";

import TextExample from "./variants/text";

import TextSource from "./examples/button-group-text.tsx?raw";

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
  args: PlaygroundDefaults,
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

export const Text: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("button-group", "text") },
      source: { code: TextSource },
    },
  },
  render: TextExample,
};
