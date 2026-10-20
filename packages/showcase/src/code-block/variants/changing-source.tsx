import { useState } from "react";
import { CodeBlock } from "@erbium/ui/blocks/code-block";
import { Textarea } from "@erbium/ui/components/textarea";

const Example = () => {
  const [code, setCode] = useState('const greeting = "Hello, Erbium.";\n');

  return (
    <div className="grid w-full max-w-xl gap-group">
      <label className="grid gap-related text-caption">
        Source
        <Textarea
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
          }}
          className="font-mono"
        />
      </label>
      <CodeBlock code={code} language="ts" title="Live source" />
      <p className="text-metadata text-muted-foreground">
        Copy, then edit the source. Feedback resets and the next copy uses the new text.
      </p>
    </div>
  );
};

export default Example;
