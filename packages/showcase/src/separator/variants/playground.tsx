import { Separator } from "@erbium/ui/components/separator";
import type * as React from "react";

const Example = (args: React.ComponentProps<typeof Separator>) => (
  <div className="flex h-28 w-72 flex-col items-center justify-center">
    <Separator
      {...args}
      className={
        args.orientation === "vertical"
          ? `h-full ${typeof args.className === "string" ? args.className : ""}`
          : `w-full ${typeof args.className === "string" ? args.className : ""}`
      }
    />
  </div>
);

export default Example;
