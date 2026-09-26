import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Message } from "@erbium/ui/components/message";
import Demo from "../examples/message-demo";

const meta = {
  title: "UI/Message",
  component: Message,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Displays a message in a conversation, with optional avatar, header, footer, and alignment.\n\n**Import:** `@erbium/ui/components/message`  \n\n**shadcn/ui page:** [Message](https://ui.shadcn.com/docs/components/base/message)\n\n### Usage\n\n**Note:** `Message` owns the row layout—avatar, alignment, header, and footer.\n\nRender the visible message surface inside it with\n\n[`Bubble`](https://ui.shadcn.com/docs/components/bubble). For the scroll container around a\n\nconversation, use [`MessageScroller`](https://ui.shadcn.com/docs/components/message-scroller).\n\n```tsx\nimport { Avatar, AvatarFallback, AvatarImage } from "@erbium/ui/components/avatar"\nimport { Bubble, BubbleContent } from "@erbium/ui/components/bubble"\nimport { Message, MessageAvatar, MessageContent } from "@erbium/ui/components/message"\n```\n\n```tsx\n<Message>\n  <MessageAvatar>\n    <Avatar>\n      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />\n      <AvatarFallback>CN</AvatarFallback>\n    </Avatar>\n  </MessageAvatar>\n  <MessageContent>\n    <Bubble>\n      <BubbleContent>How can I help you today?</BubbleContent>\n    </Bubble>\n  </MessageContent>\n</Message>\n```\n\n### Composition\n\nUse the following composition to build a message:\n\nUse `MessageGroup` to stack consecutive messages from the same sender:\n\n```text\nMessage\n├── MessageAvatar\n└── MessageContent\n    ├── MessageHeader\n    ├── Bubble\n    └── MessageFooter\n```\n\n```text\nMessageGroup\n├── Message\n└── Message\n```\n\n### Features\n\n- Start and end alignment for sender and receiver rows via the `align` prop\n\n- Avatar slot that anchors to the bottom of the message and stays clear of the footer\n\n- Header and footer slots for sender names, status, and message actions\n\n- Footer follows the message side; actions stay aligned on `align="end"` rows\n\n- Group wrapper for stacking consecutive messages from the same sender\n\n- Customizable styling through the `className` prop on every part\n\n### Avatar\n\nUse `MessageAvatar` to render an avatar next to the message. Set `align="end"` on the message to align the avatar to the end of the message.\n\nstyleName="base-rhea"\n\nname="message-avatar"\n\npreviewClassName="h-auto theme-blue"\n\n/>\n\n| align   | Description                                         |\n\n| ------- | --------------------------------------------------- |\n\n| `start` | Align the message to the start of the conversation. |\n\n| `end`   | Align the message to the end of the conversation.   |\n\n### Group\n\nUse `MessageGroup` to stack consecutive messages from the same sender. Render an empty `MessageAvatar` on the earlier messages to keep them aligned with the avatar on the last one.\n\nstyleName="base-rhea"\n\nname="message-group"\n\npreviewClassName="h-auto theme-blue"\n\n/>\n\n### Header and Footer\n\nUse `MessageHeader` for a sender name and `MessageFooter` for metadata such as a delivery or read status.\n\nstyleName="base-rhea"\n\nname="message-header-footer"\n\npreviewClassName="h-auto theme-blue"\n\n/>\n\n### Actions\n\nPlace message-level actions in `MessageFooter`, such as copy, retry, or feedback buttons.\n\nstyleName="base-rhea"\n\nname="message-actions"\n\npreviewClassName="h-auto theme-blue"\n\n/>\n\n### Attachment\n\nstyleName="base-rhea"\n\nname="message-attachment"\n\npreviewClassName="h-auto theme-blue"\n\n/>\n\n### Accessibility\n\n`Message` is a presentational layout wrapper. Accessibility comes from the content you place inside it.\n\nAction buttons in `MessageFooter` are usually icon-only, so give each one an `aria-label`.\n\nFor in-progress messages, use a [`Marker`](https://ui.shadcn.com/docs/components/marker) with `role="status"` so assistive tech announces the update as it appears.\n\n```tsx\n<MessageFooter>\n  <Button variant="ghost" size="icon" aria-label="Copy">\n    <CopyIcon />\n  </Button>\n</MessageFooter>\n```\n\n```tsx\n<Message>\n  <Marker role="status">\n    <MarkerIcon>\n      <Spinner />\n    </MarkerIcon>\n    <MarkerContent>Checking the logs...</MarkerContent>\n  </Marker>\n</Message>\n```',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { Message, MessageContent, MessageGroup } from "@erbium/ui/components/message";\nexport default function Demo() {\n  return (\n    <MessageGroup className="w-80">\n      <Message>\n        <MessageContent>Hello, how can I help?</MessageContent>\n      </Message>\n      <Message align="end">\n        <MessageContent>Please show me an example.</MessageContent>\n      </Message>\n    </MessageGroup>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};
