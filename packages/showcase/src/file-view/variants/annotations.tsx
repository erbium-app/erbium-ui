import { useState } from "react";
import { FileView } from "@erbium/ui/blocks/file-view";
import type { SelectedLineRange, LineAnnotation } from "@erbium/ui/blocks/file-view";
import { Button } from "@erbium/ui/components/button";
import { file } from "../examples/file";

const annotations: LineAnnotation<{ author: string; message: string }>[] = [
  {
    lineNumber: 2,
    metadata: { author: "Alex", message: "Keep this greeting consistent with the welcome screen." },
  },
];

export default function FileViewAnnotationsExample() {
  const [selection, setSelection] = useState<SelectedLineRange | null>(null);

  return (
    <div className="grid w-full gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-caption text-muted-foreground" aria-live="polite">
          {selection
            ? `Selected lines ${selection.start}–${selection.end}`
            : "Select or drag line numbers to highlight a range."}
        </p>
        <Button
          variant="outline"
          size="sm"
          disabled={!selection}
          onClick={() => {
            setSelection(null);
          }}
        >
          Clear selection
        </Button>
      </div>
      <FileView
        file={file}
        selectedLines={selection}
        options={{ enableLineSelection: true, onLineSelected: setSelection }}
        lineAnnotations={annotations}
        renderAnnotation={({ metadata }) => (
          <div className="m-2 grid gap-0.5 rounded-lg surface-panel px-2.5 py-2 font-sans text-foreground">
            <p className="text-control">{metadata.author}</p>
            <p className="text-caption text-muted-foreground">{metadata.message}</p>
          </div>
        )}
      />
    </div>
  );
}
