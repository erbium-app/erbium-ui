import { useState } from "react";
import { FileTree, useFileTree } from "@erbium/ui/blocks/file-tree";
import { paths } from "../examples/paths";
export default function Example() {
  const [selected, setSelected] = useState<readonly string[]>([]);
  const { model } = useFileTree({
    paths,
    initialExpansion: "open",
    onSelectionChange: setSelected,
  });
  return (
    <div className="grid w-80 gap-3">
      <FileTree model={model} aria-label="Workspace files" />
      <p className="text-caption text-muted-foreground" aria-live="polite">
        {selected.length ? selected.join(", ") : "Select a file or directory."}
      </p>
    </div>
  );
}
