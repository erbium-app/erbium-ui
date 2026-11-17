import {
  MessageScrollerProvider,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
  MessageScroller,
} from "@erbium/ui/components/message-scroller";

export const defaultProps = {
  autoScroll: false,
  busy: false,
  messageCount: 12,
  scrollPreviousItemPeek: 0,
} satisfies {
  autoScroll: boolean;
  scrollPreviousItemPeek: number;
  messageCount: number;
  busy: boolean;
};

export default function MessageScrollerPlaygroundExample(
  args: {
    autoScroll: boolean;
    scrollPreviousItemPeek: number;
    messageCount: number;
    busy: boolean;
  } = defaultProps,
) {
  return (
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
}
