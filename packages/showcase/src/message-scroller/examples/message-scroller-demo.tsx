import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@erbium/ui/components/message-scroller";

export default function Demo() {
  return (
    <MessageScrollerProvider>
      <MessageScroller className="h-40 w-80">
        <MessageScrollerViewport>
          <MessageScrollerContent>
            {Array.from({ length: 8 }, (_, i) => (
              <MessageScrollerItem key={i}>Message {i + 1}</MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
      </MessageScroller>
    </MessageScrollerProvider>
  );
}
