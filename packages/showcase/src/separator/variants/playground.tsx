import { Separator } from "@erbium/ui/components/separator";
import type * as React from "react";

export const defaultProps = {
  className: "",
  orientation: "horizontal",
} satisfies Omit<React.ComponentProps<typeof Separator>, "className"> & { className?: string };

export default function SeparatorPlaygroundExample(
  args: Omit<React.ComponentProps<typeof Separator>, "className"> & {
    className?: string;
  } = defaultProps,
) {
  return (
    <div className="flex h-28 w-72 flex-col items-center justify-center">
      <Separator
        {...args}
        className={
          args.orientation === "vertical"
            ? `h-full ${args.className ?? ""}`
            : `w-full ${args.className ?? ""}`
        }
      />
    </div>
  );
}
