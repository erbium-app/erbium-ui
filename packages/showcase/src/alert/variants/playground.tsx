import { Alert, AlertDescription, AlertTitle } from "@erbium/ui/components/alert";
import type * as React from "react";
import { alertContent } from "../helpers";

export const defaultProps = {
  className: "",
  variant: "default",
} satisfies React.ComponentProps<typeof Alert>;

export default function AlertPlaygroundExample(
  args: React.ComponentProps<typeof Alert> = defaultProps,
) {
  const content = alertContent[args.variant ?? "default"];

  return (
    <Alert {...args} className={`w-96 ${args.className ?? ""}`}>
      <AlertTitle>{content.title}</AlertTitle>
      <AlertDescription>{content.description}</AlertDescription>
    </Alert>
  );
}
