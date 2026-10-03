import { Textarea } from "@erbium/ui/components/textarea";
import type * as React from "react";

const Example = (args: React.ComponentProps<typeof Textarea>) => (
  <Textarea {...args} className={`w-72 ${args.className ?? ""}`} />
);

export default Example;
