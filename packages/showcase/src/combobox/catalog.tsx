import type { Meta, StoryObj } from "../types";

import { Combobox } from "@erbium/ui/components/combobox";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import BasicExample from "./variants/basic";

import BasicSource from "./variants/basic.tsx?raw";

import MultipleExample from "./variants/multiple";

import MultipleSource from "./variants/multiple.tsx?raw";

import GroupsExample from "./variants/groups";

import GroupsSource from "./variants/groups.tsx?raw";

import InvalidExample from "./variants/invalid";

import InvalidSource from "./variants/invalid.tsx?raw";

import DisabledExample from "./variants/disabled";

import DisabledSource from "./variants/disabled.tsx?raw";

import AutoHighlightExample from "./variants/auto-highlight";

import AutoHighlightSource from "./variants/auto-highlight.tsx?raw";

import PopupExample from "./variants/popup";

import PopupSource from "./variants/popup.tsx?raw";

import InputGroupExample from "./variants/input-group";

import InputGroupSource from "./variants/input-group.tsx?raw";

import CustomItemsExample from "./variants/custom-items";

import CustomItemsSource from "./variants/custom-items.tsx?raw";

import ClearButtonExample from "./variants/clear-button";

import ClearButtonSource from "./variants/clear-button.tsx?raw";

const meta = {
  component: Combobox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("combobox"),
      },
    },
  },
} satisfies Meta<typeof Combobox>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  placeholder: string;
  disabled: boolean;
  showTrigger: boolean;
  showClear: boolean;
  autoHighlight: boolean;
}> = {
  args: {
    placeholder: "Select a framework",
    disabled: false,
    showTrigger: true,
    showClear: false,
    autoHighlight: false,
  },
  argTypes: {
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    showTrigger: { control: "boolean" },
    showClear: { control: "boolean" },
    autoHighlight: { control: "boolean" },
  },
  parameters: {
    docs: {
      description: { story: variantDocumentation("combobox", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("combobox", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Basic: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("combobox", "basic") },
      source: { code: BasicSource },
    },
  },
  render: BasicExample,
};

export const Multiple: Story = {
  name: "Multiple Selection",
  parameters: {
    docs: {
      description: { story: variantDocumentation("combobox", "multiple") },
      source: { code: MultipleSource },
    },
  },
  render: MultipleExample,
};

export const Groups: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("combobox", "groups") },
      source: { code: GroupsSource },
    },
  },
  render: GroupsExample,
};

export const Invalid: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("combobox", "invalid") },
      source: { code: InvalidSource },
    },
  },
  render: InvalidExample,
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("combobox", "disabled") },
      source: { code: DisabledSource },
    },
  },
  render: DisabledExample,
};

export const AutoHighlight: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("combobox", "auto-highlight") },
      source: { code: AutoHighlightSource },
    },
  },
  render: AutoHighlightExample,
};

export const Popup: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("combobox", "popup") },
      source: { code: PopupSource },
    },
  },
  render: PopupExample,
};

export const InputGroup: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("combobox", "input-group") },
      source: { code: InputGroupSource },
    },
  },
  render: InputGroupExample,
};

export const CustomItems: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("combobox", "custom-items") },
      source: { code: CustomItemsSource },
    },
  },
  render: CustomItemsExample,
};

export const ClearButton: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("combobox", "clear-button") },
      source: { code: ClearButtonSource },
    },
  },
  render: ClearButtonExample,
};
