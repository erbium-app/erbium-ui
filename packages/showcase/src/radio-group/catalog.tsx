import type { Meta, StoryObj } from "../types";

import { RadioGroup } from "@erbium/ui/components/radio-group";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import ControlledExample from "./variants/controlled";

import ControlledSource from "./variants/controlled.tsx?raw";

import ReadOnlyExample from "./variants/read-only";

import ReadOnlySource from "./variants/read-only.tsx?raw";

import FormExample from "./variants/form";

import FormSource from "./variants/form.tsx?raw";

import DescriptionExample from "./variants/description";

import DescriptionSource from "./variants/description.tsx?raw";

import ChoiceCardExample from "./variants/choice-card";

import ChoiceCardSource from "./variants/choice-card.tsx?raw";

import FieldsetExample from "./variants/fieldset";

import FieldsetSource from "./variants/fieldset.tsx?raw";

import DisabledExample from "./variants/disabled";

import DisabledSource from "./variants/disabled.tsx?raw";

import InvalidExample from "./variants/invalid";

import InvalidSource from "./variants/invalid.tsx?raw";

const meta = {
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("radio-group"),
      },
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof RadioGroup> = {
  args: { defaultValue: "one", disabled: false, readOnly: false, required: false },
  argTypes: {
    defaultValue: {
      control: "select",
      options: ["one", "two", "three"],
      description: "Initially selected value (uncontrolled).",
    },
    disabled: { control: "boolean", description: "Disables every item in the group." },
    readOnly: { control: "boolean", description: "Focusable, but the selection cannot change." },
    required: { control: "boolean", description: "A value must be chosen before submitting." },
    onValueChange: { action: "onValueChange" },
  },
  parameters: {
    docs: {
      description: { story: variantDocumentation("radio-group", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("radio-group", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("radio-group", "controlled") },
      source: { code: ControlledSource },
    },
  },
  render: ControlledExample,
};

export const ReadOnly: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("radio-group", "read-only") },
      source: { code: ReadOnlySource },
    },
  },
  render: ReadOnlyExample,
};

export const Form: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("radio-group", "form") },
      source: { code: FormSource },
    },
  },
  render: FormExample,
};

export const Description: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("radio-group", "description") },
      source: { code: DescriptionSource },
    },
  },
  render: DescriptionExample,
};

export const ChoiceCard: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("radio-group", "choice-card") },
      source: { code: ChoiceCardSource },
    },
  },
  render: ChoiceCardExample,
};

export const Fieldset: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("radio-group", "fieldset") },
      source: { code: FieldsetSource },
    },
  },
  render: FieldsetExample,
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("radio-group", "disabled") },
      source: { code: DisabledSource },
    },
  },
  render: DisabledExample,
};

export const Invalid: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("radio-group", "invalid") },
      source: { code: InvalidSource },
    },
  },
  render: InvalidExample,
};
