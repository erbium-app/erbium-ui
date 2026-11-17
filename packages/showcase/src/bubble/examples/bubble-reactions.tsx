import { toast } from "@erbium/ui/components/toast";

import { Bubble, BubbleContent, BubbleReactions } from "@erbium/ui/components/bubble";
import { Button } from "@erbium/ui/components/button";

export default function BubbleReactionsExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-12 py-12">
      <Bubble variant="muted" align="end">
        <BubbleContent>I don&apos;t need tests, I know my code works.</BubbleContent>
        <BubbleReactions align="start">
          <span className="sr-only">Reactions: thumbs up, surprised</span>
          <span aria-hidden="true">👍</span>
          <span aria-hidden="true">😮</span>
        </BubbleReactions>
      </Bubble>
      <Bubble variant="muted">
        <BubbleContent>
          Bold. Fine I&apos;ll add some tests. I&apos;ll let you know when they&apos;re done.
        </BubbleContent>
        <BubbleReactions>
          <span className="sr-only">Reactions: eyes, rocket, and 2 more</span>
          <span aria-hidden="true">👀</span>
          <span aria-hidden="true">🚀</span>
          <span aria-hidden="true">+2</span>
        </BubbleReactions>
      </Bubble>
      <Bubble variant="default" align="end">
        <BubbleContent>Tests passed on the first try. All 142 of them. Looking good!</BubbleContent>
        <BubbleReactions side="top" align="start">
          <span className="sr-only">Reactions: party popper, clapping hands</span>
          <span aria-hidden="true">🎉</span>
          <span aria-hidden="true">👏</span>
        </BubbleReactions>
      </Bubble>
      <Bubble variant="error">
        <BubbleContent>Are you sure I can run this command?</BubbleContent>
        <BubbleReactions>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => {
              toast.add({ title: "You clicked yes, running command...", type: "success" });
            }}
          >
            Yes, run it
          </Button>
        </BubbleReactions>
      </Bubble>
    </div>
  );
}
