import { Bubble, BubbleContent } from "@erbium/ui/components/bubble";
import { Message, MessageContent } from "@erbium/ui/components/message";
import type * as React from "react";

const Example = (args: React.ComponentProps<typeof Message>) => (
  <Message {...args} className={`w-80 ${args.className ?? ""}`}>
    <MessageContent>
      <Bubble>
        <BubbleContent>Message content</BubbleContent>
      </Bubble>
    </MessageContent>
  </Message>
);

export default Example;
