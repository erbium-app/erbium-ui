import { Button } from "@erbium/ui/components/button";
import { Input } from "@erbium/ui/components/input";
import { Field, FieldLabel } from "@erbium/ui/components/field";
import { Popover, PopoverContent, PopoverTrigger } from "@erbium/ui/components/popover";

const PopoverDemo = () => (
  <Popover>
    <PopoverTrigger render={<Button variant="outline">Open popover</Button>} />
    <PopoverContent className="w-80">
      <div className="grid gap-group">
        <div className="space-y-2">
          <h4 className="text-subtitle">Dimensions</h4>
          <p className="text-caption text-muted-foreground">Set the dimensions for the layer.</p>
        </div>
        <div className="grid gap-related">
          <Field className="grid grid-cols-3 items-center gap-group">
            <FieldLabel>Width</FieldLabel>
            <Input defaultValue="100%" className="col-span-2" />
          </Field>
          <Field className="grid grid-cols-3 items-center gap-group">
            <FieldLabel>Max. width</FieldLabel>
            <Input defaultValue="300px" className="col-span-2" />
          </Field>
          <Field className="grid grid-cols-3 items-center gap-group">
            <FieldLabel>Height</FieldLabel>
            <Input defaultValue="25px" className="col-span-2" />
          </Field>
          <Field className="grid grid-cols-3 items-center gap-group">
            <FieldLabel>Max. height</FieldLabel>
            <Input defaultValue="none" className="col-span-2" />
          </Field>
        </div>
      </div>
    </PopoverContent>
  </Popover>
);

export default PopoverDemo;
