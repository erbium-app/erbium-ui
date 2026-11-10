import { useState } from "react";
import { Checkbox } from "@erbium/ui/components/checkbox";
import { Field, FieldGroup, FieldLabel } from "@erbium/ui/components/field";
import { PasswordInput } from "@erbium/ui/components/password-input";

const PasswordInputControlled = () => {
  const [visible, setVisible] = useState(false);

  return (
    <FieldGroup className="max-w-sm">
      <Field>
        <FieldLabel>New password</FieldLabel>
        <PasswordInput autoComplete="new-password" visible={visible} onVisibleChange={setVisible} />
      </Field>
      <Field>
        <FieldLabel>Confirm password</FieldLabel>
        <PasswordInput autoComplete="new-password" visible={visible} onVisibleChange={setVisible} />
      </Field>
      <Field orientation="horizontal">
        <Checkbox
          checked={visible}
          onCheckedChange={(checked) => {
            setVisible(checked);
          }}
        />
        <FieldLabel>Show passwords</FieldLabel>
      </Field>
    </FieldGroup>
  );
};

export default PasswordInputControlled;
