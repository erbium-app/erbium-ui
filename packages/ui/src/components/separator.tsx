import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import { cn } from "../lib/utils";

type SeparatorProps = SeparatorPrimitive.Props & {
  fade?: boolean;
};

function Separator({
  children,
  className,
  fade = false,
  orientation = "horizontal",
  ...props
}: SeparatorProps) {
  const labeled = children != null && children !== false && children !== "";

  return (
    <SeparatorPrimitive
      data-slot="separator"
      data-labeled={labeled ? "" : undefined}
      data-fade={fade ? "" : undefined}
      orientation={orientation}
      role={labeled ? "none" : "separator"}
      className={cn(
        // Auto width includes both inline margins; 100% leaves an end gap
        // when popup wrappers bleed a separator through their padding.
        "shrink-0 data-horizontal:w-auto data-horizontal:self-stretch data-horizontal:justify-self-stretch",
        labeled
          ? "flex items-center gap-2 data-vertical:h-full data-vertical:flex-col"
          : "data-horizontal:h-0.5 data-vertical:w-0.5 data-vertical:self-stretch",
        className,
      )}
      {...props}
      data-separator=""
    >
      {children}
    </SeparatorPrimitive>
  );
}

export { Separator };
export type { SeparatorProps };
