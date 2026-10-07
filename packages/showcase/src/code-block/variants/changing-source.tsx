import { useState } from "react";
import { CodeBlock } from "@erbium/ui/blocks/code-block";
import { Textarea } from "@erbium/ui/components/textarea";

export default function Example() {
  const [code, setCode] = useState('const greeting = "Hello, Erbium.";\n');
  return (
    <div className="grid w-full max-w-xl gap-4">
      <label className="grid gap-2 text-sm">
        Source
        <Textarea
          value={code}
          onChange={(event) => setCode(event.target.value)}
          className="font-mono"
        />
      </label>
      <CodeBlock code={code} language="ts" title="Live source" />
      <p className="text-xs text-muted-foreground">
        Copy, then edit the source. Feedback resets and the next copy uses the new text.
      </p>
    </div>
  );
}
