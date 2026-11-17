import { Bubble, BubbleContent } from "@erbium/ui/components/bubble";
import { Message, MessageContent } from "@erbium/ui/components/message";
import type * as React from "react";

export const defaultProps = { align: "start", className: "" } satisfies React.ComponentProps<
  typeof Message
>;

export default function MessagePlaygroundExample(
  args: React.ComponentProps<typeof Message> = defaultProps,
) {
  return (
    <Message {...args} className={`w-80 ${args.className ?? ""}`}>
      <MessageContent>
        <Bubble>
          <BubbleContent>Message content</BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  );
}
