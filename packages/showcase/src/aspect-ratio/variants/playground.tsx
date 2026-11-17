import { AspectRatio } from "@erbium/ui/components/aspect-ratio";
import type * as React from "react";

export const defaultProps = {
  className: "",
  ratio: 16 / 9,
} satisfies React.ComponentProps<typeof AspectRatio>;

export default function AspectRatioPlaygroundExample(
  args: React.ComponentProps<typeof AspectRatio> = defaultProps,
) {
  return (
    <AspectRatio
      {...args}
      className={`w-80 overflow-hidden rounded-md bg-muted ${args.className ?? ""}`}
    >
      <div className="flex size-full items-center justify-center">Content at {args.ratio}:1</div>
    </AspectRatio>
  );
}
