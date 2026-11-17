import { DiffView } from "@erbium/ui/blocks/diff-view";
import { oldFile, newFile } from "../examples/files";

export default function DiffViewExample() {
  return <DiffView className="w-full max-w-4xl" oldFile={oldFile} newFile={newFile} />;
}
