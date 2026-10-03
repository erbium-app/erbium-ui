import type { Meta, StoryObj } from "../types";

import { Alert } from "@erbium/ui/components/alert";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import ErrorVariantExample from "./variants/error-variant";

import ErrorVariantSource from "./variants/error-variant.tsx?raw";

import BasicExample from "./variants/basic";

import BasicSource from "./variants/basic.tsx?raw";

import InfoExample from "./variants/info";

import InfoSource from "./variants/info.tsx?raw";

import SuccessExample from "./variants/success";

import SuccessSource from "./variants/success.tsx?raw";

import ActionExample from "./variants/action";

import ActionSource from "./variants/action.tsx?raw";

import WarningExample from "./variants/warning";

import WarningSource from "./variants/warning.tsx?raw";

const meta = {
  component: Alert,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("alert"),
      },
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof Alert> = {
  args: { variant: "default", className: "" },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "error", "info", "success", "warning"],
    },
  },
  parameters: {
    docs: {
      description: { story: variantDocumentation("alert", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("alert", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const ErrorVariant: Story = {
  name: "Error",
  parameters: {
    docs: {
      description: { story: variantDocumentation("alert", "error-variant") },
      source: { code: ErrorVariantSource },
    },
  },
  render: ErrorVariantExample,
};

export const Basic: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("alert", "basic") },
      source: { code: BasicSource },
    },
  },
  render: BasicExample,
};

export const Info: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("alert", "info") },
      source: { code: InfoSource },
    },
  },
  render: InfoExample,
};

export const Success: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("alert", "success") },
      source: { code: SuccessSource },
    },
  },
  render: SuccessExample,
};

export const Action: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("alert", "action") },
      source: { code: ActionSource },
    },
  },
  render: ActionExample,
};

export const Warning: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("alert", "warning") },
      source: { code: WarningSource },
    },
  },
  render: WarningExample,
};
