import type { Meta, StoryObj } from "../types";

import { NumberField } from "@erbium/ui/components/number-field";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import DefaultExample from "./variants/default";

import DefaultSource from "./variants/default.tsx?raw";

import SizesExample from "./variants/sizes";

import SizesSource from "./variants/sizes.tsx?raw";

import ScrubLabelExample from "./variants/scrub-label";

import ScrubLabelSource from "./variants/scrub-label.tsx?raw";

import FormatsExample from "./variants/formats";

import FormatsSource from "./variants/formats.tsx?raw";

import ControlledExample from "./variants/controlled";

import ControlledSource from "./variants/controlled.tsx?raw";

import DirectionExample from "./variants/direction";

import DirectionSource from "./variants/direction.tsx?raw";

import ShowcaseExample from "./variants/showcase";

import ShowcaseSource from "./variants/showcase.tsx?raw";

const meta = {
  component: NumberField,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("number-field"),
      },
    },
  },
} satisfies Meta<typeof NumberField>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("number-field", "default") },
      source: { code: DefaultSource },
    },
  },
  render: DefaultExample,
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("number-field", "sizes") },
      source: { code: SizesSource },
    },
  },
  render: SizesExample,
};

export const ScrubLabel: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("number-field", "scrub-label") },
      source: { code: ScrubLabelSource },
    },
  },
  render: ScrubLabelExample,
};

export const Formats: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("number-field", "formats") },
      source: { code: FormatsSource },
    },
  },
  render: FormatsExample,
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("number-field", "controlled") },
      source: { code: ControlledSource },
    },
  },
  render: ControlledExample,
};

export const Direction: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("number-field", "direction") },
      source: { code: DirectionSource },
    },
  },
  render: DirectionExample,
};

export const Showcase: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("number-field", "showcase") },
      source: { code: ShowcaseSource },
    },
  },
  render: ShowcaseExample,
};
