import type { Meta, StoryObj } from "../types";

import { Carousel } from "@erbium/ui/components/carousel";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import SizesExample from "./variants/sizes";

import SizesSource from "./variants/sizes.tsx?raw";

import SpacingExample from "./variants/spacing";

import SpacingSource from "./variants/spacing.tsx?raw";

import OrientationExample from "./variants/orientation";

import OrientationSource from "./variants/orientation.tsx?raw";

import ApiExample from "./variants/api";

import ApiSource from "./variants/api.tsx?raw";

import PluginExample from "./variants/plugin";

import PluginSource from "./variants/plugin.tsx?raw";

import EventsExample from "./variants/events";

import EventsSource from "./variants/events.tsx?raw";

const meta = {
  component: Carousel,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("carousel"),
      },
    },
  },
} satisfies Meta<typeof Carousel>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof Carousel> = {
  args: { orientation: "horizontal" },
  argTypes: { orientation: { control: "select", options: ["horizontal", "vertical"] } },
  parameters: {
    docs: {
      description: { story: variantDocumentation("carousel", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("carousel", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("carousel", "sizes") },
      source: { code: SizesSource },
    },
  },
  render: SizesExample,
};

export const Spacing: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("carousel", "spacing") },
      source: { code: SpacingSource },
    },
  },
  render: SpacingExample,
};

export const Orientation: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("carousel", "orientation") },
      source: { code: OrientationSource },
    },
  },
  render: OrientationExample,
};

export const Api: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("carousel", "api") },
      source: { code: ApiSource },
    },
  },
  render: ApiExample,
};

export const Plugin: Story = {
  name: "Plugins",
  parameters: {
    docs: {
      description: { story: variantDocumentation("carousel", "plugin") },
      source: { code: PluginSource },
    },
  },
  render: PluginExample,
};

export const Events: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("carousel", "events") },
      source: { code: EventsSource },
    },
  },
  render: EventsExample,
};
