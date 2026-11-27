import { useState } from "react";
import { StreamingResponse, useTextStream } from "@erbium/ui/blocks/streaming-response";
import { Bubble, BubbleContent } from "@erbium/ui/components/bubble";
import { Button } from "@erbium/ui/components/button";
import { Message, MessageContent } from "@erbium/ui/components/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@erbium/ui/components/message-scroller";
import { simulateStream } from "../../streaming";

const question = "How should I name the new endpoints?";

const reply = `Name them after the **resource**, and let the method say what happens:

| Method | Path | Does |
| :----- | :--- | :--- |
| GET | \`/projects\` | Lists projects |
| POST | \`/projects\` | Creates one |
| DELETE | \`/projects/:id\` | Removes one |

A handler then reads like the route it serves:

\`\`\`ts
router.get("/projects", async (request) => {
  const projects = await listProjects(request.query);

  return Response.json({ projects });
});
\`\`\`

Keep verbs out of paths. If an action fits no method, give it a noun of its own, such as
\`/projects/:id/exports\`.
`;

const UserMessage = ({ id, children }: { id: string; children: string }) => (
  <MessageScrollerItem messageId={id} scrollAnchor>
    <Message align="end">
      <MessageContent>
        <Bubble>
          <BubbleContent>{children}</BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  </MessageScrollerItem>
);

export default function MessageScrollerStreamingReplyExample() {
  const { error, start, status, stop, text } = useTextStream();
  const [turn, setTurn] = useState(0);
  const busy = status === "pending" || status === "streaming";

  const ask = () => {
    setTurn((current) => current + 1);
    void start((signal) => simulateStream(reply, { signal }));
  };

  return (
    <MessageScrollerProvider autoScroll>
      <div className="grid w-full max-w-md gap-related">
        <Button className="justify-self-start" size="sm" onClick={busy ? stop : ask}>
          {busy ? "Stop" : "Ask"}
        </Button>
        <MessageScroller className="h-96 rounded-lg border">
          <MessageScrollerViewport>
            <MessageScrollerContent aria-busy={busy} className="gap-4 p-4">
              <UserMessage id="greeting">Can you help me design an API?</UserMessage>
              <MessageScrollerItem messageId="offer">
                <StreamingResponse text="Of course. What would you like to decide first?" />
              </MessageScrollerItem>
              {turn === 0 ? null : (
                <>
                  <UserMessage key={`question-${turn}`} id={`question-${turn}`}>
                    {question}
                  </UserMessage>
                  <MessageScrollerItem key={`reply-${turn}`} messageId={`reply-${turn}`}>
                    <StreamingResponse text={text} status={status} error={error?.message} />
                  </MessageScrollerItem>
                </>
              )}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </div>
    </MessageScrollerProvider>
  );
}
