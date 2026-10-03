import type { Meta, StoryObj } from "../types";

import { OTPField } from "@erbium/ui/components/otp-field";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import SeparatorExample from "./variants/separator";

import SeparatorSource from "./variants/separator.tsx?raw";

import ControlledExample from "./variants/controlled";

import ControlledSource from "./variants/controlled.tsx?raw";

import FormExample from "./variants/form";

import FormSource from "./variants/form.tsx?raw";

import DisabledExample from "./variants/disabled";

import DisabledSource from "./variants/disabled.tsx?raw";

import InvalidExample from "./variants/invalid";

import InvalidSource from "./variants/invalid.tsx?raw";

import StatusExample from "./variants/status";

import StatusSource from "./variants/status.tsx?raw";

import PatternExample from "./variants/pattern";

import PatternSource from "./variants/pattern.tsx?raw";

import FourDigitsExample from "./variants/four-digits";

import FourDigitsSource from "./variants/four-digits.tsx?raw";

import AlphanumericExample from "./variants/alphanumeric";

import AlphanumericSource from "./variants/alphanumeric.tsx?raw";

const meta = {
  component: OTPField,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("otp-field"),
      },
    },
  },
} satisfies Meta<typeof OTPField>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  length: number;
  disabled: boolean;
  validationType: "numeric" | "alphanumeric" | "none";
  status: "idle" | "loading" | "success" | "error";
}> = {
  args: { length: 6, disabled: false, validationType: "numeric", status: "idle" },
  argTypes: {
    length: { control: { type: "number", min: 1, max: 8 } },
    disabled: { control: "boolean" },
    validationType: { control: "select", options: ["numeric", "alphanumeric", "none"] },
    status: { control: "select", options: ["idle", "loading", "success", "error"] },
  },
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
