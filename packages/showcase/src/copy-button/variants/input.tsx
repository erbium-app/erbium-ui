import { useState } from "react";
import { CopyButton } from "@erbium/ui/blocks/copy-button";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "@erbium/ui/components/input-group";

const Example = () => {
  const [value, setValue] = useState("https://erbium.dev");

  return (
    <InputGroup className="w-80">
      <InputGroupInput
        aria-label="URL"
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
      />
      <InputGroupAddon align="inline-end">
        <CopyButton
          value={value}
          aria-label="Copy URL"
          render={<InputGroupButton variant="embedded" size="icon-xs" />}
        />
      </InputGroupAddon>
    </InputGroup>
  );
};

export default Example;
