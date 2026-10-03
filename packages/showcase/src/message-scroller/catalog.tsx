import type { Meta, StoryObj } from "../types";

import { MessageScroller } from "@erbium/ui/components/message-scroller";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import GroupChatExample from "./variants/group-chat";

import GroupChatSource from "./variants/group-chat.tsx?raw";

import OpeningPositionExample from "./variants/opening-position";

import OpeningPositionSource from "./variants/opening-position.tsx?raw";

import AnchoredTurnsExample from "./variants/anchored-turns";

import AnchoredTurnsSource from "./variants/anchored-turns.tsx?raw";

import PreviousTurnContextExample from "./variants/previous-turn-context";

import PreviousTurnContextSource from "./variants/previous-turn-context.tsx?raw";

import StreamingReplyExample from "./variants/streaming-reply";

import StreamingReplySource from "./variants/streaming-reply.tsx?raw";

import LoadEarlierHistoryExample from "./variants/load-earlier-history";

import LoadEarlierHistorySource from "./variants/load-earlier-history.tsx?raw";

import AnimatedReplyExample from "./variants/animated-reply";

import AnimatedReplySource from "./variants/animated-reply.tsx?raw";

import ScrollCommandsExample from "./variants/scroll-commands";

import ScrollCommandsSource from "./variants/scroll-commands.tsx?raw";

import VisibilityExample from "./variants/visibility";

import VisibilitySource from "./variants/visibility.tsx?raw";

import ScrollableExample from "./variants/scrollable";

import ScrollableSource from "./variants/scrollable.tsx?raw";

const meta = {
  component: MessageScroller,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("message-scroller"),
      },
    },
  },
} satisfies Meta<typeof MessageScroller>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  autoScroll: boolean;
  scrollPreviousItemPeek: number;
  messageCount: number;
  busy: boolean;
}> = {
  args: { autoScroll: false, scrollPreviousItemPeek: 0, messageCount: 12, busy: false },
  argTypes: {
    autoScroll: { control: "boolean" },
    scrollPreviousItemPeek: { control: { type: "number", min: 0, max: 200 } },
    messageCount: { control: { type: "number", min: 1, max: 40 } },
    busy: { control: "boolean" },
  },
  parameters: {
    docs: {
      description: { story: variantDocumentation("message-scroller", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("message-scroller", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const GroupChat: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("message-scroller", "group-chat") },
      source: { code: GroupChatSource },
    },
  },
  render: GroupChatExample,
};

export const OpeningPosition: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("message-scroller", "opening-position") },
      source: { code: OpeningPositionSource },
    },
  },
  render: OpeningPositionExample,
};

export const AnchoredTurns: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("message-scroller", "anchored-turns") },
      source: { code: AnchoredTurnsSource },
    },
  },
  render: AnchoredTurnsExample,
};

export const PreviousTurnContext: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("message-scroller", "previous-turn-context") },
      source: { code: PreviousTurnContextSource },
    },
  },
  render: PreviousTurnContextExample,
};

export const StreamingReply: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("message-scroller", "streaming-reply") },
      source: { code: StreamingReplySource },
    },
  },
  render: StreamingReplyExample,
};

export const LoadEarlierHistory: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("message-scroller", "load-earlier-history") },
      source: { code: LoadEarlierHistorySource },
    },
  },
  render: LoadEarlierHistoryExample,
};

export const AnimatedReply: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("message-scroller", "animated-reply") },
      source: { code: AnimatedReplySource },
    },
  },
  render: AnimatedReplyExample,
};

export const ScrollCommands: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("message-scroller", "scroll-commands") },
      source: { code: ScrollCommandsSource },
    },
  },
  render: ScrollCommandsExample,
};

export const Visibility: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("message-scroller", "visibility") },
      source: { code: VisibilitySource },
    },
  },
  render: VisibilityExample,
};

export const Scrollable: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("message-scroller", "scrollable") },
      source: { code: ScrollableSource },
    },
  },
  render: ScrollableExample,
};
