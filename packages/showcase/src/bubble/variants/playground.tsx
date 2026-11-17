import { BubbleContent, BubbleReactions, Bubble } from "@erbium/ui/components/bubble";

export const defaultProps = {
  align: "start",
  className: "",
  contentAs: "text",
  reactionAlign: "end",
  reactionSide: "bottom",
  variant: "default",
} satisfies {
  variant: "default" | "secondary" | "muted" | "tinted" | "outline" | "ghost" | "error";
  align: "start" | "end";
  reactionSide: "top" | "bottom";
  reactionAlign: "start" | "end";
  contentAs: "text" | "button" | "link";
  className: string;
};

export default function BubblePlaygroundExample(
  args: {
    variant: "default" | "secondary" | "muted" | "tinted" | "outline" | "ghost" | "error";
    align: "start" | "end";
    reactionSide: "top" | "bottom";
    reactionAlign: "start" | "end";
    contentAs: "text" | "button" | "link";
    className: string;
  } = defaultProps,
) {
  const contentElements = {
    text: undefined,
    button: <button type="button" aria-label="Reply" />,
    link: <a href="#overview" aria-label="View details" />,
  };

  return (
    <div className="flex w-80 flex-col">
      <Bubble variant={args.variant} align={args.align} className={args.className}>
        <BubbleContent aria-label="Choose option" render={contentElements[args.contentAs]}>
          How can I help you?
        </BubbleContent>
        <BubbleReactions side={args.reactionSide} align={args.reactionAlign}>
          <span className="sr-only">Thumbs up reaction</span>
          <span aria-hidden="true">👍</span>
        </BubbleReactions>
      </Bubble>
    </div>
  );
}
