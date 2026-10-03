import type { Meta, StoryObj } from "../types";

import { Questionnaire } from "@erbium/ui/components/questionnaire";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import MultipleExample from "./variants/multiple";

import MultipleSource from "./variants/multiple.tsx?raw";

import FreeformExample from "./variants/freeform";

import FreeformSource from "./variants/freeform.tsx?raw";

import ShortcutsExample from "./variants/shortcuts";

import ShortcutsSource from "./variants/shortcuts.tsx?raw";

import ValidationExample from "./variants/validation";

import ValidationSource from "./variants/validation.tsx?raw";

import ControlledExample from "./variants/controlled";

import ControlledSource from "./variants/controlled.tsx?raw";

import ResumeExample from "./variants/resume";

import ResumeSource from "./variants/resume.tsx?raw";

import ConditionalExample from "./variants/conditional";

import ConditionalSource from "./variants/conditional.tsx?raw";

import ProgressExample from "./variants/progress";

import ProgressSource from "./variants/progress.tsx?raw";

import AnimatedExample from "./variants/animated";

import AnimatedSource from "./variants/animated.tsx?raw";

import CardExample from "./variants/card";

import CardSource from "./variants/card.tsx?raw";

import DialogExample from "./variants/dialog";

import DialogSource from "./variants/dialog.tsx?raw";

import SkipExample from "./variants/skip";

import SkipSource from "./variants/skip.tsx?raw";

import NavigationStateExample from "./variants/navigation-state";

import NavigationStateSource from "./variants/navigation-state.tsx?raw";

const meta = {
  component: Questionnaire,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("questionnaire"),
      },
    },
  },
} satisfies Meta<typeof Questionnaire>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  prompt: string;
  description: string;
  required: boolean;
  choices: number;
}> = {
  args: {
    prompt: "Which plan works best?",
    description: "Choose one option.",
    required: true,
    choices: 2,
  },
  argTypes: {
    prompt: { control: "text" },
    description: { control: "text" },
    required: { control: "boolean" },
    choices: { control: { type: "number", min: 1, max: 5 } },
  },
  parameters: {
    docs: {
      description: { story: variantDocumentation("questionnaire", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("questionnaire", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Multiple: Story = {
  name: "Multiple Selection",
  parameters: {
    docs: {
      description: { story: variantDocumentation("questionnaire", "multiple") },
      source: { code: MultipleSource },
    },
  },
  render: MultipleExample,
};

export const Freeform: Story = {
  name: "Freeform Answer",
  parameters: {
    docs: {
      description: { story: variantDocumentation("questionnaire", "freeform") },
      source: { code: FreeformSource },
    },
  },
  render: FreeformExample,
};

export const Shortcuts: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("questionnaire", "shortcuts") },
      source: { code: ShortcutsSource },
    },
  },
  render: ShortcutsExample,
};

export const Validation: Story = {
  name: "Custom Validation",
  parameters: {
    docs: {
      description: { story: variantDocumentation("questionnaire", "validation") },
      source: { code: ValidationSource },
    },
  },
  render: ValidationExample,
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("questionnaire", "controlled") },
      source: { code: ControlledSource },
    },
  },
  render: ControlledExample,
};

export const Resume: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("questionnaire", "resume") },
      source: { code: ResumeSource },
    },
  },
  render: ResumeExample,
};

export const Conditional: Story = {
  name: "Conditional Items",
  parameters: {
    docs: {
      description: { story: variantDocumentation("questionnaire", "conditional") },
      source: { code: ConditionalSource },
    },
  },
  render: ConditionalExample,
};

export const Progress: Story = {
  name: "Custom Progress",
  parameters: {
    docs: {
      description: { story: variantDocumentation("questionnaire", "progress") },
      source: { code: ProgressSource },
    },
  },
  render: ProgressExample,
};

export const Animated: Story = {
  name: "Animated Items",
  parameters: {
    docs: {
      description: { story: variantDocumentation("questionnaire", "animated") },
      source: { code: AnimatedSource },
    },
  },
  render: AnimatedExample,
};

export const Card: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("questionnaire", "card") },
      source: { code: CardSource },
    },
  },
  render: CardExample,
};

export const Dialog: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("questionnaire", "dialog") },
      source: { code: DialogSource },
    },
  },
  render: DialogExample,
};

export const Skip: Story = {
  name: "Explicit Skip",
  parameters: {
    docs: {
      description: { story: variantDocumentation("questionnaire", "skip") },
      source: { code: SkipSource },
    },
  },
  render: SkipExample,
};

export const NavigationState: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("questionnaire", "navigation-state") },
      source: { code: NavigationStateSource },
    },
  },
  render: NavigationStateExample,
};
