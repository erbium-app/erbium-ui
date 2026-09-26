import { MessageAvatarDemo } from "../examples/upstream/message-avatar";
import { MessageGroupDemo } from "../examples/upstream/message-group";
import { MessageHeaderFooterDemo } from "../examples/upstream/message-header-footer";
import { MessageActionsDemo } from "../examples/upstream/message-actions";
import { MessageAttachmentDemo } from "../examples/upstream/message-attachment";
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
          'Displays a message in a conversation, with optional avatar, header, footer, and alignment.\n\n**Import:** `@erbium/ui/components/message`  \n\n**shadcn/ui page:** [Message](https://ui.shadcn.com/docs/components/base/message)\n\n### Usage\n\n**Note:** `Message` owns the row layout—avatar, alignment, header, and footer.\n\nRender the visible message surface inside it with\n\n[`Bubble`](https://ui.shadcn.com/docs/components/bubble). For the scroll container around a\n\nconversation, use [`MessageScroller`](https://ui.shadcn.com/docs/components/message-scroller).\n\n```tsx\nimport { Avatar, AvatarFallback, AvatarImage } from "@erbium/ui/components/avatar"\nimport { Bubble, BubbleContent } from "@erbium/ui/components/bubble"\nimport { Message, MessageAvatar, MessageContent } from "@erbium/ui/components/message"\n```\n\n```tsx\n<Message>\n  <MessageAvatar>\n    <Avatar>\n      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />\n      <AvatarFallback>CN</AvatarFallback>\n    </Avatar>\n  </MessageAvatar>\n  <MessageContent>\n    <Bubble>\n      <BubbleContent>How can I help you today?</BubbleContent>\n    </Bubble>\n  </MessageContent>\n</Message>\n```\n\n### Composition\n\nUse the following composition to build a message:\n\nUse `MessageGroup` to stack consecutive messages from the same sender:\n\n```text\nMessage\n├── MessageAvatar\n└── MessageContent\n    ├── MessageHeader\n    ├── Bubble\n    └── MessageFooter\n```\n\n```text\nMessageGroup\n├── Message\n└── Message\n```\n\n### Features\n\n- Start and end alignment for sender and receiver rows via the `align` prop\n\n- Avatar slot that anchors to the bottom of the message and stays clear of the footer\n\n- Header and footer slots for sender names, status, and message actions\n\n- Footer follows the message side; actions stay aligned on `align="end"` rows\n\n- Group wrapper for stacking consecutive messages from the same sender\n\n- Customizable styling through the `className` prop on every part\n\n### Accessibility\n\n`Message` is a presentational layout wrapper. Accessibility comes from the content you place inside it.\n\nAction buttons in `MessageFooter` are usually icon-only, so give each one an `aria-label`.\n\nFor in-progress messages, use a [`Marker`](https://ui.shadcn.com/docs/components/marker) with `role="status"` so assistive tech announces the update as it appears.\n\n```tsx\n<MessageFooter>\n  <Button variant="ghost" size="icon" aria-label="Copy">\n    <CopyIcon />\n  </Button>\n</MessageFooter>\n```\n\n```tsx\n<Message>\n  <Marker role="status">\n    <MarkerIcon>\n      <Spinner />\n    </MarkerIcon>\n    <MarkerContent>Checking the logs...</MarkerContent>\n  </Marker>\n</Message>\n```',
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

