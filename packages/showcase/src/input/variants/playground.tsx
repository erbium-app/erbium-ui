import { Input } from "@erbium/ui/components/input";
import type * as React from "react";

const Example = (args: React.ComponentProps<typeof Input>) => (
  <Input {...args} className={`w-72 ${args.className ?? ""}`} />
);

export default Example;
