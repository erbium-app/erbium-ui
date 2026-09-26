import { Button } from "@erbium/ui/components/button";
import { Field } from "@erbium/ui/components/field";
import { Input } from "@erbium/ui/components/input";

export function InputInline() {
  return (
    <Field orientation="horizontal">
      <Input type="search" placeholder="Search..." />
      <Button>Search</Button>
    </Field>
  );
}
