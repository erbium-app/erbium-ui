import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import { cva } from "class-variance-authority";
import { cn } from "../lib/utils";

const separatorVariants = cva(
  "shrink-0 data-horizontal:w-auto data-horizontal:self-stretch data-horizontal:justify-self-stretch",
  {
    variants: {
      labeled: {
        true: "flex items-center gap-2 data-vertical:h-full data-vertical:flex-col",
        false: "data-horizontal:h-0.5 data-vertical:w-0.5 data-vertical:self-stretch",
      },
    },
  },
);

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
      className={cn(separatorVariants({ labeled, className }))}
      {...props}
      data-separator=""
    >
      {children}
    </SeparatorPrimitive>
  );
}

export { Separator };
export type { SeparatorProps };
