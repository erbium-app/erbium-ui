import { Icon } from "@erbium/ui/components/icon";
import {
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  Empty,
} from "@erbium/ui/components/empty";

export const defaultProps = {
  className: "",
  description: "Try another search.",
  mediaVariant: "icon",
  title: "No results",
} satisfies {
  className: string;
  mediaVariant: "default" | "icon";
  title: string;
  description: string;
};

export default function EmptyPlaygroundExample(
  args: {
    className: string;
    mediaVariant: "default" | "icon";
    title: string;
    description: string;
  } = defaultProps,
) {
  return (
    <Empty className={`w-80 ${args.className}`}>
      <EmptyHeader>
        <EmptyMedia variant={args.mediaVariant}>
          <Icon name="star" aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>{args.title}</EmptyTitle>
        <EmptyDescription>{args.description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
