import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import ArrowRight01Icon from "@hugeicons/core-free-icons/ArrowRight01Icon";

import { Button } from "@erbium/ui/components/button";
import { ButtonGroup } from "@erbium/ui/components/button-group";
import { Input } from "@erbium/ui/components/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@erbium/ui/components/select";

const CURRENCIES = [
  {
    value: "$",
    label: "US Dollar",
  },
  {
    value: "€",
    label: "Euro",
  },
  {
    value: "£",
    label: "British Pound",
  },
];

export default function ButtonGroupSelect() {
  const [currency, setCurrency] = React.useState("$");

  return (
    <ButtonGroup>
      <ButtonGroup>
        <Select value={currency} onValueChange={(value) => setCurrency(value ?? "$")}>
          <SelectTrigger className="font-mono">{currency}</SelectTrigger>
          <SelectContent className="min-w-24">
            {CURRENCIES.map((currency) => (
              <SelectItem key={currency.value} value={currency.value}>
                {currency.value} <span className="text-muted-foreground">{currency.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input placeholder="10.00" pattern="[0-9]*" />
      </ButtonGroup>
      <ButtonGroup>
        <Button aria-label="Send" size="icon" variant="outline">
          <HugeiconsIcon icon={ArrowRight01Icon} />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  );
}
