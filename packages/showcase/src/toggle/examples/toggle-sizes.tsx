import { Toggle } from "@erbium/ui/components/toggle";

export const ToggleSizes = () => (
  <div className="flex flex-wrap items-center gap-related">
    <Toggle variant="outline" aria-label="Toggle small" size="sm">
      Small
    </Toggle>
    <Toggle variant="outline" aria-label="Toggle default" size="default">
      Default
    </Toggle>
    <Toggle variant="outline" aria-label="Toggle large" size="lg">
      Large
    </Toggle>
  </div>
);
