import type { Meta, StoryObj } from "../types";

import { DatePicker } from "@erbium/ui/components/date-picker";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/date-picker-demo.tsx?raw";

import BasicExample from "./variants/basic";

import BasicSource from "./variants/basic.tsx?raw";

import RangeExample from "./variants/range";

import RangeSource from "./variants/range.tsx?raw";

import TriggerExample from "./variants/trigger";

import TriggerSource from "./variants/trigger.tsx?raw";

import DateOfBirthExample from "./variants/date-of-birth";

import DateOfBirthSource from "./variants/date-of-birth.tsx?raw";

import PresetsExample from "./variants/presets";

import PresetsSource from "./variants/presets.tsx?raw";

import WithTimeExample from "./variants/with-time";

import WithTimeSource from "./variants/with-time.tsx?raw";

import LocalizedExample from "./variants/localized";

import LocalizedSource from "./variants/localized.tsx?raw";

import DisabledExample from "./variants/disabled";

import DisabledSource from "./variants/disabled.tsx?raw";

import FormExample from "./variants/form";

import FormSource from "./variants/form.tsx?raw";

const meta = {
  component: DatePicker,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("date-picker"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DatePicker>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  mode: "single" | "range";
  disabled: boolean;
  closeOnSelect: boolean;
  numberOfMonths: number;
  captionLayout: "label" | "dropdown";
}> = {
  argTypes: {
    captionLayout: { control: "select", options: ["label", "dropdown"] },
    closeOnSelect: { control: "boolean" },
    disabled: { control: "boolean" },
    mode: { control: "select", options: ["single", "range"] },
    numberOfMonths: { control: { max: 3, min: 1, type: "number" } },
  },
  args: PlaygroundDefaults,
  parameters: {
    docs: {
      description: { story: variantDocumentation("date-picker", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("date-picker", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Basic: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("date-picker", "basic") },
      source: { code: BasicSource },
    },
  },
  render: BasicExample,
};

export const Range: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("date-picker", "range") },
      source: { code: RangeSource },
    },
  },
  render: RangeExample,
};

export const Trigger: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("date-picker", "trigger") },
      source: { code: TriggerSource },
    },
  },
  render: TriggerExample,
};

export const DateOfBirth: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("date-picker", "date-of-birth") },
      source: { code: DateOfBirthSource },
    },
  },
  render: DateOfBirthExample,
};

export const Presets: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("date-picker", "presets") },
      source: { code: PresetsSource },
    },
  },
  render: PresetsExample,
};

export const WithTime: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("date-picker", "with-time") },
      source: { code: WithTimeSource },
    },
  },
  render: WithTimeExample,
};

export const Localized: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("date-picker", "localized") },
      source: { code: LocalizedSource },
    },
  },
  render: LocalizedExample,
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("date-picker", "disabled") },
      source: { code: DisabledSource },
    },
  },
  render: DisabledExample,
};

export const Form: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("date-picker", "form") },
      source: { code: FormSource },
    },
  },
  render: FormExample,
};
