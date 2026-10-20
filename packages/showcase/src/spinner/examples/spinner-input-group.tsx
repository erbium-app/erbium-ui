import { Icon } from "@erbium/ui/components/icon";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from "@erbium/ui/components/input-group";
import { Spinner } from "@erbium/ui/components/spinner";

const SpinnerInputGroup = () => (
  <div className="flex w-full max-w-md flex-col gap-group">
    <InputGroup>
      <InputGroupInput placeholder="Send a message..." disabled />
      <InputGroupAddon align="inline-end">
        <Spinner />
      </InputGroupAddon>
    </InputGroup>
    <InputGroup>
      <InputGroupTextarea placeholder="Send a message..." disabled />
      <InputGroupAddon align="block-end">
        <Spinner /> Validating...
        <InputGroupButton className="ml-auto" variant="default">
          <Icon name="arrow-up-01" />
          <span className="sr-only">Send</span>
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  </div>
);

export default SpinnerInputGroup;
