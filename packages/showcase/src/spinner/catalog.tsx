import type { Meta, StoryObj } from "../types";

import { Spinner } from "@erbium/ui/components/spinner";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import SizeExample from "./variants/size";

import SizeSource from "./variants/size.tsx?raw";

import ButtonExample from "./variants/button";

import ButtonSource from "./variants/button.tsx?raw";

import BadgeExample from "./variants/badge";

import BadgeSource from "./variants/badge.tsx?raw";

import InputGroupExample from "./variants/input-group";

import InputGroupSource from "./variants/input-group.tsx?raw";

import EmptyExample from "./variants/empty";

import EmptySource from "./variants/empty.tsx?raw";

const meta = {
  title: "UI/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("spinner"),
      },
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof Spinner> = {
  args: { className: "size-6" },
  argTypes: {},
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

export const Empty: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("spinner", "empty") },
      source: { code: EmptySource },
    },
  },
  render: EmptyExample,
};
