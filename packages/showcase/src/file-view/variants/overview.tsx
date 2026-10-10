import { FileView } from "@erbium/ui/blocks/file-view";
import { file } from "../examples/file";
export default function Example() {
  return <FileView file={file} className="w-full max-w-4xl" />;
}
