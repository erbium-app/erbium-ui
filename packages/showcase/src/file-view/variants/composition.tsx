import { useState } from "react";
import {
  FileView,
  FileViewHeader,
  FileViewTitle,
  FileViewActions,
  FileViewContent,
  FileViewCopyButton,
} from "@erbium/ui/blocks/file-view";
import { Button } from "@erbium/ui/components/button";
import { file } from "../examples/file";
export default function Example() {
  const [wrap, setWrap] = useState(false);
  return (
    <FileView
      file={file}
      options={{ overflow: wrap ? "wrap" : "scroll" }}
      className="w-full max-w-4xl"
    >
      <FileViewHeader>
        <FileViewTitle />
        <FileViewActions>
          <Button variant="ghost" size="xs" aria-pressed={wrap} onClick={() => setWrap(!wrap)}>
            Wrap lines
          </Button>
          <FileViewCopyButton />
        </FileViewActions>
      </FileViewHeader>
      <FileViewContent className="max-h-80" />
    </FileView>
  );
}
