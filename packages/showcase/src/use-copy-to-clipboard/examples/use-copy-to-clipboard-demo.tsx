import { useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@erbium/ui/components/input-group";
import { StatefulIcon } from "@erbium/ui/components/stateful-icon";
import { Icon } from "@erbium/ui/components/icon";
import { useCopyToClipboard } from "@erbium/ui/hooks/use-copy-to-clipboard";

export default function UseCopyToClipboardExample() {
  const [value, setValue] = useState("https://erbium.dev");
  const { copyToClipboard, isPending, reset, revision, status } = useCopyToClipboard();
  const feedback = { copied: "URL copied.", error: "Could not copy the URL.", idle: "" };

  return (
    <div className="grid w-80 max-w-full gap-related">
      <InputGroup>
        <InputGroupInput
          aria-label="URL"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            reset();
          }}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            aria-label="Copy URL"
            focusableWhenDisabled
            aria-busy={isPending}
            disabled={isPending}
            onClick={() => {
              void copyToClipboard(value);
            }}
            size="icon-xs"
            variant="embedded"
          >
            <StatefulIcon
              state={status}
              icons={{
                copied: <Icon name="check" />,
                error: <Icon name="cancel-01" />,
                idle: <Icon name="copy" />,
              }}
            />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <output aria-atomic="true" className="min-h-5 text-caption">
        <span key={revision}>{feedback[status]}</span>
      </output>
    </div>
  );
}
