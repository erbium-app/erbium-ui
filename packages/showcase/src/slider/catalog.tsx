import type { Meta, StoryObj } from "../types";

import { Slider } from "@erbium/ui/components/slider";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/slider-demo.tsx?raw";

import MidpointExample from "./variants/midpoint";

import MidpointSource from "./variants/midpoint.tsx?raw";

import DisabledExample from "./variants/disabled";

import DisabledSource from "./variants/disabled.tsx?raw";

import RangeExample from "./variants/range";

import RangeSource from "./examples/slider-range.tsx?raw";

import VerticalExample from "./variants/vertical";

import VerticalSource from "./examples/slider-vertical.tsx?raw";

import ControlledExample from "./variants/controlled";

import ControlledSource from "./examples/slider-controlled.tsx?raw";

import MultipleThumbsExample from "./variants/multiple-thumbs";

import MultipleThumbsSource from "./examples/slider-multiple.tsx?raw";

import ThumbCollisionExample from "./variants/thumb-collision";

import ThumbCollisionSource from "./variants/thumb-collision.tsx?raw";

import MarksExample from "./variants/marks";

import MarksSource from "./variants/marks.tsx?raw";

import StepsExample from "./variants/steps";

import StepsSource from "./variants/steps.tsx?raw";

import LogarithmicExample from "./variants/logarithmic";

import LogarithmicSource from "./variants/logarithmic.tsx?raw";

const meta = {
  component: Slider,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("slider"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof Slider> = {
  argTypes: {
    defaultValue: { control: "object" },
    disabled: { control: "boolean" },
    max: { control: "number" },
    min: { control: "number" },
    step: { control: "number" },
    marks: { control: "boolean" },
  },
  args: PlaygroundDefaults,
  parameters: {
    docs: {
      description: { story: variantDocumentation("slider", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("slider", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Midpoint: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("slider", "midpoint") },
      source: { code: MidpointSource },
    },
  },
  render: MidpointExample,
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("slider", "disabled") },
      source: { code: DisabledSource },
    },
  },
  render: DisabledExample,
};

export const Range: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("slider", "range") },
      source: { code: RangeSource },
    },
  },
  render: RangeExample,
};

export const Vertical: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("slider", "vertical") },
      source: { code: VerticalSource },
    },
  },
  render: VerticalExample,
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("slider", "controlled") },
      source: { code: ControlledSource },
    },
  },
  render: ControlledExample,
};

export const MultipleThumbs: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("slider", "multiple-thumbs") },
      source: { code: MultipleThumbsSource },
    },
  },
  render: MultipleThumbsExample,
};

export const ThumbCollision: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("slider", "thumb-collision") },
      source: { code: ThumbCollisionSource },
    },
  },
  render: ThumbCollisionExample,
};

export const Marks: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("slider", "marks") },
      source: { code: MarksSource },
    },
  },
  render: MarksExample,
};

export const Steps: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("slider", "steps") },
      source: { code: StepsSource },
    },
  },
  render: StepsExample,
};

export const Logarithmic: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("slider", "logarithmic") },
      source: { code: LogarithmicSource },
    },
  },
  render: LogarithmicExample,
};