export const Avatar: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `MessageAvatar` to render an avatar next to the message. Set `align="end"` on the message to align the avatar to the end of the message.\n\n| align   | Description                                         |\n\n| ------- | --------------------------------------------------- |\n\n| `start` | Align the message to the start of the conversation. |\n\n| `end`   | Align the message to the end of the conversation.   |',
      },
      source: {
        code: 'import { Avatar, AvatarFallback, AvatarImage } from "@erbium/ui/components/avatar";\nimport { Bubble, BubbleContent, BubbleGroup } from "@erbium/ui/components/bubble";\nimport { Message, MessageAvatar, MessageContent } from "@erbium/ui/components/message";\n\nexport function MessageAvatarDemo() {\n  return (\n    <div className="flex w-full max-w-sm flex-col gap-6 py-12">\n      <Message>\n        <MessageAvatar>\n          <Avatar>\n            <AvatarImage src="/avatars/03.png" alt="@avatar" />\n            <AvatarFallback>R</AvatarFallback>\n          </Avatar>\n        </MessageAvatar>\n        <MessageContent>\n          <Bubble variant="muted">\n            <BubbleContent>The build failed during dependency installation.</BubbleContent>\n          </Bubble>\n        </MessageContent>\n      </Message>\n      <Message align="end">\n        <MessageAvatar>\n          <Avatar>\n            <AvatarImage src="/avatars/10.png" alt="@avatar" />\n            <AvatarFallback>R</AvatarFallback>\n          </Avatar>\n        </MessageAvatar>\n        <MessageContent>\n          <Bubble>\n            <BubbleContent>Can you share the exact error?</BubbleContent>\n          </Bubble>\n        </MessageContent>\n      </Message>\n      <Message>\n        <MessageAvatar>\n          <Avatar>\n            <AvatarImage src="/avatars/03.png" alt="@avatar" />\n            <AvatarFallback>R</AvatarFallback>\n          </Avatar>\n        </MessageAvatar>\n        <MessageContent>\n          <BubbleGroup>\n            <Bubble variant="muted">\n              <BubbleContent>Here&apos;s the error from the logs</BubbleContent>\n            </Bubble>\n            <Bubble variant="muted">\n              <BubbleContent>\n                Something went wrong with the build. The libraries are not installed correctly. Try\n                running the build again.\n              </BubbleContent>\n            </Bubble>\n          </BubbleGroup>\n        </MessageContent>\n      </Message>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <MessageAvatarDemo />,
};
export const Group: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use `MessageGroup` to stack consecutive messages from the same sender. Render an empty `MessageAvatar` on the earlier messages to keep them aligned with the avatar on the last one.",
      },
      source: {
        code: 'import { Avatar, AvatarFallback, AvatarImage } from "@erbium/ui/components/avatar";\nimport { Bubble, BubbleContent } from "@erbium/ui/components/bubble";\nimport {\n  Message,\n  MessageAvatar,\n  MessageContent,\n  MessageGroup,\n} from "@erbium/ui/components/message";\n\nexport function MessageGroupDemo() {\n  return (\n    <div className="flex w-full max-w-sm flex-col gap-6 py-12">\n      <MessageGroup>\n        <Message>\n          <MessageAvatar />\n          <MessageContent>\n            <Bubble variant="muted">\n              <BubbleContent>I checked the registry addresses.</BubbleContent>\n            </Bubble>\n          </MessageContent>\n        </Message>\n        <Message>\n          <MessageAvatar>\n            <Avatar>\n              <AvatarImage src="/avatars/02.png" alt="@avatar" />\n              <AvatarFallback>CN</AvatarFallback>\n            </Avatar>\n          </MessageAvatar>\n          <MessageContent>\n            <Bubble variant="muted">\n              <BubbleContent>\n                The component and example JSON now live under the UI registry.\n              </BubbleContent>\n            </Bubble>\n          </MessageContent>\n        </Message>\n      </MessageGroup>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <MessageGroupDemo />,
};
export const HeaderFooter: Story = {
  name: "Header and Footer",
  parameters: {
    docs: {
      description: {
        story:
          "Use `MessageHeader` for a sender name and `MessageFooter` for metadata such as a delivery or read status.",
      },
      source: {
        code: 'import { Bubble, BubbleContent } from "@erbium/ui/components/bubble";\nimport {\n  Message,\n  MessageContent,\n  MessageFooter,\n  MessageHeader,\n} from "@erbium/ui/components/message";\n\nexport function MessageHeaderFooterDemo() {\n  return (\n    <div className="flex w-full max-w-sm flex-col gap-8 py-12">\n      <Message>\n        <MessageContent>\n          <MessageHeader>Olivia</MessageHeader>\n          <Bubble variant="muted">\n            <BubbleContent>I already checked the logs.</BubbleContent>\n          </Bubble>\n        </MessageContent>\n      </Message>\n      <Message align="end">\n        <MessageContent>\n          <Bubble>\n            <BubbleContent>\n              Send the report to the team. Ping @shadcn if you need help.\n            </BubbleContent>\n          </Bubble>\n          <MessageFooter>\n            <div>\n              Read <span className="font-normal">Yesterday</span>\n            </div>\n          </MessageFooter>\n        </MessageContent>\n      </Message>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <MessageHeaderFooterDemo />,
};
export const Actions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Place message-level actions in `MessageFooter`, such as copy, retry, or feedback buttons.",
      },
      source: {
        code: 'import { CopyIcon, RefreshCcwIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";\n\nimport { Bubble, BubbleContent } from "@erbium/ui/components/bubble";\nimport { Button } from "@erbium/ui/components/button";\nimport { Message, MessageContent, MessageFooter } from "@erbium/ui/components/message";\n\nexport function MessageActionsDemo() {\n  return (\n    <div className="flex w-full max-w-sm flex-col gap-8 py-12">\n      <Message>\n        <MessageContent>\n          <Bubble variant="muted">\n            <BubbleContent>The install failure is coming from the workspace package.</BubbleContent>\n          </Bubble>\n          <MessageFooter>\n            <Button variant="ghost" size="icon" aria-label="Copy" title="Copy">\n              <CopyIcon />\n            </Button>\n            <Button variant="ghost" size="icon" aria-label="Like" title="Like">\n              <ThumbsUpIcon />\n            </Button>\n            <Button variant="ghost" size="icon" aria-label="Dislike" title="Dislike">\n              <ThumbsDownIcon />\n            </Button>\n          </MessageFooter>\n        </MessageContent>\n      </Message>\n      <Message align="end">\n        <MessageContent>\n          <Bubble>\n            <BubbleContent>Okay drop me a link. Taking a look...</BubbleContent>\n          </Bubble>\n          <MessageFooter className="gap-2">\n            <span className="font-normal text-destructive">Failed to send</span>\n            <Button variant="ghost" size="icon-xs" title="Retry" aria-label="Retry">\n              <RefreshCcwIcon />\n            </Button>\n          </MessageFooter>\n        </MessageContent>\n      </Message>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <MessageActionsDemo />,
};
export const Attachment: Story = {
  parameters: {
    docs: {
      description: { story: "Display an attachment within a message." },

      source: {
        code: 'import { DownloadIcon, FileTextIcon } from "lucide-react";\n\nimport {\n  Attachment,\n  AttachmentAction,\n  AttachmentActions,\n  AttachmentContent,\n  AttachmentDescription,\n  AttachmentMedia,\n  AttachmentTitle,\n} from "@erbium/ui/components/attachment";\nimport { Bubble, BubbleContent } from "@erbium/ui/components/bubble";\nimport { Message, MessageContent } from "@erbium/ui/components/message";\n\nexport function MessageAttachmentDemo() {\n  return (\n    <div className="flex w-full max-w-sm flex-col gap-8 py-12">\n      <Message align="end">\n        <MessageContent>\n          <Attachment orientation="vertical">\n            <AttachmentMedia variant="image">\n              <img\n                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80"\n                alt="Workspace"\n              />\n            </AttachmentMedia>\n          </Attachment>\n          <Bubble>\n            <BubbleContent>\n              Here&apos;s the image. Can you add it to the PDF? Use it for the cover page.\n            </BubbleContent>\n          </Bubble>\n        </MessageContent>\n      </Message>\n      <Message>\n        <MessageContent>\n          <Bubble variant="muted">\n            <BubbleContent>\n              Done. Here&apos;s the PDF with the image added as the cover page.\n            </BubbleContent>\n          </Bubble>\n          <Attachment>\n            <AttachmentMedia>\n              <FileTextIcon />\n            </AttachmentMedia>\n            <AttachmentContent>\n              <AttachmentTitle>sales-dashboard.pdf</AttachmentTitle>\n              <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>\n            </AttachmentContent>\n            <AttachmentActions>\n              <AttachmentAction\n                type="button"\n                title="Download"\n                aria-label="Download"\n                size="icon-sm"\n                variant="secondary"\n              >\n                <DownloadIcon />\n              </AttachmentAction>\n            </AttachmentActions>\n          </Attachment>\n        </MessageContent>\n      </Message>\n      <Message align="end">\n        <MessageContent>\n          <Bubble>\n            <BubbleContent>Thanks. Looks good.</BubbleContent>\n          </Bubble>\n        </MessageContent>\n      </Message>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <MessageAttachmentDemo />,
};
