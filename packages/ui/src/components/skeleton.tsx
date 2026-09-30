import * as React from "react";

import { cn } from "../lib/utils";

// Aligns the sweep with the document timeline so skeletons that mount at
// different times share one phase instead of running staggered bands.
function syncToDocumentTimeline(node: HTMLElement) {
  if (typeof node.getAnimations !== "function") {
    return;
  }
  for (const animation of node.getAnimations()) {
    animation.startTime = 0;
  }
}

function Skeleton({ className, ref, ...props }: React.ComponentProps<"div">) {
  const setRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        syncToDocumentTimeline(node);
      }
      if (typeof ref === "function") {
        return ref(node);
      }
      if (ref) {
        ref.current = node;
      }
    },
    [ref],
  );

  return (
    <div
      aria-hidden
      data-slot="skeleton"
      ref={setRef}
      className={cn("skeleton rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
