import type { Meta, StoryObj } from "../types";

import { StatefulButton } from "@erbium/ui/components/stateful-button";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import AsyncActionExample from "./variants/async-action";

import AsyncActionSource from "./variants/async-action.tsx?raw";

import TanStackFormExample from "./variants/tan-stack-form";

import TanStackFormSource from "./examples/stateful-button-form.tsx?raw";

import DirectionsExample from "./variants/directions";

import DirectionsSource from "./variants/directions.tsx?raw";

const meta = {
  component: StatefulButton,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("stateful-button"),
      },
    },
  },
} satisfies Meta<typeof StatefulButton>;

export default meta;

type Story = StoryObj;

export const AsyncAction: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("stateful-button", "async-action") },
      source: { code: AsyncActionSource },
    },
  },
  render: AsyncActionExample,
};

export const TanStackForm: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("stateful-button", "tan-stack-form") },
      source: { code: TanStackFormSource },
    },
  },
  render: TanStackFormExample,
};

export const Directions: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("stateful-button", "directions") },
      source: { code: DirectionsSource },
    },
  },
  render: DirectionsExample,
};
