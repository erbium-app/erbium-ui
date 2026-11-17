import { Input } from "@erbium/ui/components/input";
import type * as React from "react";

export const defaultProps = {
  className: "",
  disabled: false,
  placeholder: "Type here",
  type: "text",
} satisfies React.ComponentProps<typeof Input>;

export default function InputPlaygroundExample(
  args: React.ComponentProps<typeof Input> = defaultProps,
) {
  return <Input {...args} className={`w-72 ${args.className ?? ""}`} />;
}
