import type { Meta, StoryObj } from "../types";

import { RelativeTime } from "@erbium/ui/components/relative-time";
import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, {
  defaultProps as PlaygroundDefaults,
  distances,
} from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/relative-time-demo.tsx?raw";

import LanguagesExample from "./variants/languages";

import LanguagesSource from "./variants/languages.tsx?raw";

import RightToLeftExample from "./variants/rtl";

import RightToLeftSource from "./variants/rtl.tsx?raw";

import FormatsExample from "./variants/formats";

import FormatsSource from "./variants/formats.tsx?raw";

import WordingExample from "./variants/wording";

import WordingSource from "./variants/wording.tsx?raw";

import DurationExample from "./variants/duration";

import DurationSource from "./variants/duration.tsx?raw";

import ThresholdExample from "./variants/threshold";

import ThresholdSource from "./variants/threshold.tsx?raw";

import StateExample from "./variants/state";

import StateSource from "./variants/state.tsx?raw";

import CardExample from "./variants/card";

import CardSource from "./variants/card.tsx?raw";

import CardZonesExample from "./variants/card-zones";

import CardZonesSource from "./variants/card-zones.tsx?raw";

const catalog = "relative-time";

const meta = {
  component: RelativeTime,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation(catalog),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RelativeTime>;

export default meta;

type Story = StoryObj;

const choice = (options: readonly string[]) => ({ control: "inline-radio" as const, options });

const select = (options: readonly string[]) => ({ control: "select" as const, options });

export const Playground: StoryObj<typeof PlaygroundExample> = {
  argTypes: {
    distance: select(Object.keys(distances)),
    format: choice(["relative", "duration"]),
    formatStyle: choice(["long", "short", "narrow"]),
    locale: select(["en", "de", "es", "fr", "ja", "zh-CN", "fa-IR", "ar", "he", "ur"]),
    maxUnits: { control: { max: 3, min: 1, step: 1, type: "number" } },
    numeric: choice(["auto", "always"]),
  },
  args: PlaygroundDefaults,
  parameters: {
    docs: {
      description: { story: variantDocumentation(catalog, "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation(catalog, "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Languages: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation(catalog, "languages") },
      source: { code: LanguagesSource },
    },
  },
  render: LanguagesExample,
};

export const RightToLeft: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation(catalog, "rtl") },
      source: { code: RightToLeftSource },
    },
  },
  render: RightToLeftExample,
};

export const Formats: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation(catalog, "formats") },
      source: { code: FormatsSource },
    },
  },
  render: FormatsExample,
};

export const Wording: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation(catalog, "wording") },
      source: { code: WordingSource },
    },
  },
  render: WordingExample,
};

export const Duration: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation(catalog, "duration") },
      source: { code: DurationSource },
    },
  },
  render: DurationExample,
};

export const Threshold: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation(catalog, "threshold") },
      source: { code: ThresholdSource },
    },
  },
  render: ThresholdExample,
};

export const State: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation(catalog, "state") },
      source: { code: StateSource },
    },
  },
  render: StateExample,
};

export const Card: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation(catalog, "card") },
      source: { code: CardSource },
    },
  },
  render: CardExample,
};

export const CardZones: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation(catalog, "card-zones") },
      source: { code: CardZonesSource },
    },
  },
  render: CardZonesExample,
};
