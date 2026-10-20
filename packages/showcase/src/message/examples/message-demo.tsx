import { Message, MessageContent, MessageGroup } from "@erbium/ui/components/message";

const Demo = () => (
  <MessageGroup className="w-80">
    <Message>
      <MessageContent>Hello, how can I help?</MessageContent>
    </Message>
    <Message align="end">
      <MessageContent>Please show me an example.</MessageContent>
    </Message>
  </MessageGroup>
);

export default Demo;
