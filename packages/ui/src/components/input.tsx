import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { inputClassName } from "../lib/form-control-styles";
import { cn } from "../lib/utils";

function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      data-slot="input"
      className={cn(
        inputClassName,
        // Defer the browser's autofill background while preserving field transitions.
        "autofill:caret-foreground autofill:[-webkit-text-fill-color:var(--foreground)] autofill:[transition:color_150ms,box-shadow_150ms,background-color_999999s_ease-in-out] motion-reduce:autofill:[transition:background-color_999999s_ease-in-out]",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
