import { ScrollArea } from "@erbium/ui/components/scroll-area";
import type * as React from "react";

export const defaultProps = {
  fade: "vertical",
  scrollbar: "thin",
  scrollbarVisibility: "always",
} satisfies React.ComponentProps<typeof ScrollArea>;

export default function ScrollAreaPlaygroundExample(
  args: React.ComponentProps<typeof ScrollArea> = defaultProps,
) {
  return (
    <ScrollArea {...args} className="h-40 w-72 rounded-xl border surface-panel">
      <div className="space-y-2 p-4">
        {Array.from({ length: 12 }, (_, index) => (
          <p key={index}>Scrollable row {index + 1}</p>
        ))}
      </div>
    </ScrollArea>
  );
}
