import AsyncResultsExample from "./variants/async-results";
import AsyncResultsSource from "./variants/async-results.tsx?raw";
import type { Meta, StoryObj } from "../types";

import { Command } from "@erbium/ui/components/command";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import BasicExample from "./variants/basic";

import BasicSource from "./variants/basic.tsx?raw";

import ShortcutsExample from "./variants/shortcuts";

import ShortcutsSource from "./variants/shortcuts.tsx?raw";

import GroupsExample from "./variants/groups";

import GroupsSource from "./variants/groups.tsx?raw";

import ScrollableExample from "./variants/scrollable";

import ScrollableSource from "./variants/scrollable.tsx?raw";

const meta = {
  component: Command,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("command"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Command>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{ placeholder: string; disabled: boolean }> = {
  argTypes: { disabled: { control: "boolean" }, placeholder: { control: "text" } },
  args: { disabled: false, placeholder: "Search commands" },
  parameters: {
    docs: {
      description: { story: variantDocumentation("command", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("command", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Basic: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("command", "basic") },
      source: { code: BasicSource },
    },
  },
  render: BasicExample,
};

export const Shortcuts: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("command", "shortcuts") },
      source: { code: ShortcutsSource },
    },
  },
  render: ShortcutsExample,
};

export const Groups: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("command", "groups") },
      source: { code: GroupsSource },
    },
  },
  render: GroupsExample,
};

export const Scrollable: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("command", "scrollable") },
      source: { code: ScrollableSource },
    },
  },
  render: ScrollableExample,
};

export const AsyncResults: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("command", "async-results") },
      source: { code: AsyncResultsSource },
    },
  },
  render: AsyncResultsExample,
};
