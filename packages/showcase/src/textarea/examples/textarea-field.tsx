import { Field, FieldDescription, FieldLabel } from "@erbium/ui/components/field";
import { Textarea } from "@erbium/ui/components/textarea";

export function TextareaField() {
  return (
    <Field>
      <FieldLabel>Message</FieldLabel>
      <FieldDescription>Enter your message below.</FieldDescription>
      <Textarea placeholder="Type your message here." />
    </Field>
  );
}
