import { CopyButton } from "@erbium/ui/blocks/copy-button";

const Demo = () => (
  <div className="flex items-center gap-3">
    <code className="text-caption">Erbium UI</code>
    <CopyButton value="Erbium UI" aria-label="Copy project name" variant="outline" />
  </div>
);

export default Demo;
