import { DiffView } from "@erbium/ui/blocks/diff-view";
import { oldFile, newFile } from "../examples/files";

export default function Example() {
  return <DiffView className="w-full max-w-4xl" oldFile={oldFile} newFile={newFile} />;
}
