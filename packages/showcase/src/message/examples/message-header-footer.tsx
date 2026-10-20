import { Bubble, BubbleContent } from "@erbium/ui/components/bubble";
import {
  Message,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@erbium/ui/components/message";

export const MessageHeaderFooterDemo = () => (
  <div className="flex w-full max-w-sm flex-col gap-8 py-12">
    <Message>
      <MessageContent>
        <MessageHeader>Olivia</MessageHeader>
        <Bubble variant="muted">
          <BubbleContent>I already checked the logs.</BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
    <Message align="end">
      <MessageContent>
        <Bubble>
          <BubbleContent>
            Send the report to the team. Ping @john.doe if you need help.
          </BubbleContent>
        </Bubble>
        <MessageFooter>
          <div>
            Read <span className="font-normal">Yesterday</span>
          </div>
        </MessageFooter>
      </MessageContent>
    </Message>
  </div>
);
