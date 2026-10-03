import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import Building02Icon from "@hugeicons/core-free-icons/Building02Icon";
import CreditCardIcon from "@hugeicons/core-free-icons/CreditCardIcon";
import Wallet01Icon from "@hugeicons/core-free-icons/Wallet01Icon";

import { Button } from "@erbium/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@erbium/ui/components/dropdown-menu";

export function DropdownMenuRadioIcons() {
  const [paymentMethod, setPaymentMethod] = React.useState("card");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Payment Method
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Select Payment Method</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <DropdownMenuRadioItem value="card">
              <HugeiconsIcon icon={CreditCardIcon} />
              Credit Card
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="paypal">
              <HugeiconsIcon icon={Wallet01Icon} />
              PayPal
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="bank">
              <HugeiconsIcon icon={Building02Icon} />
              Bank Transfer
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
