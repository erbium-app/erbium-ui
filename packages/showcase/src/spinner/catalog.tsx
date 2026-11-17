import type { Meta, StoryObj } from "../types";

import { Spinner } from "@erbium/ui/components/spinner";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/spinner-demo.tsx?raw";

import SizeExample from "./variants/size";

import SizeSource from "./examples/spinner-size.tsx?raw";

import ButtonExample from "./variants/button";

import ButtonSource from "./examples/spinner-button.tsx?raw";

import BadgeExample from "./variants/badge";

import BadgeSource from "./examples/spinner-badge.tsx?raw";

import InputGroupExample from "./variants/input-group";

import InputGroupSource from "./examples/spinner-input-group.tsx?raw";

const meta = {
  component: Spinner,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("spinner"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof Spinner> = {
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "default", "lg", "xl"] },
    "aria-label": { control: "text" },
  },
  args: PlaygroundDefaults,
  parameters: {
    docs: {
      description: { story: variantDocumentation("spinner", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("spinner", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Size: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("spinner", "size") },
      source: { code: SizeSource },
    },
  },
  render: SizeExample,
};

export const Button: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("spinner", "button") },
      source: { code: ButtonSource },
    },
  },
  render: ButtonExample,
};

export const Badge: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("spinner", "badge") },
      source: { code: BadgeSource },
    },
  },
  render: BadgeExample,
};

export const InputGroup: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("spinner", "input-group") },
      source: { code: InputGroupSource },
    },
  },
  render: InputGroupExample,
};
