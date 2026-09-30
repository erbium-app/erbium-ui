import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import { cn } from "../lib/utils";

type SeparatorProps = SeparatorPrimitive.Props & {
  fade?: boolean;
};

function Separator({
  children,
  className,
  fade = true,
  orientation = "horizontal",
  ...props
}: SeparatorProps) {
  const labeled = children != null && children !== false && children !== "";

  return (
    <SeparatorPrimitive
      data-slot="separator"
      data-labeled={labeled ? "" : undefined}
      data-fade={fade ? undefined : "none"}
      orientation={orientation}
      role={labeled ? "none" : "separator"}
      className={cn(
        "shrink-0",
        labeled
          ? "flex items-center gap-2 data-horizontal:w-full data-vertical:h-full data-vertical:flex-col"
          : "data-horizontal:h-0.5 data-horizontal:w-full data-vertical:w-0.5 data-vertical:self-stretch",
        className,
      )}
      {...props}
    >
      {children}
    </SeparatorPrimitive>
  );
}

export { Separator };
export type { SeparatorProps };
