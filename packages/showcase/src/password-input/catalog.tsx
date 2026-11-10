import type { Meta, StoryObj } from "../types";

import { PasswordInput } from "@erbium/ui/components/password-input";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import NewPasswordExample from "./variants/new-password";

import NewPasswordSource from "./variants/new-password.tsx?raw";

import FormExample from "./variants/form";

import FormSource from "./variants/form.tsx?raw";

import ControlledExample from "./variants/controlled";

import ControlledSource from "./variants/controlled.tsx?raw";

import CustomExample from "./variants/custom";

import CustomSource from "./variants/custom.tsx?raw";

import DisabledExample from "./variants/disabled";

import DisabledSource from "./variants/disabled.tsx?raw";

import InvalidExample from "./variants/invalid";

import InvalidSource from "./variants/invalid.tsx?raw";

const meta = {
  component: PasswordInput,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("password-input"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PasswordInput>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof PasswordInput> = {
  argTypes: {
    autoComplete: { control: "select", options: ["current-password", "new-password"] },
    defaultVisible: { control: "boolean" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
  },
  args: {
    autoComplete: "current-password",
    defaultVisible: false,
    disabled: false,
    placeholder: "Enter your password",
    readOnly: false,
  },
  parameters: {
    docs: {
      description: { story: variantDocumentation("password-input", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("password-input", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const NewPassword: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("password-input", "new-password") },
      source: { code: NewPasswordSource },
    },
  },
  render: NewPasswordExample,
};

export const Form: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("password-input", "form") },
      source: { code: FormSource },
    },
  },
  render: FormExample,
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("password-input", "controlled") },
      source: { code: ControlledSource },
    },
  },
  render: ControlledExample,
};

export const Custom: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("password-input", "custom") },
      source: { code: CustomSource },
    },
  },
  render: CustomExample,
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("password-input", "disabled") },
      source: { code: DisabledSource },
    },
  },
  render: DisabledExample,
};

export const Invalid: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("password-input", "invalid") },
      source: { code: InvalidSource },
    },
  },
  render: InvalidExample,
};
