// @ts-nocheck
import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import ArrowRight01Icon from "@hugeicons/core-free-icons/ArrowRight01Icon";

import { Button } from "../components/button";
import { ButtonGroup } from "../components/button-group";
import { NumberField, NumberFieldGroup, NumberFieldInput } from "../components/number-field";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../components/select";

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
        <NumberField
          className="w-36"
          format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
        >
          <NumberFieldGroup className="rounded-s-none">
            <NumberFieldInput aria-label="Amount" placeholder="10.00" />
          </NumberFieldGroup>
        </NumberField>
      </ButtonGroup>
      <ButtonGroup>
        <Button aria-label="Send" size="icon" variant="outline">
          <HugeiconsIcon icon={ArrowRight01Icon} />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  );
}
