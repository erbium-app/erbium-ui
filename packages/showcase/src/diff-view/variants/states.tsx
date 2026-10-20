import { DiffView } from "@erbium/ui/blocks/diff-view";
import { oldFile, newFile } from "../examples/files";

const Example = () => (
  <div className="grid w-full max-w-4xl gap-6">
    <div className="grid gap-2">
      <p className="text-caption text-muted-foreground">Added file</p>
      <DiffView oldFile={null} newFile={newFile} />
    </div>
    <div className="grid gap-2">
      <p className="text-caption text-muted-foreground">Deleted file</p>
      <DiffView oldFile={oldFile} newFile={null} />
    </div>
    <div className="grid gap-2">
      <p className="text-caption text-muted-foreground">Renamed file</p>
      <DiffView oldFile={oldFile} newFile={{ ...newFile, name: "welcome.ts" }} />
    </div>
    <div className="grid gap-2">
      <p className="text-caption text-muted-foreground">Unchanged file</p>
      <DiffView oldFile={oldFile} newFile={oldFile} />
    </div>
    <div className="grid gap-2">
      <p className="text-caption text-muted-foreground">Empty file</p>
      <DiffView oldFile={null} newFile={{ contents: "", name: "empty.txt" }} />
    </div>
  </div>
);

export default Example;
