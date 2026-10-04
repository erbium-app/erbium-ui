import { useCopyToClipboard } from "@erbium/ui/hooks/use-copy-to-clipboard";
import { CopyIcon } from "@erbium/ui/blocks/copy-button";
import { Button } from "@erbium/ui/components/button";

export default function Example() {
  const { copyToClipboard, isCopied, isPending, error } = useCopyToClipboard();
  return (
    <div>
      <Button
        variant="outline"
        size="sm"
        aria-busy={isPending}
        onClick={() => void copyToClipboard("Erbium UI")}
      >
        <CopyIcon copied={isCopied} data-icon="inline-start" />
        {isCopied ? "Copied" : "Copy project name"}
      </Button>
      <span role="status" className="sr-only" aria-atomic="true">
        {error ? "Unable to copy. Please try again." : isCopied ? "Copied to clipboard." : ""}
      </span>
    </div>
  );
}
