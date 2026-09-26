import { Field, FieldDescription, FieldLabel } from "@erbium/ui/components/field";
import { Textarea } from "@erbium/ui/components/textarea";

export function TextareaField() {
  return (
    <Field>
      <FieldLabel htmlFor="textarea-message">Message</FieldLabel>
      <FieldDescription>Enter your message below.</FieldDescription>
      <Textarea id="textarea-message" placeholder="Type your message here." />
    </Field>
  );
}
