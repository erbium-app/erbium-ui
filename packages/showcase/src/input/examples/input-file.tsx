import { Input } from "@erbium/ui/components/input";
import { Field, FieldLabel } from "@erbium/ui/components/field";

export default function InputFile() {
  return (
    <Field className="grid w-full max-w-sm items-center gap-related">
      <FieldLabel>Picture</FieldLabel>
      <Input type="file" />
    </Field>
  );
}
