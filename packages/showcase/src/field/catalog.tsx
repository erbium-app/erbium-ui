import type { Meta, StoryObj } from "../types";

import { Field } from "@erbium/ui/components/field";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/field-demo.tsx?raw";

import InputExample from "./variants/input";

import InputSource from "./examples/field-input.tsx?raw";

import TextareaExample from "./variants/textarea";

import TextareaSource from "./examples/field-textarea.tsx?raw";

import SelectExample from "./variants/select";

import SelectSource from "./examples/field-select.tsx?raw";

import SliderExample from "./variants/slider";

import SliderSource from "./examples/field-slider.tsx?raw";

import FieldsetExample from "./variants/fieldset";

import FieldsetSource from "./examples/field-fieldset.tsx?raw";

import CheckboxExample from "./variants/checkbox";

import CheckboxSource from "./examples/field-checkbox.tsx?raw";

import RadioExample from "./variants/radio";

import RadioSource from "./examples/field-radio.tsx?raw";

import SwitchExample from "./variants/switch";

import SwitchSource from "./examples/field-switch.tsx?raw";

import ChoiceCardExample from "./variants/choice-card";

import ChoiceCardSource from "./examples/field-choice-card.tsx?raw";

import FieldGroupExample from "./variants/field-group";

import FieldGroupSource from "./examples/field-group.tsx?raw";

import ResponsiveLayoutExample from "./variants/responsive-layout";

import ResponsiveLayoutSource from "./examples/field-responsive.tsx?raw";

import GroupExample from "./variants/group";

import GroupSource from "./examples/field-notification-settings.tsx?raw";

import ResponsiveExample from "./variants/responsive";

import ResponsiveSource from "./examples/field-profile-form.tsx?raw";

import ValidationAndErrorsExample from "./variants/validation-and-errors";

import ValidationAndErrorsSource from "./variants/validation-and-errors.tsx?raw";

const meta = {
  component: Field,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("field"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  orientation: "vertical" | "horizontal" | "responsive";
  invalid: boolean;
  error: string;
  className: string;
  legendVariant: "legend" | "label";
}> = {
  argTypes: {
    className: { control: "text" },
    error: { control: "text" },
    invalid: { control: "boolean" },
    legendVariant: { control: "select", options: ["legend", "label"] },
    orientation: { control: "select", options: ["vertical", "horizontal", "responsive"] },
  },
  args: PlaygroundDefaults,
  parameters: {
    docs: {
      description: { story: variantDocumentation("field", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("field", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Input: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("field", "input") },
      source: { code: InputSource },
    },
  },
  render: InputExample,
};

export const Textarea: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("field", "textarea") },
      source: { code: TextareaSource },
    },
  },
  render: TextareaExample,
};

export const Select: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("field", "select") },
      source: { code: SelectSource },
    },
  },
  render: SelectExample,
};

export const Slider: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("field", "slider") },
      source: { code: SliderSource },
    },
  },
  render: SliderExample,
};

export const Fieldset: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("field", "fieldset") },
      source: { code: FieldsetSource },
    },
  },
  render: FieldsetExample,
};

export const Checkbox: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("field", "checkbox") },
      source: { code: CheckboxSource },
    },
  },
  render: CheckboxExample,
};

export const Radio: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("field", "radio") },
      source: { code: RadioSource },
    },
  },
  render: RadioExample,
};

export const Switch: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("field", "switch") },
      source: { code: SwitchSource },
    },
  },
  render: SwitchExample,
};

export const ChoiceCard: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("field", "choice-card") },
      source: { code: ChoiceCardSource },
    },
  },
  render: ChoiceCardExample,
};

export const FieldGroup: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("field", "field-group") },
      source: { code: FieldGroupSource },
    },
  },
  render: FieldGroupExample,
};

export const ResponsiveLayout: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("field", "responsive-layout") },
      source: { code: ResponsiveLayoutSource },
    },
  },
  render: ResponsiveLayoutExample,
};

export const Group: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("field", "group") },
      source: { code: GroupSource },
    },
    layout: "padded",
  },
  render: GroupExample,
};

export const Responsive: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("field", "responsive") },
      source: { code: ResponsiveSource },
    },
  },
  render: ResponsiveExample,
};

export const ValidationAndErrors: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("field", "validation-and-errors") },
      source: { code: ValidationAndErrorsSource },
    },
  },
  render: ValidationAndErrorsExample,
};
