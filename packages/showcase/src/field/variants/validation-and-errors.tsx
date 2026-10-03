import { Field, FieldError, FieldLabel } from "@erbium/ui/components/field";
import { Input as UIInput } from "@erbium/ui/components/input";

const Example = () => (
  <Field className="w-80" invalid>
    <FieldLabel>Email</FieldLabel>
    <UIInput placeholder="name@example.com" type="email" />
    <FieldError match>Enter a valid email address.</FieldError>
  </Field>
);

export default Example;
