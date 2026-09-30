// @ts-nocheck
import { HugeiconsIcon } from "@hugeicons/react";
import CheckIcon from "@hugeicons/core-free-icons/CheckIcon";
import CreditCardIcon from "@hugeicons/core-free-icons/CreditCardIcon";
import InfoIcon from "@hugeicons/core-free-icons/InfoIcon";
import Mail01Icon from "@hugeicons/core-free-icons/Mail01Icon";
import Search01Icon from "@hugeicons/core-free-icons/Search01Icon";
import StarIcon from "@hugeicons/core-free-icons/StarIcon";

import { InputGroup, InputGroupAddon, InputGroupInput } from "../components/input-group";

export default function InputGroupIcon() {
  return (
    <div className="grid w-full max-w-sm gap-6">
      <InputGroup>
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon>
          <HugeiconsIcon icon={Search01Icon} />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput type="email" placeholder="Enter your email" />
        <InputGroupAddon>
          <HugeiconsIcon icon={Mail01Icon} />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Card number" />
        <InputGroupAddon>
          <HugeiconsIcon icon={CreditCardIcon} />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <HugeiconsIcon icon={CheckIcon} />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Card number" />
        <InputGroupAddon align="inline-end">
          <HugeiconsIcon icon={StarIcon} />
          <HugeiconsIcon icon={InfoIcon} />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
