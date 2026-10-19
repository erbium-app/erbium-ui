import SearchableExample from "./variants/searchable";
import SearchableSource from "./variants/searchable.tsx?raw";
import { ContextMenu } from "@erbium/ui/components/context-menu";

import type { Meta, StoryObj } from "../types";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import BasicExample from "./variants/basic";

import BasicSource from "./variants/basic.tsx?raw";

import SubmenuExample from "./variants/submenu";

import SubmenuSource from "./variants/submenu.tsx?raw";

import ShortcutsExample from "./variants/shortcuts";

import ShortcutsSource from "./variants/shortcuts.tsx?raw";

import GroupsExample from "./variants/groups";

import GroupsSource from "./variants/groups.tsx?raw";

import IconsExample from "./variants/icons";

import IconsSource from "./variants/icons.tsx?raw";

import CheckboxesExample from "./variants/checkboxes";

import CheckboxesSource from "./variants/checkboxes.tsx?raw";

import RadioExample from "./variants/radio";

import RadioSource from "./variants/radio.tsx?raw";

import ErrorVariantExample from "./variants/error-variant";

import ErrorVariantSource from "./variants/error-variant.tsx?raw";

import SidesExample from "./variants/sides";

import SidesSource from "./variants/sides.tsx?raw";

const meta = {
  component: ContextMenu,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("context-menu"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ContextMenu>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
}> = {
  argTypes: {
    align: { control: "select", options: ["start", "center", "end"] },
    side: { control: "select", options: ["top", "right", "bottom", "left"] },
  },
  args: { align: "start", side: "bottom" },
  parameters: {
    docs: {
      description: { story: variantDocumentation("context-menu", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("context-menu", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Basic: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("context-menu", "basic") },
      source: { code: BasicSource },
    },
  },
  render: BasicExample,
};

export const Submenu: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("context-menu", "submenu") },
      source: { code: SubmenuSource },
    },
  },
  render: SubmenuExample,
};

export const Shortcuts: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("context-menu", "shortcuts") },
      source: { code: ShortcutsSource },
    },
  },
  render: ShortcutsExample,
};

export const Groups: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("context-menu", "groups") },
      source: { code: GroupsSource },
    },
  },
  render: GroupsExample,
};

export const Icons: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("context-menu", "icons") },
      source: { code: IconsSource },
    },
  },
  render: IconsExample,
};

export const Checkboxes: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("context-menu", "checkboxes") },
      source: { code: CheckboxesSource },
    },
  },
  render: CheckboxesExample,
};

export const Radio: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("context-menu", "radio") },
      source: { code: RadioSource },
    },
  },
  render: RadioExample,
};

export const ErrorVariant: Story = {
  name: "Error",
  parameters: {
    docs: {
      description: { story: variantDocumentation("context-menu", "error-variant") },
      source: { code: ErrorVariantSource },
    },
  },
  render: ErrorVariantExample,
};

export const Sides: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("context-menu", "sides") },
      source: { code: SidesSource },
    },
  },
  render: SidesExample,
};

export const Searchable: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("context-menu", "searchable") },
      source: { code: SearchableSource },
    },
  },
  render: SearchableExample,
};
