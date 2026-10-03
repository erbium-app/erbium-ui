import { AspectRatio } from "@erbium/ui/components/aspect-ratio";
import type * as React from "react";

const Example = (args: React.ComponentProps<typeof AspectRatio>) => (
  <AspectRatio
    {...args}
    className={`w-80 overflow-hidden rounded-md bg-muted ${args.className ?? ""}`}
  >
    <div className="flex size-full items-center justify-center">Content at {args.ratio}:1</div>
  </AspectRatio>
);

export default Example;
