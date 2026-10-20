import * as React from "react";
import { Icon } from "@erbium/ui/components/icon";

import { Button } from "@erbium/ui/components/button";
import { ButtonGroup } from "@erbium/ui/components/button-group";
import {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
} from "@erbium/ui/components/number-field";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@erbium/ui/components/select";

const CURRENCIES = [
  {
    label: "US Dollar",
    value: "$",
  },
  {
    label: "Euro",
    value: "€",
  },
  {
    label: "British Pound",
    value: "£",
  },
];

const ButtonGroupSelect = () => {
  const [currency, setCurrency] = React.useState("$");

  return (
    <ButtonGroup>
      <ButtonGroup>
        <Select
          value={currency}
          onValueChange={(value) => {
            setCurrency(value ?? "$");
          }}
        >
          <SelectTrigger className="font-mono">{currency}</SelectTrigger>
          <SelectContent className="min-w-24">
            {CURRENCIES.map((currency) => (
              <SelectItem key={currency.value} value={currency.value}>
                {currency.value} <span className="text-muted-foreground">{currency.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <NumberField
          className="w-36"
          format={{ maximumFractionDigits: 2, minimumFractionDigits: 2 }}
        >
          <NumberFieldGroup className="rounded-s-none">
            <NumberFieldInput aria-label="Amount" placeholder="10.00" />
          </NumberFieldGroup>
        </NumberField>
      </ButtonGroup>
      <ButtonGroup>
        <Button aria-label="Send" size="icon" variant="outline">
          <Icon name="arrow-right-01" />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  );
};

export default ButtonGroupSelect;
