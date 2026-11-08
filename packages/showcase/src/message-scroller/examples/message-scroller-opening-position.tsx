import * as React from "react";

import { Bubble, BubbleContent } from "@erbium/ui/components/bubble";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@erbium/ui/components/card";
import { Message, MessageContent } from "@erbium/ui/components/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@erbium/ui/components/message-scroller";
import { Separator } from "@erbium/ui/components/separator";
import { Tabs, TabsList, TabsTrigger } from "@erbium/ui/components/tabs";

const messages = [
  {
    id: "open-1",
    role: "user",
    text: "This is the first message the user sent in the conversation.",
  },
  {
    id: "open-2",
    role: "assistant",
    text: "Workspace creation rose 8%, but first invite completion only rose 2%.",
  },
  {
    id: "open-3",
    role: "user",
    text: "This is the last message the user sent in the conversation.",
  },
  {
    id: "open-4",
    role: "assistant",
    text: "Start with the invite step. Teams are creating workspaces but waiting to add collaborators.\n\nRecommended follow-up:\n\n1. Compare invite drop-off by account size.\n2. Check whether users who skip invites still return within 24 hours.\n3. Review the empty-state copy on the first project screen.\n4. Segment activation by template, since template users may not need invites right away.\n\nIf that pattern holds, the next experiment should make collaboration useful earlier instead of prompting for invites harder.",
  },
] satisfies {
  id: string;
  role: "user" | "assistant";
  text: string;
}[];

const positions = [
  { label: "start", value: "start" },
  { label: "end", value: "end" },
  { label: "last-anchor", value: "last-anchor" },
] satisfies {
  value: "start" | "end" | "last-anchor";
  label: string;
}[];

const OpeningPositionScroller = () => (
  <MessageScroller>
    <MessageScrollerViewport>
      <MessageScrollerContent className="p-panel">
        {messages.map((message) => {
          const isUserMessage = message.role === "user";

          return (
            <MessageScrollerItem
              key={message.id}
              messageId={message.id}
              scrollAnchor={isUserMessage}
            >
              <Message align={isUserMessage ? "end" : "start"}>
                <MessageContent>
                  <Bubble variant={isUserMessage ? "muted" : "ghost"}>
                    <BubbleContent className="space-y-2">
                      {message.text
                        .split(/\n\s*\n/u)
                        .map((paragraph) => paragraph.trim())
                        .filter(Boolean)
                        .map((paragraph, index) => (
                          <p key={index} className="whitespace-pre-wrap">
                            {paragraph}
                          </p>
                        ))}
                    </BubbleContent>
                  </Bubble>
                </MessageContent>
              </Message>
            </MessageScrollerItem>
          );
        })}
      </MessageScrollerContent>
    </MessageScrollerViewport>
    <MessageScrollerButton />
  </MessageScroller>
);

export const MessageScrollerOpeningPosition = () => {
  const [position, setPosition] = React.useState<"start" | "end" | "last-anchor">("last-anchor");

  return (
    <div className="relative flex flex-col gap-group">
      <Card className="mx-auto h-140 w-full max-w-sm">
        <CardHeader className="gap-1">
          <CardTitle>Opening Position</CardTitle>
          <CardDescription>Choose where a saved transcript opens.</CardDescription>
        </CardHeader>
        <Separator variant="full" />
        <div className="min-h-0 flex-1 overflow-hidden">
          {/* Remounting applies the opening position again, as reopening the thread would. */}
          <MessageScrollerProvider key={position} defaultScrollPosition={position}>
            <OpeningPositionScroller />
          </MessageScrollerProvider>
        </div>
        <CardFooter className="flex items-center justify-center">
          <Tabs
            value={position}
            onValueChange={(value) => {
              const option = positions.find((entry) => entry.value === value);

              if (option) {
                setPosition(option.value);
              }
            }}
            className="w-full"
          >
            <TabsList className="w-full">
              {positions.map((option) => (
                <TabsTrigger key={option.value} value={option.value}>
                  {option.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardFooter>
      </Card>
      <div className="mx-auto max-w-sm px-0.5 text-center text-metadata text-muted-foreground">
        Toggle the defaultScrollPosition to see where the transcript starts when you open the thread
      </div>
    </div>
  );
};
