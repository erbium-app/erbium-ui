import { Bubble, BubbleContent, BubbleReactions } from "@erbium/ui/components/bubble";

export default function BubbleVariantsExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-12 py-12">
      <Bubble>
        <BubbleContent>This is the default primary bubble.</BubbleContent>
      </Bubble>
      <Bubble variant="secondary" align="end">
        <BubbleContent>This is the secondary variant.</BubbleContent>
      </Bubble>
      <Bubble variant="muted">
        <BubbleContent>
          This one is muted. It uses a lower emphasis color for the chat bubble.
        </BubbleContent>
        <BubbleReactions>
          <span className="sr-only">Reaction: thumbs up</span>
          <span aria-hidden="true">👍</span>
        </BubbleReactions>
      </Bubble>
      <Bubble variant="tinted" align="end">
        <BubbleContent>
          This one is tinted. The tint is a softer color derived from the primary color.
        </BubbleContent>
      </Bubble>
      <Bubble variant="outline">
        <BubbleContent>We can also use an outlined variant.</BubbleContent>
      </Bubble>
      <Bubble variant="error" align="end">
        <BubbleContent>Or a error variant with a reaction.</BubbleContent>
        <BubbleReactions>
          <span className="sr-only">Reaction: fire</span>
          <span aria-hidden="true">🔥</span>
        </BubbleReactions>
      </Bubble>
      <Bubble variant="ghost">
        <BubbleContent>
          <p>
            Ghost bubbles can contain long assistant responses, formatted text, and code examples.
          </p>
        </BubbleContent>
      </Bubble>
    </div>
  );
}
