import { Kbd } from "@erbium/ui/components/kbd";
import type * as React from "react";

export const defaultProps = { className: "", hotkey: "Mod+K" } satisfies React.ComponentProps<
  typeof Kbd
>;

export default function KbdPlaygroundExample(
  args: React.ComponentProps<typeof Kbd> = defaultProps,
) {
  return <Kbd {...args} />;
}
