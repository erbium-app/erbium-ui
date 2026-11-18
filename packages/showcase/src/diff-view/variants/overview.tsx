import { DiffView } from "@erbium/ui/blocks/diff-view";
import { oldFile, newFile } from "../examples/files";

export default function DiffViewExample() {
  return <DiffView className="w-full" oldFile={oldFile} newFile={newFile} />;
}
