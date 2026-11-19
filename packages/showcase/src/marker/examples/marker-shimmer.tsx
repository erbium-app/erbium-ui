import { Bubble, BubbleContent } from "@erbium/ui/components/bubble";
import { Icon } from "@erbium/ui/components/icon";
import { Marker, MarkerContent, MarkerIcon } from "@erbium/ui/components/marker";
import {
  Message,
  MessageContent,
  MessageGroup,
  MessageHeader,
} from "@erbium/ui/components/message";

export default function MarkerShimmerExample() {
  return (
    <figure
      aria-label="Shimmer in an agent conversation"
      className="w-full max-w-lg min-w-0 rounded-xl border bg-background p-4 sm:p-6"
    >
      <MessageGroup className="gap-6">
        <Message align="end">
          <MessageContent>
            <Bubble variant="muted">
              <BubbleContent>
                Where is the keyboard shortcut for the command menu defined?
              </BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
        <Message>
          <MessageContent>
            <MessageHeader>Agent</MessageHeader>
            <Bubble variant="ghost">
              <BubbleContent>
                I’ll check where the command menu registers its shortcut.
              </BubbleContent>
            </Bubble>
            <Marker render={<output />}>
              <MarkerIcon>
                <Icon name="search-01" />
              </MarkerIcon>
              <MarkerContent className="shimmer">Reading project files…</MarkerContent>
            </Marker>
          </MessageContent>
        </Message>
      </MessageGroup>
    </figure>
  );
}
