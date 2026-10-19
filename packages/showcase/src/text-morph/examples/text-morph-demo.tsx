import { useState } from "react";
import { TextMorph } from "@erbium/ui/components/text-morph";
import { Button } from "@erbium/ui/components/button";

export default function Demo() {
  const [count, setCount] = useState(10);

  return (
    <div className="flex items-center gap-group">
      <TextMorph aria-live="polite">{count}</TextMorph>
      <Button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Increment
      </Button>
    </div>
  );
}
