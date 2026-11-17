import { Bubble, BubbleContent } from "@erbium/ui/components/bubble";
import { Message, MessageContent, MessageGroup } from "@erbium/ui/components/message";

export default function MessageExample() {
  return (
    <MessageGroup className="w-80">
      <Message>
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>Hello, how can I help?</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageContent>
          <Bubble>
            <BubbleContent>Please show me an example.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </MessageGroup>
  );
}
