import { CopyButton, CopyButtonIcon, CopyButtonLabel } from "@erbium/ui/blocks/copy-button";
import { Button } from "@erbium/ui/components/button";
export default function Example() {
  return (
    <CopyButton value="Erbium UI" render={<Button size="sm" variant="outline" />}>
      <CopyButtonIcon data-icon="inline-start" />
      <CopyButtonLabel />
    </CopyButton>
  );
}
