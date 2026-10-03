import type { Meta, StoryObj } from "../types";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import LadderExample from "./variants/ladder";

import LadderSource from "./variants/ladder.tsx?raw";

import ColoredExample from "./variants/colored";

import ColoredSource from "./variants/colored.tsx?raw";

import RolesExample from "./variants/roles";

import RolesSource from "./variants/roles.tsx?raw";

import NestingExample from "./variants/nesting";

import NestingSource from "./variants/nesting.tsx?raw";

import StatesExample from "./variants/states";

import StatesSource from "./variants/states.tsx?raw";

import ControlStatesExample from "./variants/control-states";

import ControlStatesSource from "./variants/control-states.tsx?raw";

const meta = {
  title: "Foundations/Surfaces",
  parameters: {
    docs: { description: { component: componentDocumentation("surfaces") } },
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Ladder: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("surfaces", "ladder") },
      source: { code: LadderSource },
    },
  },
  render: LadderExample,
};

export const Colored: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("surfaces", "colored") },
      source: { code: ColoredSource },
    },
  },
  render: ColoredExample,
};

export const Roles: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("surfaces", "roles") },
      source: { code: RolesSource },
    },
  },
  render: RolesExample,
};

export const Nesting: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("surfaces", "nesting") },
      source: { code: NestingSource },
    },
  },
  render: NestingExample,
};

export const States: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("surfaces", "states") },
      source: { code: StatesSource },
    },
  },
  render: StatesExample,
};

export const ControlStates: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("surfaces", "control-states") },
      source: { code: ControlStatesSource },
    },
  },
  render: ControlStatesExample,
};
