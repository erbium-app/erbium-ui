import { PasswordInput } from "@erbium/ui/components/password-input";
import type * as React from "react";

export const defaultProps = {
  autoComplete: "current-password",
  defaultVisible: false,
  disabled: false,
  placeholder: "Enter your password",
  readOnly: false,
} satisfies React.ComponentProps<typeof PasswordInput>;

export default function PasswordInputPlaygroundExample(
  args: React.ComponentProps<typeof PasswordInput> = defaultProps,
) {
  return <PasswordInput {...args} groupClassName="w-72" />;
}
