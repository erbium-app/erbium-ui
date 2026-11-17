import { CopyButton, CopyButtonLabel } from "@erbium/ui/blocks/copy-button";
import { Button } from "@erbium/ui/components/button";
import { ButtonGroup, ButtonGroupSeparator } from "@erbium/ui/components/button-group";

export default function ButtonGroupSeparatorExample() {
  return (
    <ButtonGroup>
      <CopyButton value="Erbium UI" variant="secondary" size="sm">
        <CopyButtonLabel />
      </CopyButton>
      <ButtonGroupSeparator />
      <Button variant="secondary" size="sm">
        Paste
      </Button>
    </ButtonGroup>
  );
}
