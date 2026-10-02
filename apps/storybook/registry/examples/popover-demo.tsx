// @ts-nocheck
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Field, FieldLabel } from "../components/field";
import { Popover, PopoverContent, PopoverTrigger } from "../components/popover";

export default function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline">Open popover</Button>} />
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Dimensions</h4>
            <p className="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
          </div>
          <div className="grid gap-2">
            <Field className="grid grid-cols-3 items-center gap-4">
              <FieldLabel htmlFor="width">Width</FieldLabel>
              <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
            </Field>
            <Field className="grid grid-cols-3 items-center gap-4">
              <FieldLabel htmlFor="maxWidth">Max. width</FieldLabel>
              <Input id="maxWidth" defaultValue="300px" className="col-span-2 h-8" />
            </Field>
            <Field className="grid grid-cols-3 items-center gap-4">
              <FieldLabel htmlFor="height">Height</FieldLabel>
              <Input id="height" defaultValue="25px" className="col-span-2 h-8" />
            </Field>
            <Field className="grid grid-cols-3 items-center gap-4">
              <FieldLabel htmlFor="maxHeight">Max. height</FieldLabel>
              <Input id="maxHeight" defaultValue="none" className="col-span-2 h-8" />
            </Field>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
