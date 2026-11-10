import { PasswordInput } from "@erbium/ui/components/password-input";
import type * as React from "react";

const Example = (args: React.ComponentProps<typeof PasswordInput>) => (
  <PasswordInput {...args} groupClassName="w-72" />
);

export default Example;
