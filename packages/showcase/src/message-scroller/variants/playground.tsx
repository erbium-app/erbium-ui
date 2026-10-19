import {
  MessageScrollerProvider,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
  MessageScroller,
} from "@erbium/ui/components/message-scroller";

const Example = (args: {
  autoScroll: boolean;
  scrollPreviousItemPeek: number;
  messageCount: number;
  busy: boolean;
}) => (
  <MessageScrollerProvider
    autoScroll={args.autoScroll}
    scrollPreviousItemPeek={args.scrollPreviousItemPeek}
  >
    <MessageScroller className="h-48 w-80">
      <MessageScrollerViewport>
        <MessageScrollerContent aria-busy={args.busy}>
          {Array.from({ length: args.messageCount }, (_, index) => (
            <MessageScrollerItem key={index} messageId={`message-${index}`}>
              Message {index + 1}
            </MessageScrollerItem>
          ))}
        </MessageScrollerContent>
      </MessageScrollerViewport>
      <MessageScrollerButton />
    </MessageScroller>
  </MessageScrollerProvider>
);

export default Example;
