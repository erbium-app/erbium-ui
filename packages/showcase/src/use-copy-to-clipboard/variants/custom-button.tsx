import { CopyButton, CopyButtonIcon, CopyButtonLabel } from "@erbium/ui/blocks/copy-button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@erbium/ui/components/input-group";

const url = "https://erbium.dev";

export default function UseCopyToClipboardCustomButtonExample() {
  return (
    <InputGroup className="w-80">
      <InputGroupInput aria-label="Project URL" readOnly value={url} />
      <InputGroupAddon align="inline-end">
        <CopyButton
          aria-label="Copy project URL"
          render={<InputGroupButton variant="embedded" size="xs" />}
          value={url}
        >
          <CopyButtonIcon data-icon="inline-start" />
          <CopyButtonLabel />
        </CopyButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
