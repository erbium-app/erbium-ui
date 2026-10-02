import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "../lib/utils";

function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border surface-field px-2.5 py-0 text-base leading-8 transition-[color,background-color,box-shadow] duration-150 outline-none motion-reduce:transition-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-error aria-invalid:ring-[1.5px] aria-invalid:ring-error/20 md:text-sm dark:aria-invalid:border-error/50 dark:aria-invalid:ring-error/40",
        // Defer the browser's autofill background while preserving field transitions.
        "autofill:caret-foreground autofill:[-webkit-text-fill-color:var(--foreground)] autofill:[transition:color_150ms,box-shadow_150ms,background-color_999999s_ease-in-out] motion-reduce:autofill:[transition:background-color_999999s_ease-in-out]",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
