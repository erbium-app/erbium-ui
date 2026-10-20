import { Button } from "@erbium/ui/components/button";
import { ButtonGroup } from "@erbium/ui/components/button-group";
import { Field, FieldLabel } from "@erbium/ui/components/field";
import { Input } from "@erbium/ui/components/input";

export const InputButtonGroup = () => (
  <Field>
    <FieldLabel>Search</FieldLabel>
    <ButtonGroup>
      <Input placeholder="Type to search..." />
      <Button variant="outline">Search</Button>
    </ButtonGroup>
  </Field>
);
