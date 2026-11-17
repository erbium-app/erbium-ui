import { CSPProvider } from "@erbium/ui/components/csp-provider";
import { ScrollArea } from "@erbium/ui/components/scroll-area";
import type * as React from "react";

export const defaultProps = {
  disableStyleElements: true,
} satisfies React.ComponentProps<typeof CSPProvider>;

export default function CspProviderExternalStylesExample(
  args: React.ComponentProps<typeof CSPProvider> = defaultProps,
) {
  return (
    <CSPProvider {...args}>
      <ScrollArea className="h-40 w-72" aria-label="CSP provider example">
        {Array.from({ length: 12 }, (_, index) => (
          <p key={index} className="p-3">
            Scrollable item {index + 1}
          </p>
        ))}
      </ScrollArea>
    </CSPProvider>
  );
}
