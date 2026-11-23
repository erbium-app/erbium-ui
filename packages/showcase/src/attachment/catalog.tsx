import type { Meta, StoryObj } from "../types";

import { Attachment } from "@erbium/ui/components/attachment";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";
import type { PlaygroundArgs } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/attachment-demo.tsx?raw";

import ImageExample from "./variants/image";

import ImageSource from "./examples/attachment-image.tsx?raw";

import StatesExample from "./variants/states";

import StatesSource from "./examples/attachment-states.tsx?raw";

import SizesExample from "./variants/sizes";

import SizesSource from "./examples/attachment-sizes.tsx?raw";

import GroupExample from "./variants/group";

import GroupSource from "./examples/attachment-group.tsx?raw";

import TriggerExample from "./variants/trigger";

import TriggerSource from "./examples/attachment-trigger.tsx?raw";

const meta = {
  component: Attachment,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("attachment"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Attachment>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<PlaygroundArgs> = {
  argTypes: {
    className: { control: "text" },
    mediaVariant: { control: "select", options: ["icon", "image"] },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    size: { control: "select", options: ["default", "sm", "xs"] },
    state: { control: "select", options: ["idle", "uploading", "processing", "error", "done"] },
    title: { control: "text" },
    triggerAsLink: { control: "boolean" },
  },
  args: PlaygroundDefaults,
  parameters: {
    docs: {
      description: { story: variantDocumentation("attachment", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("attachment", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Image: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("attachment", "image") },
      source: { code: ImageSource },
    },
  },
  render: ImageExample,
};

export const States: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("attachment", "states") },
      source: { code: StatesSource },
    },
  },
  render: StatesExample,
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("attachment", "sizes") },
      source: { code: SizesSource },
    },
  },
  render: SizesExample,
};

export const Group: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("attachment", "group") },
      source: { code: GroupSource },
    },
  },
  render: GroupExample,
};

export const Trigger: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("attachment", "trigger") },
      source: { code: TriggerSource },
    },
  },
  render: TriggerExample,
};
