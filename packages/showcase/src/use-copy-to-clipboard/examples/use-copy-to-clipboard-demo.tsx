import { CopyButton } from "@erbium/ui/blocks/copy-button";
export default function Demo() {
  return (
    <div className="flex items-center gap-3">
      <code className="text-caption">Erbium UI</code>
      <CopyButton value="Erbium UI" aria-label="Copy project name" variant="outline" />
    </div>
  );
}
