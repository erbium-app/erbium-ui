import type { Meta, StoryObj } from "../types";

import { Control } from "@erbium/ui/components/control";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import NumberExample from "./variants/number";

import NumberSource from "./variants/number.tsx?raw";

import ContinuousNumberExample from "./variants/continuous-number";

import ContinuousNumberSource from "./variants/continuous-number.tsx?raw";

import DiscreteNumberExample from "./variants/discrete-number";

import DiscreteNumberSource from "./variants/discrete-number.tsx?raw";

import TextExample from "./variants/text";

import TextSource from "./variants/text.tsx?raw";

import TextareaExample from "./variants/textarea";

import TextareaSource from "./variants/textarea.tsx?raw";

import BooleanExample from "./variants/boolean";

import BooleanSource from "./variants/boolean.tsx?raw";

import SegmentedExample from "./variants/segmented";

import SegmentedSource from "./variants/segmented.tsx?raw";

import SelectExample from "./variants/select";

import SelectSource from "./variants/select.tsx?raw";

import ColorExample from "./variants/color";

import ColorSource from "./variants/color.tsx?raw";

import ImageExample from "./variants/image";

import ImageSource from "./variants/image.tsx?raw";

import PadExample from "./variants/pad";

import PadSource from "./variants/pad.tsx?raw";

import SpringExample from "./variants/spring";

import SpringSource from "./variants/spring.tsx?raw";

import TransitionExample from "./variants/transition";

import TransitionSource from "./variants/transition.tsx?raw";

import ActionExample from "./variants/action";

import ActionSource from "./variants/action.tsx?raw";

import SectionExample from "./variants/section";

import SectionSource from "./variants/section.tsx?raw";

import GroupExample from "./variants/group";

import GroupSource from "./variants/group.tsx?raw";

import RowExample from "./variants/row";

import RowSource from "./variants/row.tsx?raw";

const meta = {
  component: Control.Number,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("control"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Control.Number>;

export default meta;

type Story = StoryObj;

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("control", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Number: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("control", "number") },
      source: { code: NumberSource },
    },
  },
  render: NumberExample,
};

export const ContinuousNumber: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("control", "continuous-number") },
      source: { code: ContinuousNumberSource },
    },
  },
  render: ContinuousNumberExample,
};

export const DiscreteNumber: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("control", "discrete-number") },
      source: { code: DiscreteNumberSource },
    },
  },
  render: DiscreteNumberExample,
};

export const Text: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("control", "text") },
      source: { code: TextSource },
    },
  },
  render: TextExample,
};

export const Textarea: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("control", "textarea") },
      source: { code: TextareaSource },
    },
  },
  render: TextareaExample,
};

export const Boolean: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("control", "boolean") },
      source: { code: BooleanSource },
    },
  },
  render: BooleanExample,
};

export const Segmented: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("control", "segmented") },
      source: { code: SegmentedSource },
    },
  },
  render: SegmentedExample,
};

export const Select: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("control", "select") },
      source: { code: SelectSource },
    },
  },
  render: SelectExample,
};

export const Color: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("control", "color") },
      source: { code: ColorSource },
    },
  },
  render: ColorExample,
};

export const Image: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("control", "image") },
      source: { code: ImageSource },
    },
  },
  render: ImageExample,
};

export const Pad: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("control", "pad") },
      source: { code: PadSource },
    },
  },
  render: PadExample,
};

export const Spring: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("control", "spring") },
      source: { code: SpringSource },
    },
  },
  render: SpringExample,
};

export const Transition: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("control", "transition") },
      source: { code: TransitionSource },
    },
  },
  render: TransitionExample,
};

export const Action: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("control", "action") },
      source: { code: ActionSource },
    },
  },
  render: ActionExample,
};

export const Section: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("control", "section") },
      source: { code: SectionSource },
    },
  },
  render: SectionExample,
};

export const Group: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("control", "group") },
      source: { code: GroupSource },
    },
  },
  render: GroupExample,
};

export const Row: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("control", "row") },
      source: { code: RowSource },
    },
  },
  render: RowExample,
};
