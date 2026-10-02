// @ts-nocheck
import { Input } from "../components/input";
import { Field, FieldLabel } from "../components/field";

export default function InputFile() {
  return (
    <Field className="grid w-full max-w-sm items-center gap-3">
      <FieldLabel>Picture</FieldLabel>
      <Input type="file" />
    </Field>
  );
}
