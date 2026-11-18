import { FileView } from "@erbium/ui/blocks/file-view";
import { file } from "../examples/file";

export default function FileViewExample() {
  return <FileView file={file} className="w-full" />;
}
