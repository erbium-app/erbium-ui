import { LogoLoader } from "@erbium/ui/components/logo-loader";
import type * as React from "react";

const Example = (args: React.ComponentProps<typeof LogoLoader>) => (
  <LogoLoader className="size-16" label="Loading" {...args} />
);

export default Example;
