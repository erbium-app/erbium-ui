import type { Meta, StoryObj } from "../types";

import { OTPField } from "@erbium/ui/components/otp-field";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/otp-field-demo.tsx?raw";

import SeparatorExample from "./variants/separator";

import SeparatorSource from "./examples/otp-field-separator.tsx?raw";

import ControlledExample from "./variants/controlled";

import ControlledSource from "./examples/otp-field-controlled.tsx?raw";

import FormExample from "./variants/form";

import FormSource from "./examples/otp-field-form.tsx?raw";

import DisabledExample from "./variants/disabled";

import DisabledSource from "./examples/otp-field-disabled.tsx?raw";

import InvalidExample from "./variants/invalid";

import InvalidSource from "./examples/otp-field-invalid.tsx?raw";

import StatusExample from "./variants/status";

import StatusSource from "./examples/otp-field-status.tsx?raw";

import PatternExample from "./variants/pattern";

import PatternSource from "./examples/otp-field-pattern.tsx?raw";

import FourDigitsExample from "./variants/four-digits";

import FourDigitsSource from "./examples/otp-field-four-digits.tsx?raw";

import AlphanumericExample from "./variants/alphanumeric";

import AlphanumericSource from "./examples/otp-field-alphanumeric.tsx?raw";

const meta = {
  component: OTPField,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("otp-field"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof OTPField>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  length: number;
  disabled: boolean;
  validationType: "numeric" | "alphanumeric" | "none";
  isValidating: boolean;
}> = {
  argTypes: {
    disabled: { control: "boolean" },
    isValidating: { control: "boolean" },
    length: { control: { max: 8, min: 1, type: "number" } },
    validationType: { control: "select", options: ["numeric", "alphanumeric", "none"] },
  },
  args: PlaygroundDefaults,
  parameters: {
    docs: {
      description: { story: variantDocumentation("otp-field", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("otp-field", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Separator: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("otp-field", "separator") },
      source: { code: SeparatorSource },
    },
  },
  render: SeparatorExample,
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("otp-field", "controlled") },
      source: { code: ControlledSource },
    },
  },
  render: ControlledExample,
};

export const Form: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("otp-field", "form") },
      source: { code: FormSource },
    },
  },
  render: FormExample,
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("otp-field", "disabled") },
      source: { code: DisabledSource },
    },
  },
  render: DisabledExample,
};

export const Invalid: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("otp-field", "invalid") },
      source: { code: InvalidSource },
    },
  },
  render: InvalidExample,
};

export const Status: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("otp-field", "status") },
      source: { code: StatusSource },
    },
  },
  render: StatusExample,
};

export const Pattern: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("otp-field", "pattern") },
      source: { code: PatternSource },
    },
  },
  render: PatternExample,
};

export const FourDigits: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("otp-field", "four-digits") },
      source: { code: FourDigitsSource },
    },
  },
  render: FourDigitsExample,
};

export const Alphanumeric: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("otp-field", "alphanumeric") },
      source: { code: AlphanumericSource },
    },
  },
  render: AlphanumericExample,
};
