import type { Meta, StoryObj } from "../types";

import { InputGroup } from "@erbium/ui/components/input-group";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import IconExample from "./variants/icon";

import IconSource from "./variants/icon.tsx?raw";

import TextExample from "./variants/text";

import TextSource from "./variants/text.tsx?raw";

import DropdownExample from "./variants/dropdown";

import DropdownSource from "./variants/dropdown.tsx?raw";

import SpinnerExample from "./variants/spinner";

import SpinnerSource from "./variants/spinner.tsx?raw";

import InlineStartExample from "./variants/inline-start";

import InlineStartSource from "./variants/inline-start.tsx?raw";

import InlineEndExample from "./variants/inline-end";

import InlineEndSource from "./variants/inline-end.tsx?raw";

import BlockStartExample from "./variants/block-start";

import BlockStartSource from "./variants/block-start.tsx?raw";

import BlockEndExample from "./variants/block-end";

import BlockEndSource from "./variants/block-end.tsx?raw";

import KbdExample from "./variants/kbd";

import KbdSource from "./variants/kbd.tsx?raw";

import TextareaExample from "./variants/textarea";

import TextareaSource from "./variants/textarea.tsx?raw";

import ButtonExample from "./variants/button";

import ButtonSource from "./variants/button.tsx?raw";

import CustomExample from "./variants/custom";

import CustomSource from "./variants/custom.tsx?raw";

const meta = {
  title: "UI/Input Group",
  component: InputGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("input-group"),
      },
    },
  },
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
  args: {
    align: "inline-start",
    placeholder: "Search",
    buttonSize: "xs",
    buttonVariant: "ghost",
    className: "",
  },
  argTypes: {
    align: {
      control: "select",
      options: ["inline-start", "inline-end", "block-start", "block-end"],
    },
    placeholder: { control: "text" },
    buttonSize: { control: "select", options: ["xs", "sm", "icon-xs", "icon-sm"] },
    buttonVariant: {
      control: "select",
      options: ["default", "secondary", "outline", "ghost", "error", "link"],
    },
    className: { control: "text" },
  },
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

export const Spinner: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("input-group", "spinner") },
      source: { code: SpinnerSource },
    },
  },
  render: SpinnerExample,
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
    layout: "padded",
    docs: {
      description: { story: variantDocumentation("input-group", "block-start") },
      source: { code: BlockStartSource },
    },
  },
  render: BlockStartExample,
};

export const BlockEnd: Story = {
  parameters: {
    layout: "padded",
    docs: {
      description: { story: variantDocumentation("input-group", "block-end") },
      source: { code: BlockEndSource },
    },
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
