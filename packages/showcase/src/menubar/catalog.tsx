import SearchableExample from "./variants/searchable";
import SearchableSource from "./variants/searchable.tsx?raw";
import { Menubar } from "@erbium/ui/components/menubar";

import type { Meta, StoryObj } from "../types";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import CheckboxExample from "./variants/checkbox";

import CheckboxSource from "./variants/checkbox.tsx?raw";

import RadioExample from "./variants/radio";

import RadioSource from "./variants/radio.tsx?raw";

import SubmenuExample from "./variants/submenu";

import SubmenuSource from "./variants/submenu.tsx?raw";

import WithIconsExample from "./variants/with-icons";

import WithIconsSource from "./variants/with-icons.tsx?raw";

const meta = {
  component: Menubar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("menubar"),
      },
    },
  },
} satisfies Meta<typeof Menubar>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  className: string;
  align: "start" | "center" | "end";
  itemVariant: "default" | "error";
  disabled: boolean;
}> = {
  args: { className: "", align: "start", itemVariant: "default", disabled: false },
  argTypes: {
    className: { control: "text" },
    align: { control: "select", options: ["start", "center", "end"] },
    itemVariant: { control: "select", options: ["default", "error"] },
    disabled: { control: "boolean" },
  },
  parameters: {
    docs: {
      description: { story: variantDocumentation("menubar", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("menubar", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Checkbox: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("menubar", "checkbox") },
      source: { code: CheckboxSource },
    },
  },
  render: CheckboxExample,
};

export const Radio: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("menubar", "radio") },
      source: { code: RadioSource },
    },
  },
  render: RadioExample,
};

export const Submenu: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("menubar", "submenu") },
      source: { code: SubmenuSource },
    },
  },
  render: SubmenuExample,
};

export const WithIcons: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("menubar", "with-icons") },
      source: { code: WithIconsSource },
    },
  },
  render: WithIconsExample,
};

export const Searchable: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("menubar", "searchable") },
      source: { code: SearchableSource },
    },
  },
  render: SearchableExample,
};
