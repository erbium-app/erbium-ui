import * as React from "react";
import { cn } from "../lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-surface-rim bg-surface-control shadow-control px-2.5 py-2 text-base transition-[color,background-color,box-shadow] duration-150 outline-none motion-reduce:transition-none placeholder:text-muted-foreground focus-visible:border-ring disabled:cursor-not-allowed disabled:shadow-edge disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[1.5px] aria-invalid:[--surface-edge:var(--destructive)] aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
