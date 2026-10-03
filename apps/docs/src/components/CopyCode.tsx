import { useState } from "react";
import { Button } from "@erbium/ui/components/button";
export default function CopyCode({ code }: { code: string }) {
  const [status, setStatus] = useState("Copy code");
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setStatus("Copied");
    } catch {
      setStatus("Unable to copy. Select the code below.");
    }
  }
  return (
    <Button variant="outline" size="sm" onClick={copy} aria-live="polite">
      {status}
    </Button>
  );
}
