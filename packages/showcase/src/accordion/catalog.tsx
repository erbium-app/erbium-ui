import FindInPageExample from "./variants/find-in-page";
import FindInPageSource from "./variants/find-in-page.tsx?raw";
import type { Meta, StoryObj } from "../types";

import { Accordion } from "@erbium/ui/components/accordion";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import BasicExample from "./variants/basic";

import BasicSource from "./variants/basic.tsx?raw";

import MultipleExample from "./variants/multiple";

import MultipleSource from "./variants/multiple.tsx?raw";

import ControlledExample from "./variants/controlled";

import ControlledSource from "./variants/controlled.tsx?raw";

import DisabledExample from "./variants/disabled";

import DisabledSource from "./variants/disabled.tsx?raw";

import BordersExample from "./variants/borders";

import BordersSource from "./variants/borders.tsx?raw";

import CardExample from "./variants/card";

import CardSource from "./variants/card.tsx?raw";

const meta = {
  component: Accordion,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("accordion"),
      },
    },
    layout: "centered",
  },
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof Accordion> = {
  argTypes: { multiple: { control: "boolean" } },
  args: { defaultValue: ["one"], multiple: false },
  parameters: {
    docs: {
      description: { story: variantDocumentation("accordion", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("accordion", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Basic: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("accordion", "basic") },
      source: { code: BasicSource },
    },
  },
  render: BasicExample,
};

export const Multiple: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("accordion", "multiple") },
      source: { code: MultipleSource },
    },
  },
  render: MultipleExample,
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("accordion", "controlled") },
      source: { code: ControlledSource },
    },
  },
  render: ControlledExample,
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("accordion", "disabled") },
      source: { code: DisabledSource },
    },
  },
  render: DisabledExample,
};

export const Borders: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("accordion", "borders") },
      source: { code: BordersSource },
    },
  },
  render: BordersExample,
};

export const Card: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("accordion", "card") },
      source: { code: CardSource },
    },
  },
  render: CardExample,
};

export const FindInPage: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("accordion", "find-in-page") },
      source: { code: FindInPageSource },
    },
  },
  render: FindInPageExample,
};
