import { useState } from "react";
import { DiffView } from "@erbium/ui/blocks/diff-view";
import { ToggleGroup, ToggleGroupItem } from "@erbium/ui/components/toggle-group";
import { Toggle } from "@erbium/ui/components/toggle";
import { oldFile, newFile } from "../examples/files";

export default function DiffViewLayoutsExample() {
  const [layout, setLayout] = useState<"split" | "unified">("split");
  const [wrap, setWrap] = useState(false);

  return (
    <div className="grid w-full max-w-4xl gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <ToggleGroup
          aria-label="Diff layout"
          value={[layout]}
          onValueChange={(values) => {
            const [value] = values;

            if (value === "split" || value === "unified") {
              setLayout(value);
            }
          }}
          size="sm"
          variant="outline"
        >
          <ToggleGroupItem value="split">Split</ToggleGroupItem>
          <ToggleGroupItem value="unified">Unified</ToggleGroupItem>
        </ToggleGroup>
        <Toggle pressed={wrap} onPressedChange={setWrap} size="sm" variant="outline">
          Wrap lines
        </Toggle>
      </div>
      <DiffView
        oldFile={oldFile}
        newFile={newFile}
        options={{ diffStyle: layout, overflow: wrap ? "wrap" : "scroll" }}
      />
    </div>
  );
}
