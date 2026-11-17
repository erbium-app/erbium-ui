import { Textarea } from "@erbium/ui/components/textarea";
import type * as React from "react";

export const defaultProps = {
  className: "",
  disabled: false,
  placeholder: "Type here",
  rows: 3,
} satisfies React.ComponentProps<typeof Textarea>;

export default function TextareaPlaygroundExample(
  args: React.ComponentProps<typeof Textarea> = defaultProps,
) {
  return <Textarea {...args} className={`w-72 ${args.className ?? ""}`} />;
}
