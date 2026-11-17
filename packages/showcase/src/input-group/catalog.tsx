import type { Meta, StoryObj } from "../types";

import { InputGroup } from "@erbium/ui/components/input-group";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/input-group-demo.tsx?raw";

import IconExample from "./variants/icon";

import IconSource from "./examples/input-group-icon.tsx?raw";

import TextExample from "./variants/text";

import TextSource from "./examples/input-group-text.tsx?raw";

import DropdownExample from "./variants/dropdown";

import DropdownSource from "./examples/input-group-dropdown.tsx?raw";

import InlineStartExample from "./variants/inline-start";

import InlineStartSource from "./examples/input-group-inline-start.tsx?raw";

import InlineEndExample from "./variants/inline-end";

import InlineEndSource from "./examples/input-group-inline-end.tsx?raw";

import BlockStartExample from "./variants/block-start";

import BlockStartSource from "./examples/input-group-block-start.tsx?raw";

import BlockEndExample from "./variants/block-end";

import BlockEndSource from "./examples/input-group-block-end.tsx?raw";

import KbdExample from "./variants/kbd";

import KbdSource from "./examples/input-group-kbd.tsx?raw";

import TextareaExample from "./variants/textarea";

import TextareaSource from "./examples/input-group-textarea.tsx?raw";

import ButtonExample from "./variants/button";

import ButtonSource from "./examples/input-group-button.tsx?raw";

import CustomExample from "./variants/custom";

import CustomSource from "./examples/input-group-custom.tsx?raw";

const meta = {
  component: InputGroup,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("input-group"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof InputGroup>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  align: "inline-start" | "inline-end" | "block-start" | "block-end";
  placeholder: string;
  buttonSize: "xs" | "sm" | "icon-xs" | "icon-sm";
  buttonVariant: "default" | "secondary" | "outline" | "ghost" | "error" | "link";
  className: string;
}> = {
  argTypes: {
    align: {
      control: "select",
      options: ["inline-start", "inline-end", "block-start", "block-end"],
    },
    buttonSize: { control: "select", options: ["xs", "sm", "icon-xs", "icon-sm"] },
    buttonVariant: {
      control: "select",
      options: ["default", "secondary", "outline", "ghost", "error", "link"],
    },
    className: { control: "text" },
    placeholder: { control: "text" },
  },
  args: PlaygroundDefaults,
  parameters: {
    docs: {
      description: { story: variantDocumentation("input-group", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("input-group", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Icon: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("input-group", "icon") },
      source: { code: IconSource },
    },
  },
  render: IconExample,
};

export const Text: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("input-group", "text") },
      source: { code: TextSource },
    },
  },
  render: TextExample,
};

export const Dropdown: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("input-group", "dropdown") },
      source: { code: DropdownSource },
    },
  },
  render: DropdownExample,
};

export const InlineStart: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("input-group", "inline-start") },
      source: { code: InlineStartSource },
    },
  },
  render: InlineStartExample,
};

export const InlineEnd: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("input-group", "inline-end") },
      source: { code: InlineEndSource },
    },
  },
  render: InlineEndExample,
};

export const BlockStart: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("input-group", "block-start") },
      source: { code: BlockStartSource },
    },
    layout: "padded",
  },
  render: BlockStartExample,
};

export const BlockEnd: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("input-group", "block-end") },
      source: { code: BlockEndSource },
    },
    layout: "padded",
  },
  render: BlockEndExample,
};

export const Kbd: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("input-group", "kbd") },
      source: { code: KbdSource },
    },
  },
  render: KbdExample,
};

export const Textarea: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("input-group", "textarea") },
      source: { code: TextareaSource },
    },
  },
  render: TextareaExample,
};

export const Button: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("input-group", "button") },
      source: { code: ButtonSource },
    },
  },
  render: ButtonExample,
};

export const Custom: Story = {
  name: "Custom Input",
  parameters: {
    docs: {
      description: { story: variantDocumentation("input-group", "custom") },
      source: { code: CustomSource },
    },
  },
  render: CustomExample,
};
