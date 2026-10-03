import type { Meta, StoryObj } from "../types";

import { Message } from "@erbium/ui/components/message";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import AvatarExample from "./variants/avatar";

import AvatarSource from "./variants/avatar.tsx?raw";

import GroupExample from "./variants/group";

import GroupSource from "./variants/group.tsx?raw";

import HeaderFooterExample from "./variants/header-footer";

import HeaderFooterSource from "./variants/header-footer.tsx?raw";

import ActionsExample from "./variants/actions";

import ActionsSource from "./variants/actions.tsx?raw";

import AttachmentExample from "./variants/attachment";

import AttachmentSource from "./variants/attachment.tsx?raw";

const meta = {
  component: Message,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("message"),
      },
    },
  },
} satisfies Meta<typeof Message>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof Message> = {
  args: { align: "start", className: "" },
  argTypes: { align: { control: "select", options: ["start", "end"] } },
  parameters: {
    docs: {
      description: { story: variantDocumentation("message", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("message", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Avatar: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("message", "avatar") },
      source: { code: AvatarSource },
    },
  },
  render: AvatarExample,
};

export const Group: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("message", "group") },
      source: { code: GroupSource },
    },
  },
  render: GroupExample,
};

export const HeaderFooter: Story = {
  name: "Header and Footer",
  parameters: {
    docs: {
      description: { story: variantDocumentation("message", "header-footer") },
      source: { code: HeaderFooterSource },
    },
  },
  render: HeaderFooterExample,
};

export const Actions: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("message", "actions") },
      source: { code: ActionsSource },
    },
  },
  render: ActionsExample,
};

export const Attachment: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("message", "attachment") },
      source: { code: AttachmentSource },
    },
  },
  render: AttachmentExample,
};
