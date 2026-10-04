import StarIcon from "@hugeicons/core-free-icons/StarIcon";
import { HugeiconsIcon } from "@hugeicons/react";
import { EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@erbium/ui/components/empty";
import { Empty } from "@erbium/ui/components/empty";

const Example = (args: {
  className: string;
  mediaVariant: "default" | "icon";
  title: string;
  description: string;
}) => (
  <Empty className={`w-80 ${args.className}`}>
    <EmptyHeader>
      <EmptyMedia variant={args.mediaVariant}>
        <HugeiconsIcon icon={StarIcon} aria-hidden="true" />
      </EmptyMedia>
      <EmptyTitle>{args.title}</EmptyTitle>
      <EmptyDescription>{args.description}</EmptyDescription>
    </EmptyHeader>
  </Empty>
);

export default Example;
