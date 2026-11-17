import { Button } from "@erbium/ui/components/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@erbium/ui/components/field";
import { Input } from "@erbium/ui/components/input";

export default function InputFieldgroupExample() {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel>Name</FieldLabel>
        <Input placeholder="Jordan Lee" />
      </Field>
      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input type="email" placeholder="name@example.com" />
        <FieldDescription>We&apos;ll send updates to this address.</FieldDescription>
      </Field>
      <Field orientation="horizontal">
        <Button type="reset" variant="outline">
          Reset
        </Button>
        <Button type="submit">Submit</Button>
      </Field>
    </FieldGroup>
  );
}
