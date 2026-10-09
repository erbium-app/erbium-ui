import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import { cva } from "class-variance-authority";
import { cn } from "../lib/utils";

const separatorVariants = cva(
  "shrink-0 data-horizontal:w-auto data-horizontal:self-stretch data-horizontal:justify-self-stretch",
  {
    variants: {
      labeled: {
        true: "flex items-center gap-related data-vertical:h-full data-vertical:flex-col",
        false: "data-horizontal:h-0.5 data-vertical:w-0.5 data-vertical:self-stretch",
      },
    },
  },
);

type SeparatorProps = SeparatorPrimitive.Props & {
  /**
   * How the rule meets its ends: `full` runs solid to the edges of the surface
   * it divides, `inset` fades out before them. Omit it to follow the container:
   * full on a surface, inset on the canvas and in padded content. Labeled
   * separators are always inset.
   */
  variant?: "full" | "inset";
};

function Separator({
  children,
  className,
  orientation = "horizontal",
  variant,
  ...props
}: SeparatorProps) {
  const labeled = children != null && children !== false && children !== "";

  return (
    <SeparatorPrimitive
      data-slot="separator"
      data-variant={labeled ? "inset" : variant}
      data-labeled={labeled ? "" : undefined}
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
