import { Alert, AlertDescription, AlertTitle } from "@erbium/ui/components/alert";
import type * as React from "react";
import { alertContent } from "../helpers";

const Example = (args: React.ComponentProps<typeof Alert>) => {
  const content = alertContent[args.variant ?? "default"];

  return (
    <Alert {...args} className={`w-96 ${args.className ?? ""}`}>
      <AlertTitle>{content.title}</AlertTitle>
      <AlertDescription>{content.description}</AlertDescription>
    </Alert>
  );
};

export default Example;
