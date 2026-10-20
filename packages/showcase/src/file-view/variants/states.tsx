import { useState } from "react";
import { FileView } from "@erbium/ui/blocks/file-view";
import { Button } from "@erbium/ui/components/button";
import { file } from "../examples/file";

const Example = () => {
  const [empty, setEmpty] = useState(false);

  return (
    <div className="grid w-full max-w-4xl gap-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setEmpty(!empty);
        }}
      >
        Toggle empty source
      </Button>
      <FileView file={{ ...file, contents: empty ? "" : file.contents }} />
      <FileView
        file={{ contents: "Plaintext remains readable and copyable.", name: "notes.txt" }}
      />
    </div>
  );
};

export default Example;
