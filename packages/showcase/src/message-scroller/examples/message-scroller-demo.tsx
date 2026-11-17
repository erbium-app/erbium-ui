import { Bubble, BubbleContent } from "@erbium/ui/components/bubble";
import { Message, MessageContent } from "@erbium/ui/components/message";
import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@erbium/ui/components/message-scroller";

export default function MessageScrollerExample() {
  return (
    <MessageScrollerProvider>
      <MessageScroller className="h-40 w-80">
        <MessageScrollerViewport>
          <MessageScrollerContent>
            {Array.from({ length: 8 }, (_, i) => (
              <MessageScrollerItem key={i}>
                <Message align={i % 2 === 0 ? "end" : "start"}>
                  <MessageContent>
                    <Bubble variant={i % 2 === 0 ? "default" : "muted"}>
                      <BubbleContent>Message {i + 1}</BubbleContent>
                    </Bubble>
                  </MessageContent>
                </Message>
              </MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
      </MessageScroller>
    </MessageScrollerProvider>
  );
}
