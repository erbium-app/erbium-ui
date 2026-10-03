import { useCopyToClipboard } from "@erbium/ui/hooks/use-copy-to-clipboard";
import { Button } from "@erbium/ui/components/button";
export default function Demo() {
  const { copyToClipboard, isCopied } = useCopyToClipboard();
  return (
    <Button onClick={() => copyToClipboard("Erbium UI")}>
      {isCopied ? "Copied" : "Copy Erbium UI"}
    </Button>
  );
}
