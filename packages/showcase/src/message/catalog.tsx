import type { Meta, StoryObj } from "../types";

import { Message } from "@erbium/ui/components/message";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/message-demo.tsx?raw";

import AvatarExample from "./variants/avatar";

import AvatarSource from "./examples/message-avatar.tsx?raw";

import GroupExample from "./variants/group";

import GroupSource from "./examples/message-group.tsx?raw";

import HeaderFooterExample from "./variants/header-footer";

import HeaderFooterSource from "./examples/message-header-footer.tsx?raw";

import ActionsExample from "./variants/actions";

import ActionsSource from "./examples/message-actions.tsx?raw";

import AttachmentExample from "./variants/attachment";

import AttachmentSource from "./examples/message-attachment.tsx?raw";

const meta = {
  component: Message,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("message"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Message>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof Message> = {
  argTypes: { align: { control: "select", options: ["start", "end"] } },
  args: PlaygroundDefaults,
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
