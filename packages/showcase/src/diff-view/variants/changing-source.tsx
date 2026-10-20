import { useState } from "react";
import { DiffView } from "@erbium/ui/blocks/diff-view";
import { Button } from "@erbium/ui/components/button";
import { oldFile, newFile } from "../examples/files";

const Example = () => {
  const [reversed, setReversed] = useState(false);

  return (
    <div className="grid w-full max-w-4xl gap-4">
      <Button
        className="w-fit"
        size="sm"
        variant="outline"
        onClick={() => {
          setReversed(!reversed);
        }}
      >
        Swap file versions
      </Button>
      <DiffView oldFile={reversed ? newFile : oldFile} newFile={reversed ? oldFile : newFile} />
    </div>
  );
};

export default Example;
