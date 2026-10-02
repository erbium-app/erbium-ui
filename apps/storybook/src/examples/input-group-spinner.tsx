import { HugeiconsIcon } from "@hugeicons/react";
import LoaderIcon from "@hugeicons/core-free-icons/LoaderIcon";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@erbium/ui/components/input-group";
import { Spinner } from "@erbium/ui/components/spinner";

export default function InputGroupSpinner() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <InputGroup>
        <InputGroupInput placeholder="Searching..." disabled />
        <InputGroupAddon align="inline-end">
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Processing..." disabled />
        <InputGroupAddon>
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Saving changes..." disabled />
        <InputGroupAddon align="inline-end">
          <InputGroupText>Saving...</InputGroupText>
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Refreshing data..." disabled />
        <InputGroupAddon>
          <HugeiconsIcon icon={LoaderIcon} className="animate-spin" />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupText className="text-muted-foreground">Please wait...</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
