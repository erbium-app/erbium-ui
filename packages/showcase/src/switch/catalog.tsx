import type { Meta, StoryObj } from "../types";

import { Switch } from "@erbium/ui/components/switch";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import OnExample from "./variants/on";

import OnSource from "./variants/on.tsx?raw";

import DisabledExample from "./variants/disabled";

import DisabledSource from "./variants/disabled.tsx?raw";

import DescriptionExample from "./variants/description";

import DescriptionSource from "./variants/description.tsx?raw";

import ChoiceCardExample from "./variants/choice-card";

import ChoiceCardSource from "./variants/choice-card.tsx?raw";

import InvalidExample from "./variants/invalid";

import InvalidSource from "./variants/invalid.tsx?raw";

import SizeExample from "./variants/size";

import SizeSource from "./variants/size.tsx?raw";

import IconsExample from "./variants/icons";

import IconsSource from "./variants/icons.tsx?raw";

import ControlledExample from "./variants/controlled";

import ControlledSource from "./variants/controlled.tsx?raw";

import ReadOnlyExample from "./variants/read-only";

import ReadOnlySource from "./variants/read-only.tsx?raw";

import FormExample from "./variants/form";

import FormSource from "./variants/form.tsx?raw";

const meta = {
  title: "UI/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("switch"),
      },
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof Switch> = {
  args: {
    defaultChecked: false,
    disabled: false,
    readOnly: false,
    required: false,
    size: "default",
  },
  argTypes: {
    defaultChecked: { control: "boolean", description: "Initial state (uncontrolled)." },
    disabled: { control: "boolean", description: "Ignores user interaction." },
    readOnly: { control: "boolean", description: "Focusable, but the state cannot change." },
    required: { control: "boolean", description: "Must be on before the form submits." },
    size: { control: "inline-radio", options: ["sm", "default"] },
    onCheckedChange: { action: "onCheckedChange" },
  },
  parameters: {
    docs: {
      description: { story: variantDocumentation("switch", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("switch", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const On: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("switch", "on") },
      source: { code: OnSource },
    },
  },
  render: OnExample,
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("switch", "disabled") },
      source: { code: DisabledSource },
    },
  },
  render: DisabledExample,
};

export const Description: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("switch", "description") },
      source: { code: DescriptionSource },
    },
  },
  render: DescriptionExample,
};

export const ChoiceCard: Story = {
  parameters: {
    layout: "padded",
    docs: {
      description: { story: variantDocumentation("switch", "choice-card") },
      source: { code: ChoiceCardSource },
    },
  },
  render: ChoiceCardExample,
};

export const Invalid: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("switch", "invalid") },
      source: { code: InvalidSource },
    },
  },
  render: InvalidExample,
};

export const Size: Story = {
  parameters: {
    layout: "padded",
    docs: {
      description: { story: variantDocumentation("switch", "size") },
      source: { code: SizeSource },
    },
  },
  render: SizeExample,
};

export const Icons: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("switch", "icons") },
      source: { code: IconsSource },
    },
  },
  render: IconsExample,
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("switch", "controlled") },
      source: { code: ControlledSource },
    },
  },
  render: ControlledExample,
};

export const ReadOnly: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("switch", "read-only") },
      source: { code: ReadOnlySource },
    },
  },
  render: ReadOnlyExample,
};

export const Form: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("switch", "form") },
      source: { code: FormSource },
    },
  },
  render: FormExample,
};
