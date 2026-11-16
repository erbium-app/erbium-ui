import { useState } from "react";
import { DiffView } from "@erbium/ui/blocks/diff-view";
import type { DiffViewOptions } from "@erbium/ui/blocks/diff-view";
import { ToggleGroup, ToggleGroupItem } from "@erbium/ui/components/toggle-group";
import { oldFile, newFile } from "../examples/files";

const Example = () => {
  const [highlight, setHighlight] = useState<DiffViewOptions["lineDiffType"]>("word-alt");

  return (
    <div className="grid w-full max-w-4xl gap-4">
      <ToggleGroup
        aria-label="Inline change highlighting"
        value={[highlight ?? "word-alt"]}
        onValueChange={(values) => {
          const [value] = values;

          if (value === "word-alt" || value === "char" || value === "none") {
            setHighlight(value);
          }
        }}
        size="sm"
        variant="outline"
      >
        <ToggleGroupItem value="word-alt">Words</ToggleGroupItem>
        <ToggleGroupItem value="char">Characters</ToggleGroupItem>
        <ToggleGroupItem value="none">Lines only</ToggleGroupItem>
      </ToggleGroup>
      <DiffView oldFile={oldFile} newFile={newFile} options={{ lineDiffType: highlight }} />
      <DiffView
        oldFile={oldFile}
        newFile={newFile}
        options={{ diffIndicators: "bars", diffStyle: "unified", disableLineNumbers: true }}
      />
    </div>
  );
};

export default Example;
