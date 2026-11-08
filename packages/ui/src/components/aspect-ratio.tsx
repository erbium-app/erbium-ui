import { cn } from "../lib/utils";
import type { CSSVariableStyle } from "../lib/utils";

const AspectRatio = ({
  ratio,
  className,
  style,
  ...props
}: React.ComponentProps<"div"> & { ratio: number }) => {
  // Merged rather than replaced, so a consumer `style` keeps the ratio.
  const ratioStyle: CSSVariableStyle = { "--ratio": ratio, ...style };

  return (
    <div
      data-slot="aspect-ratio"
      className={cn("relative aspect-(--ratio)", className)}
      {...props}
      style={ratioStyle}
    />
  );
};

export { AspectRatio };
