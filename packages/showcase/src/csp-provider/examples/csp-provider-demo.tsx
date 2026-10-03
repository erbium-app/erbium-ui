import { CSPProvider } from "@erbium/ui/components/csp-provider";
import { ScrollArea } from "@erbium/ui/components/scroll-area";
export default function Demo() {
  return (
    <CSPProvider disableStyleElements>
      <ScrollArea className="h-40 w-72" aria-label="Scrollable example">
        {Array.from({ length: 12 }, (_, index) => (
          <p key={index} className="p-3">
            Scrollable item {index + 1}
          </p>
        ))}
      </ScrollArea>
    </CSPProvider>
  );
}
