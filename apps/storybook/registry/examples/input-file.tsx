// @ts-nocheck
import { Input } from "../components/input";
import { Field, FieldLabel } from "../components/field";

export default function InputFile() {
  return (
    <Field className="grid w-full max-w-sm items-center gap-3">
      <FieldLabel htmlFor="picture">Picture</FieldLabel>
      <Input id="picture" type="file" />
    </Field>
  );
}
