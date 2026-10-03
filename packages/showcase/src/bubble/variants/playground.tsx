import { BubbleContent, BubbleReactions } from "@erbium/ui/components/bubble";
import { Bubble } from "@erbium/ui/components/bubble";

const Example = (args: {
  variant: "default" | "secondary" | "muted" | "tinted" | "outline" | "ghost" | "error";
  align: "start" | "end";
  reactionSide: "top" | "bottom";
  reactionAlign: "start" | "end";
  contentAs: "text" | "button" | "link";
  className: string;
}) => (
  <div className="flex w-80 flex-col">
    <Bubble variant={args.variant} align={args.align} className={args.className}>
      <BubbleContent
        render={
          args.contentAs === "button" ? (
            <button type="button" />
          ) : args.contentAs === "link" ? (
            <a href="#" />
          ) : undefined
        }
      >
        How can I help you?
      </BubbleContent>
      <BubbleReactions
        side={args.reactionSide}
        align={args.reactionAlign}
        role="img"
        aria-label="Thumbs up reaction"
      >
        👍
      </BubbleReactions>
    </Bubble>
  </div>
);

export default Example;
