import { Field, FieldLabel } from "@erbium/ui/components/field";
import { Icon } from "@erbium/ui/components/icon";
import { InputGroupAddon } from "@erbium/ui/components/input-group";
import {
  PasswordInputControl,
  PasswordInputRoot,
  PasswordInputToggle,
} from "@erbium/ui/components/password-input";

export default function PasswordInputCustomExample() {
  return (
    <Field className="max-w-sm">
      <FieldLabel>Vault passphrase</FieldLabel>
      <PasswordInputRoot>
        <PasswordInputControl placeholder="Enter your passphrase" />
        <InputGroupAddon>
          <Icon name="lock" />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <PasswordInputToggle aria-label="Show passphrase" />
        </InputGroupAddon>
      </PasswordInputRoot>
    </Field>
  );
}
