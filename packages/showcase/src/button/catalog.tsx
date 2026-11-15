import type { Meta, StoryObj } from "../types";

import { Button } from "@erbium/ui/components/button";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import VariantsExample from "./variants/variants";

import VariantsSource from "./variants/variants.tsx?raw";

import SizesExample from "./variants/sizes";

import SizesSource from "./variants/sizes.tsx?raw";

import ShortcutsExample from "./variants/shortcuts";

import ShortcutsSource from "./variants/shortcuts.tsx?raw";

import HotkeyExample from "./variants/hotkey";

import HotkeySource from "./variants/hotkey.tsx?raw";

import DisabledExample from "./variants/disabled";

import DisabledSource from "./variants/disabled.tsx?raw";

import LoadingExample from "./variants/loading";

import LoadingSource from "./variants/loading.tsx?raw";

import LoadingDirectionsExample from "./variants/loading-directions";

import LoadingDirectionsSource from "./variants/loading-directions.tsx?raw";

import SizeExample from "./variants/size";

import SizeSource from "./variants/size.tsx?raw";

import DefaultExample from "./variants/default";

import DefaultSource from "./variants/default.tsx?raw";

import OutlineExample from "./variants/outline";

import OutlineSource from "./variants/outline.tsx?raw";

import SecondaryExample from "./variants/secondary";

import SecondarySource from "./variants/secondary.tsx?raw";

import GhostExample from "./variants/ghost";

import GhostSource from "./variants/ghost.tsx?raw";

import ErrorVariantExample from "./variants/error-variant";

import ErrorVariantSource from "./variants/error-variant.tsx?raw";

import LinkExample from "./variants/link";

import LinkSource from "./variants/link.tsx?raw";

import IconExample from "./variants/icon";

import IconSource from "./variants/icon.tsx?raw";

import RoundedExample from "./variants/rounded";

import RoundedSource from "./variants/rounded.tsx?raw";

import ButtonGroupExample from "./variants/button-group";

import ButtonGroupSource from "./variants/button-group.tsx?raw";

import WithSpinnerExample from "./variants/with-spinner";

import WithSpinnerSource from "./variants/with-spinner.tsx?raw";

import WithIconExample from "./variants/with-icon";

import WithIconSource from "./variants/with-icon.tsx?raw";

import AsLinkExample from "./variants/as-link";

import AsLinkSource from "./variants/as-link.tsx?raw";

const meta = {
  component: Button,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("button"),
      },
    },
    layout: "centered",
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof Button> = {
  argTypes: {
    loading: {
      control: "boolean",
      description: "Show a spinner and block activation while an action runs.",
    },
    size: {
      control: "select",
      description: "Button size, including icon-only sizes.",
      options: ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"],
      table: { defaultValue: { summary: "default" } },
    },
    variant: {
      control: "select",
      description: "Visual style of the button.",
      options: [
        "default",
        "outline",
        "ghost",
        "error",
        "ghost-error",
        "ghost-success",
        "ghost-warning",
        "ghost-info",
        "secondary",
        "link",
      ],
      table: { defaultValue: { summary: "default" } },
    },
  },
  args: {
    loading: false,
    size: "default",
    variant: "default",
  },
  parameters: {
    docs: {
      description: { story: variantDocumentation("button", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("button", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("button", "variants") },
      source: { code: VariantsSource },
    },
  },
  render: VariantsExample,
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("button", "sizes") },
      source: { code: SizesSource },
    },
  },
  render: SizesExample,
};

export const Shortcuts: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("button", "shortcuts") },
      source: { code: ShortcutsSource },
    },
  },
  render: ShortcutsExample,
};

export const Hotkey: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("button", "hotkey") },
      source: { code: HotkeySource },
    },
  },
  render: HotkeyExample,
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("button", "disabled") },
      source: { code: DisabledSource },
    },
  },
  render: DisabledExample,
};

export const Loading: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("button", "loading") },
      source: { code: LoadingSource },
    },
  },
  render: LoadingExample,
};

export const LoadingDirections: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("button", "loading-directions") },
      source: { code: LoadingDirectionsSource },
    },
  },
  render: LoadingDirectionsExample,
};

export const Size: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("button", "size") },
      source: { code: SizeSource },
    },
  },
  render: SizeExample,
};

export const Default: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("button", "default") },
      source: { code: DefaultSource },
    },
  },
  render: DefaultExample,
};

export const Outline: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("button", "outline") },
      source: { code: OutlineSource },
    },
  },
  render: OutlineExample,
};

export const Secondary: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("button", "secondary") },
      source: { code: SecondarySource },
    },
  },
  render: SecondaryExample,
};

export const Ghost: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("button", "ghost") },
      source: { code: GhostSource },
    },
  },
  render: GhostExample,
};

export const ErrorVariant: Story = {
  name: "Error",
  parameters: {
    docs: {
      description: { story: variantDocumentation("button", "error-variant") },
      source: { code: ErrorVariantSource },
    },
  },
  render: ErrorVariantExample,
};

export const Link: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("button", "link") },
      source: { code: LinkSource },
    },
  },
  render: LinkExample,
};

export const Icon: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("button", "icon") },
      source: { code: IconSource },
    },
  },
  render: IconExample,
};

export const Rounded: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("button", "rounded") },
      source: { code: RoundedSource },
    },
  },
  render: RoundedExample,
};

export const ButtonGroup: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("button", "button-group") },
      source: { code: ButtonGroupSource },
    },
  },
  render: ButtonGroupExample,
};

export const WithSpinner: Story = {
  name: "Spinner",
  parameters: {
    docs: {
      description: { story: variantDocumentation("button", "with-spinner") },
      source: { code: WithSpinnerSource },
    },
  },
  render: WithSpinnerExample,
};

export const WithIcon: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("button", "with-icon") },
      source: { code: WithIconSource },
    },
  },
  render: WithIconExample,
};

export const AsLink: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("button", "as-link") },
      source: { code: AsLinkSource },
    },
  },
  render: AsLinkExample,
};
