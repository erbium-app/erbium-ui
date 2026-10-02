import { Button } from "@erbium/ui/components/button";
import { Field, FieldGroup, FieldLabel } from "@erbium/ui/components/field";
import { Input } from "@erbium/ui/components/input";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@erbium/ui/components/popover";

export function PopoverForm() {
  return (
    <>
      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>Open Popover</PopoverTrigger>
        <PopoverContent className="w-64" align="start">
          <PopoverHeader>
            <PopoverTitle>Dimensions</PopoverTitle>
            <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
          </PopoverHeader>
          <FieldGroup className="gap-4">
            <Field orientation="horizontal">
              <FieldLabel className="w-1/2">Width</FieldLabel>
              <Input defaultValue="100%" />
            </Field>
            <Field orientation="horizontal">
              <FieldLabel className="w-1/2">Height</FieldLabel>
              <Input defaultValue="25px" />
            </Field>
          </FieldGroup>
        </PopoverContent>
      </Popover>
    </>
  );
}
