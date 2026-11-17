import { Spinner } from "@erbium/ui/components/spinner";
import type * as React from "react";

export const defaultProps = { size: "lg" } satisfies React.ComponentProps<typeof Spinner>;

export default function SpinnerPlaygroundExample(
  args: React.ComponentProps<typeof Spinner> = defaultProps,
) {
  return <Spinner {...args} />;
}
