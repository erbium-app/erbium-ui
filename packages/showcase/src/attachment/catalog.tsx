import type { Meta, StoryObj } from "../types";

import { Attachment } from "@erbium/ui/components/attachment";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import ImageExample from "./variants/image";

import ImageSource from "./variants/image.tsx?raw";

import StatesExample from "./variants/states";

import StatesSource from "./variants/states.tsx?raw";

import SizesExample from "./variants/sizes";

import SizesSource from "./variants/sizes.tsx?raw";

import GroupExample from "./variants/group";

import GroupSource from "./variants/group.tsx?raw";

import TriggerExample from "./variants/trigger";

import TriggerSource from "./variants/trigger.tsx?raw";

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

export const Playground: StoryObj<{
  state: "idle" | "uploading" | "processing" | "error" | "done";
  size: "default" | "sm" | "xs";
  orientation: "horizontal" | "vertical";
  mediaVariant: "icon" | "image";
  className: string;
  title: string;
  actionSize: "icon-xs" | "icon-sm" | "icon";
  triggerAsLink: boolean;
}> = {
  argTypes: {
    actionSize: { control: "select", options: ["icon-xs", "icon-sm", "icon"] },
    className: { control: "text" },
    mediaVariant: { control: "select", options: ["icon", "image"] },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    size: { control: "select", options: ["default", "sm", "xs"] },
    state: { control: "select", options: ["idle", "uploading", "processing", "error", "done"] },
    title: { control: "text" },
    triggerAsLink: { control: "boolean" },
  },
  args: {
    actionSize: "icon-xs",
    className: "",
    mediaVariant: "icon",
    orientation: "horizontal",
    size: "default",
    state: "done",
    title: "document.pdf",
    triggerAsLink: false,
  },
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
