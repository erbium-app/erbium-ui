import { CopyButton } from "@erbium/ui/blocks/copy-button";

export default function StatefulIconExample() {
  return (
    <CopyButton
      value="Stateful icons animate between states."
      aria-label="Copy example text"
      variant="outline"
      timeout={1200}
    />
  );
}
