import type { Meta, StoryObj } from "../types";

import { Collapsible } from "@erbium/ui/components/collapsible";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/collapsible-demo.tsx?raw";

import FileTreeExample from "./variants/file-tree";

import FileTreeSource from "./examples/collapsible-file-tree.tsx?raw";

import BasicExample from "./variants/basic";

import BasicSource from "./examples/collapsible-basic.tsx?raw";

import SettingsPanelExample from "./variants/settings-panel";

import SettingsPanelSource from "./examples/collapsible-settings.tsx?raw";

import ControlledStateExample from "./variants/controlled-state";

import ControlledStateSource from "./variants/controlled-state.tsx?raw";

const meta = {
  component: Collapsible,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("collapsible"),
      },
    },
    layout: "centered",
  },
} satisfies Meta<typeof Collapsible>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: StoryObj<typeof Collapsible> = {
  argTypes: { defaultOpen: { control: "boolean" }, disabled: { control: "boolean" } },
  args: PlaygroundDefaults,
  parameters: {
    docs: {
      description: { story: variantDocumentation("collapsible", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("collapsible", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const FileTree: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("collapsible", "file-tree") },
      source: { code: FileTreeSource },
    },
  },
  render: FileTreeExample,
};

export const Basic: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("collapsible", "basic") },
      source: { code: BasicSource },
    },
  },
  render: BasicExample,
};

export const SettingsPanel: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("collapsible", "settings-panel") },
      source: { code: SettingsPanelSource },
    },
    layout: "padded",
  },
  render: SettingsPanelExample,
};

export const ControlledState: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("collapsible", "controlled-state") },
      source: { code: ControlledStateSource },
    },
  },
  render: ControlledStateExample,
};
