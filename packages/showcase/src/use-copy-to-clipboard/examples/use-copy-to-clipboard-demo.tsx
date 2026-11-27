import { useState } from "react";
import { Input } from "@erbium/ui/components/input";
import { useCopyToClipboard } from "@erbium/ui/hooks/use-copy-to-clipboard";

const feedback = {
  copied: "URL copied.",
  error: "Could not copy the URL.",
  idle: "Press Enter to copy the URL.",
};

export default function UseCopyToClipboardExample() {
  const [value, setValue] = useState("https://ui.erbium.app");
  const { copyToClipboard, reset, revision, status } = useCopyToClipboard();

  return (
    <form
      className="grid w-80 max-w-full gap-related"
      onSubmit={(event) => {
        event.preventDefault();
        void copyToClipboard(value);
      }}
    >
      <Input
        aria-label="URL"
        enterKeyHint="go"
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          reset();
        }}
      />
      <output aria-atomic="true" className="min-h-5 text-caption">
        <span key={revision}>{feedback[status]}</span>
      </output>
    </form>
  );
}
