import { Message, MessageContent } from "@erbium/ui/components/message";
import type * as React from "react";

const Example = (args: React.ComponentProps<typeof Message>) => (
  <Message {...args} className={`w-80 ${args.className ?? ""}`}>
    <MessageContent>Message content</MessageContent>
  </Message>
);

export default Example;
