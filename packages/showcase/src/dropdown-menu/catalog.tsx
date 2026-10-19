import SearchableExample from "./variants/searchable";
import SearchableSource from "./variants/searchable.tsx?raw";
import { DropdownMenu } from "@erbium/ui/components/dropdown-menu";

import type { Meta, StoryObj } from "../types";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import RadioGroupExample from "./variants/radio-group";

import RadioGroupSource from "./variants/radio-group.tsx?raw";

import BasicExample from "./variants/basic";

import BasicSource from "./variants/basic.tsx?raw";

import SubmenuExample from "./variants/submenu";

import SubmenuSource from "./variants/submenu.tsx?raw";

import ShortcutsExample from "./variants/shortcuts";

import ShortcutsSource from "./variants/shortcuts.tsx?raw";

import IconsExample from "./variants/icons";

import IconsSource from "./variants/icons.tsx?raw";

import CheckboxesExample from "./variants/checkboxes";

import CheckboxesSource from "./variants/checkboxes.tsx?raw";

import CheckboxesIconsExample from "./variants/checkboxes-icons";

import CheckboxesIconsSource from "./variants/checkboxes-icons.tsx?raw";

import RadioIconsExample from "./variants/radio-icons";

import RadioIconsSource from "./variants/radio-icons.tsx?raw";

import ErrorVariantExample from "./variants/error-variant";

import ErrorVariantSource from "./variants/error-variant.tsx?raw";

import AvatarExample from "./variants/avatar";

import AvatarSource from "./variants/avatar.tsx?raw";

import ComplexExample from "./variants/complex";

import ComplexSource from "./variants/complex.tsx?raw";

const meta = {
  component: DropdownMenu,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("dropdown-menu"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DropdownMenu>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
  defaultOpen: boolean;
}> = {
  argTypes: {
    align: { control: "select", options: ["start", "center", "end"] },
    defaultOpen: { control: "boolean" },
    side: { control: "select", options: ["top", "right", "bottom", "left"] },
  },
  args: { align: "start", defaultOpen: false, side: "bottom" },
  parameters: {
    docs: {
      description: { story: variantDocumentation("dropdown-menu", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("dropdown-menu", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const RadioGroup: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("dropdown-menu", "radio-group") },
      source: { code: RadioGroupSource },
    },
  },
  render: RadioGroupExample,
};

export const Basic: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("dropdown-menu", "basic") },
      source: { code: BasicSource },
    },
  },
  render: BasicExample,
};

export const Submenu: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("dropdown-menu", "submenu") },
      source: { code: SubmenuSource },
    },
  },
  render: SubmenuExample,
};

export const Shortcuts: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("dropdown-menu", "shortcuts") },
      source: { code: ShortcutsSource },
    },
  },
  render: ShortcutsExample,
};

export const Icons: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("dropdown-menu", "icons") },
      source: { code: IconsSource },
    },
  },
  render: IconsExample,
};

export const Checkboxes: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("dropdown-menu", "checkboxes") },
      source: { code: CheckboxesSource },
    },
  },
  render: CheckboxesExample,
};

export const CheckboxesIcons: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("dropdown-menu", "checkboxes-icons") },
      source: { code: CheckboxesIconsSource },
    },
  },
  render: CheckboxesIconsExample,
};

export const RadioIcons: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("dropdown-menu", "radio-icons") },
      source: { code: RadioIconsSource },
    },
  },
  render: RadioIconsExample,
};

export const ErrorVariant: Story = {
  name: "Error",
  parameters: {
    docs: {
      description: { story: variantDocumentation("dropdown-menu", "error-variant") },
      source: { code: ErrorVariantSource },
    },
  },
  render: ErrorVariantExample,
};

export const Avatar: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("dropdown-menu", "avatar") },
      source: { code: AvatarSource },
    },
  },
  render: AvatarExample,
};

export const Complex: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("dropdown-menu", "complex") },
      source: { code: ComplexSource },
    },
  },
  render: ComplexExample,
};

export const Searchable: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("dropdown-menu", "searchable") },
      source: { code: SearchableSource },
    },
  },
  render: SearchableExample,
};
