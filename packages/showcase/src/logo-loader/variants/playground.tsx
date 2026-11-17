import { LogoLoader } from "@erbium/ui/components/logo-loader";
import type * as React from "react";

export const defaultProps = { delay: 0, loading: true } satisfies React.ComponentProps<
  typeof LogoLoader
>;

export default function LogoLoaderPlaygroundExample(
  args: React.ComponentProps<typeof LogoLoader> = defaultProps,
) {
  return <LogoLoader className="size-16" label="Loading" {...args} />;
}
