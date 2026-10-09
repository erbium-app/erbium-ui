import * as React from "react";

import { RotatingChevron } from "@erbium/ui/components/stateful-icon";
import { Card } from "@erbium/ui/components/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@erbium/ui/components/collapsible";
import { Field, FieldGroup, FieldLabel } from "@erbium/ui/components/field";
import {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
} from "@erbium/ui/components/number-field";
import { Separator } from "@erbium/ui/components/separator";

export function CollapsibleSettings() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Card className="mx-auto w-full max-w-xs gap-0 p-0" size="sm">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="group group/settings flex w-full items-center gap-related rounded-xl px-3 py-2 text-start outline-none hover:bg-accent data-panel-open:rounded-b-none [&:has(+_[data-slot=collapsible-content]:not([hidden]))]:rounded-b-none focus-visible:ring-2 focus-visible:ring-focus-halo">
          <span className="min-w-0 flex-1">
            <span className="block text-caption font-medium">Radius</span>
            <span className="block text-metadata text-muted-foreground">
              Set the corner radius of the element.
            </span>
          </span>
          <RotatingChevron scope="collapsible" className="size-4 text-muted-foreground" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Separator />
          <div className="px-3 pt-2 pb-3">
            <FieldGroup className="grid w-full grid-cols-2 gap-related">
              <Field>
                <FieldLabel className="sr-only">Radius X</FieldLabel>
                <NumberField defaultValue={0} min={0}>
                  <NumberFieldGroup>
                    <NumberFieldInput aria-label="Radius X" placeholder="0" />
                  </NumberFieldGroup>
                </NumberField>
              </Field>
              <Field>
                <FieldLabel className="sr-only">Radius Y</FieldLabel>
                <NumberField defaultValue={0} min={0}>
                  <NumberFieldGroup>
                    <NumberFieldInput aria-label="Radius Y" placeholder="0" />
                  </NumberFieldGroup>
                </NumberField>
              </Field>
            </FieldGroup>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
