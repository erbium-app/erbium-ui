import { Icon } from "@erbium/ui/components/icon";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@erbium/ui/components/input-group";

const InputGroupIcon = () => (
  <div className="grid w-full max-w-sm gap-section">
    <InputGroup>
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon>
        <Icon name="search-01" />
      </InputGroupAddon>
    </InputGroup>
    <InputGroup>
      <InputGroupInput type="email" placeholder="Enter your email" />
      <InputGroupAddon>
        <Icon name="mail-01" />
      </InputGroupAddon>
    </InputGroup>
    <InputGroup>
      <InputGroupInput placeholder="Card number" />
      <InputGroupAddon>
        <Icon name="credit-card" />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <Icon name="check" />
      </InputGroupAddon>
    </InputGroup>
    <InputGroup>
      <InputGroupInput placeholder="Card number" />
      <InputGroupAddon align="inline-end">
        <Icon name="star" />
        <Icon name="info" />
      </InputGroupAddon>
    </InputGroup>
  </div>
);

export default InputGroupIcon;
