import { useState } from "react";
import { DiffView } from "@erbium/ui/blocks/diff-view";
import type { SelectedLineRange, DiffLineAnnotation } from "@erbium/ui/blocks/diff-view";
import { Button } from "@erbium/ui/components/button";
import { oldFile, newFile } from "../examples/files";

const annotations: DiffLineAnnotation<{ author: string; message: string }>[] = [
  {
    lineNumber: 2,
    metadata: { author: "Alex", message: "The default greeting reads well. Let's keep this." },
    side: "additions",
  },
];

const Example = () => {
  const [selection, setSelection] = useState<SelectedLineRange | null>(null);

  return (
    <div className="grid w-full max-w-4xl gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-caption text-muted-foreground" aria-live="polite">
          {selection
            ? `Selected ${selection.side ?? "additions"}: ${selection.start}–${selection.end}`
            : "Select or drag line numbers to highlight a range."}
        </p>
        <Button
          size="sm"
          variant="outline"
          disabled={!selection}
          onClick={() => {
            setSelection(null);
          }}
        >
          Clear selection
        </Button>
      </div>
      <DiffView
        oldFile={oldFile}
        newFile={newFile}
        selectedLines={selection}
        options={{ enableLineSelection: true, onLineSelected: setSelection }}
        lineAnnotations={annotations}
        renderAnnotation={({ metadata }) => (
          <div className="m-2 grid gap-0.5 rounded-lg border surface-panel px-2.5 py-2 font-sans text-foreground">
            <p className="text-control">{metadata.author}</p>
            <p className="text-caption text-muted-foreground">{metadata.message}</p>
          </div>
        )}
      />
    </div>
  );
};

export default Example;
