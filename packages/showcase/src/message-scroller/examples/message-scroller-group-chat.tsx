import * as React from "react";
import { Icon } from "@erbium/ui/components/icon";

import { Bubble, BubbleContent } from "@erbium/ui/components/bubble";
import { Button } from "@erbium/ui/components/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@erbium/ui/components/card";
import { Marker, MarkerContent } from "@erbium/ui/components/marker";
import { Message, MessageContent, MessageHeader } from "@erbium/ui/components/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@erbium/ui/components/message-scroller";
import { Separator } from "@erbium/ui/components/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@erbium/ui/components/tooltip";

const currentUser = "Grace";

const initialItems = [
  {
    id: "group-1",
    role: "participant",
    sender: "Grace",
    text: "@mary, the astrophage line keeps matching Venus energy output. Can you check my math?",
    type: "message",
  },
  {
    id: "group-2",
    role: "assistant",
    sender: "Mary (Agent)",
    text: "Yes. Confirmed. The curve points to a microorganism harvesting stellar energy and breeding near carbon dioxide. If @rocky agrees, this is the clue we need.",
    type: "message",
  },
  {
    id: "group-3",
    role: "participant",
    scrollAnchor: true,
    sender: "Grace",
    text: "ping @rocky",
    type: "message",
  },
] satisfies GroupChatItem[];

const rockyMarker = {
  id: "group-4",
  scrollAnchor: true,
  text: "Rocky has joined the chat",
  type: "event",
} satisfies GroupChatItem;

const rockyMessage = {
  id: "group-5",
  role: "participant",
  sender: "Rocky",
  text: "Amaze. Astrophage eats light, makes heat, goes to carbon dioxide. Rocky has fuel model. Grace is smart.",
  type: "message",
} satisfies GroupChatItem;

type GroupChatItem =
  | {
      id: string;
      type: "event";
      text: string;
      scrollAnchor?: boolean;
    }
  | {
      id: string;
      type: "message";
      sender: string;
      role: "assistant" | "participant";
      text: string;
      scrollAnchor?: boolean;
    };

const GroupChatMessage = ({ item }: { item: Extract<GroupChatItem, { type: "message" }> }) => {
  const isCurrentUser = item.sender === currentUser;
  const receivedVariant = item.role === "assistant" ? "ghost" : "tinted";
  const variant = isCurrentUser ? "muted" : receivedVariant;

  return (
    <MessageScrollerItem messageId={item.id} scrollAnchor={item.scrollAnchor}>
      <Message align={isCurrentUser ? "end" : "start"}>
        <MessageContent>
          {!isCurrentUser && <MessageHeader>{item.sender}</MessageHeader>}
          <Bubble variant={variant}>
            <BubbleContent>{item.text}</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </MessageScrollerItem>
  );
};

const GroupChatMarker = ({
  item,
  scrollAnchor = false,
}: {
  item: Extract<GroupChatItem, { type: "event" }>;
  scrollAnchor?: boolean;
}) => (
  <MessageScrollerItem scrollAnchor={scrollAnchor}>
    <Marker variant="separator">
      <MarkerContent>{item.text}</MarkerContent>
    </Marker>
  </MessageScrollerItem>
);

export default function MessageScrollerGroupChatExample() {
  const [demoKey, setDemoKey] = React.useState(0);
  const [rockyTurn, setRockyTurn] = React.useState<"idle" | "marker" | "message">("idle");

  const turns = {
    idle: initialItems,
    marker: [...initialItems, rockyMarker],
    message: [...initialItems, rockyMarker, rockyMessage],
  };

  const items = turns[rockyTurn];

  const buttonLabel = rockyTurn === "idle" ? "Add Rocky" : "Send Message as Rocky";
  const isComplete = rockyTurn === "message";

  return (
    <MessageScrollerProvider>
      <div className="relative flex flex-col gap-group">
        <Card className="mx-auto h-140 w-full max-w-sm">
          <CardHeader className="gap-1">
            <CardTitle>Group Chat</CardTitle>
            <CardDescription>
              A group chat with several participants and an assistant. The Marker is marked as a
              turn.
            </CardDescription>
            <CardAction>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label="Reset conversation"
                      disabled={rockyTurn === "idle"}
                      onClick={() => {
                        setRockyTurn("idle");
                        setDemoKey((key) => key + 1);
                      }}
                    />
                  }
                >
                  <Icon name="rotate-cw" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset</p>
                </TooltipContent>
              </Tooltip>
            </CardAction>
          </CardHeader>
          <Separator variant="full" />
          <div className="min-h-0 flex-1 overflow-hidden">
            <MessageScrollerProvider>
              <MessageScroller key={demoKey}>
                <MessageScrollerViewport>
                  <MessageScrollerContent className="p-panel">
                    {items.map((item) =>
                      item.type === "message" ? (
                        <GroupChatMessage key={item.id} item={item} />
                      ) : (
                        <GroupChatMarker
                          key={item.id}
                          item={item}
                          scrollAnchor={item.scrollAnchor}
                        />
                      ),
                    )}
                  </MessageScrollerContent>
                </MessageScrollerViewport>
                <MessageScrollerButton />
              </MessageScroller>
            </MessageScrollerProvider>
          </div>
          <CardFooter className="flex flex-col items-center gap-related">
            <Button
              type="button"
              disabled={isComplete}
              onClick={() => {
                setRockyTurn((turn) => (turn === "idle" ? "marker" : "message"));
              }}
              className="w-full"
              variant="secondary"
            >
              {buttonLabel}
            </Button>
            <p className="text-metadata text-muted-foreground">
              {rockyTurn === "idle"
                ? "This will create a marker and make it the anchor"
                : "Now send Rocky's reply into the conversation"}
            </p>
          </CardFooter>
        </Card>
        <div className="mx-auto max-w-sm px-0.5 text-center text-metadata text-balance text-muted-foreground">
          When a user joins, a marker is created. scrollAnchor on the marker marks it as the next
          turn
        </div>
      </div>
    </MessageScrollerProvider>
  );
}
