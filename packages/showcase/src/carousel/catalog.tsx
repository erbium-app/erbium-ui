import type { Meta, StoryObj } from "../types";

import { Carousel } from "@erbium/ui/components/carousel";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/carousel-demo.tsx?raw";

import SizesExample from "./variants/sizes";

import SizesSource from "./examples/carousel-size.tsx?raw";

import SpacingExample from "./variants/spacing";

import SpacingSource from "./examples/carousel-spacing.tsx?raw";

import OrientationExample from "./variants/orientation";

import OrientationSource from "./examples/carousel-orientation.tsx?raw";

import ApiExample from "./variants/api";

import ApiSource from "./examples/carousel-api.tsx?raw";

import AutoplayExample from "./variants/autoplay";

import AutoplaySource from "./examples/carousel-autoplay.tsx?raw";

import EventsExample from "./variants/events";

import EventsSource from "./examples/carousel-events.tsx?raw";

import LightboxExample from "./variants/lightbox";

import LightboxSource from "./examples/carousel-lightbox.tsx?raw";

const meta = {
  component: Carousel,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("carousel"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Carousel>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof Carousel> = {
  argTypes: {
    align: { control: "select", options: ["start", "center", "end"] },
    dragFree: { control: "boolean" },
    loop: { control: "boolean" },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
  args: PlaygroundDefaults,
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

export const Autoplay: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("carousel", "autoplay") },
      source: { code: AutoplaySource },
    },
  },
  render: AutoplayExample,
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

export const Lightbox: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("carousel", "lightbox") },
      source: { code: LightboxSource },
    },
  },
  render: LightboxExample,
};
