import * as React from "react";
import { Button } from "@erbium/ui/components/button";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
} from "@erbium/ui/components/message-scroller";

const initialMessages = Array.from({ length: 12 }, (_, index) => ({
  id: `message-${index + 1}`,
  text:
    index % 2 === 0
      ? `Question ${index / 2 + 1}: How does this work?`
      : `Answer ${Math.ceil(index / 2)}: The scroller preserves your place as messages arrive.`,
}));

const Transcript = ({ messages }: { messages: typeof initialMessages }) => (
  <MessageScroller className="h-72 w-96 rounded-lg border">
    <MessageScrollerViewport>
      <MessageScrollerContent className="gap-3 p-4">
        {messages.map((message, index) => (
          <MessageScrollerItem
            key={message.id}
            messageId={message.id}
            scrollAnchor={index % 2 === 0}
          >
            <div
              className={`max-w-72 rounded-lg p-3 text-caption ${index % 2 === 0 ? "ms-auto bg-primary text-primary-foreground" : "bg-muted"}`}
            >
              {message.text}
            </div>
          </MessageScrollerItem>
        ))}
      </MessageScrollerContent>
    </MessageScrollerViewport>
    <MessageScrollerButton />
  </MessageScroller>
);

const Commands = () => {
  const { scrollToStart, scrollToEnd, scrollToMessage } = useMessageScroller();

  return (
    <div className="flex gap-related">
      <Button
        size="sm"
        onClick={() => {
          scrollToStart();
        }}
        variant="outline"
      >
        First
      </Button>
      <Button
        size="sm"
        onClick={() => {
          scrollToMessage("message-6");
        }}
        variant="outline"
      >
        Message 6
      </Button>
      <Button
        size="sm"
        onClick={() => {
          scrollToEnd();
        }}
        variant="outline"
      >
        Latest
      </Button>
    </div>
  );
};

const Visibility = () => {
  const { currentAnchorId, visibleMessageIds } = useMessageScrollerVisibility();

  return (
    <p className="text-metadata text-muted-foreground tabular-nums">
      Current turn: {currentAnchorId ?? "none"} · Visible: {visibleMessageIds.length}
    </p>
  );
};

const Scrollable = () => {
  const { start, end } = useMessageScrollerScrollable();

  return (
    <p className="text-metadata text-muted-foreground">
      Can scroll up: {start ? "yes" : "no"} · down: {end ? "yes" : "no"}
    </p>
  );
};

export const Anchoring = () => {
  const [messages, setMessages] = React.useState(initialMessages);

  return (
    <MessageScrollerProvider>
      <div className="space-y-3">
        <Button
          size="sm"
          onClick={() => {
            setMessages((current) => [
              ...current,
              { id: `message-${current.length + 1}`, text: "A new anchored turn" },
            ]);
          }}
        >
          Add turn
        </Button>
        <Transcript messages={messages} />
      </div>
    </MessageScrollerProvider>
  );
};

export const PreviousContext = () => (
  <MessageScrollerProvider scrollPreviousItemPeek={64}>
    <Transcript messages={initialMessages} />
  </MessageScrollerProvider>
);

export const Streaming = () => {
  const reply = "The reply grows while the reader can choose whether to follow the live edge.";
  const [text, setText] = React.useState("");
  React.useEffect(() => {
    let timeout: number | undefined;

    if (text.length > 0 && text.length < reply.length) {
      timeout = window.setTimeout(() => {
        setText(reply.slice(0, text.length + 2));
      }, 80);
    }

    return () => {
      window.clearTimeout(timeout);
    };
  }, [text, reply]);
  const messages = [...initialMessages, { id: "stream", text: text || "Start a streaming reply" }];

  return (
    <MessageScrollerProvider autoScroll>
      <div className="space-y-3">
        <Button
          size="sm"
          onClick={() => {
            setText("T");
          }}
        >
          Start streaming
        </Button>
        <Transcript messages={messages} />
      </div>
    </MessageScrollerProvider>
  );
};

export const LoadHistory = () => {
  const [messages, setMessages] = React.useState(initialMessages);

  return (
    <MessageScrollerProvider>
      <div className="space-y-3">
        <Button
          size="sm"
          onClick={() => {
            setMessages((current) => [
              {
                id: `older-${current.length}`,
                text: "Earlier context loaded above the current conversation.",
              },
              ...current,
            ]);
          }}
        >
          Load earlier
        </Button>
        <Transcript messages={messages} />
      </div>
    </MessageScrollerProvider>
  );
};

export const Animation = () => {
  const [active, setActive] = React.useState(true);

  return (
    <MessageScrollerProvider>
      <div className="space-y-3">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setActive((value) => !value);
          }}
        >
          {active ? "Pause" : "Resume"} animation
        </Button>
        <div className={active ? "animate-pulse" : ""}>
          <Transcript messages={initialMessages} />
        </div>
      </div>
    </MessageScrollerProvider>
  );
};

export const CommandControls = () => (
  <MessageScrollerProvider>
    <div className="space-y-3">
      <Commands />
      <Transcript messages={initialMessages} />
    </div>
  </MessageScrollerProvider>
);

export const VisibilityState = () => (
  <MessageScrollerProvider>
    <div className="space-y-3">
      <Visibility />
      <Transcript messages={initialMessages} />
    </div>
  </MessageScrollerProvider>
);

export const ScrollableState = () => (
  <MessageScrollerProvider>
    <div className="space-y-3">
      <Scrollable />
      <Transcript messages={initialMessages} />
    </div>
  </MessageScrollerProvider>
);
