import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import CheckIcon from "@hugeicons/core-free-icons/CheckIcon";
import MinusIcon from "@hugeicons/core-free-icons/MinusIcon";
import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "../lib/utils";

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-4 shrink-0 items-center justify-center rounded-lg border border-input transition-[color,background-color,border-color,box-shadow,scale] duration-150 ease-out outline-none group-has-disabled/field:opacity-50 group-has-focus-visible/field-label:not-aria-invalid:ring-0 group-has-focus-visible/field-label:not-data-checked:not-aria-invalid:border-input after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring not-data-disabled:not-data-readonly:hover:scale-105 not-data-disabled:not-data-readonly:active:scale-95 data-disabled:cursor-not-allowed data-disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[1.5px] aria-invalid:ring-destructive/20 aria-invalid:focus-visible:border-destructive aria-invalid:data-checked:border-destructive aria-invalid:data-indeterminate:border-destructive motion-reduce:transition-none dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:aria-invalid:focus-visible:border-destructive/50 dark:aria-invalid:data-checked:border-destructive/50 dark:aria-invalid:data-indeterminate:border-destructive/50 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground data-indeterminate:border-primary data-indeterminate:bg-primary data-indeterminate:text-primary-foreground group-has-focus-visible/field-label:data-checked:not-aria-invalid:border-primary dark:data-checked:bg-primary dark:data-indeterminate:bg-primary",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        keepMounted
        className="group/checkbox-indicator grid place-content-center text-current"
      >
        <HugeiconsIcon
          aria-hidden="true"
          className="col-start-1 row-start-1 size-3.5 opacity-0 transition-opacity duration-120 group-data-checked/checkbox-indicator:opacity-100 group-data-checked/checkbox-indicator:delay-75 [&>path]:[stroke-dasharray:32] [&>path]:[stroke-dashoffset:32] [&>path]:transition-[stroke-dashoffset] [&>path]:duration-120 group-data-checked/checkbox-indicator:[&>path]:[stroke-dashoffset:0] group-data-checked/checkbox-indicator:[&>path]:delay-75 motion-reduce:transition-none motion-reduce:[&>path]:transition-none"
          icon={CheckIcon}
          strokeWidth={3.5}
        />
        <HugeiconsIcon
          aria-hidden="true"
          className="col-start-1 row-start-1 size-3.5 opacity-0 transition-opacity duration-120 group-data-indeterminate/checkbox-indicator:opacity-100 [&>path]:[stroke-dasharray:24] [&>path]:[stroke-dashoffset:24] [&>path]:transition-[stroke-dashoffset] [&>path]:duration-120 group-data-indeterminate/checkbox-indicator:[&>path]:[stroke-dashoffset:0] motion-reduce:transition-none motion-reduce:[&>path]:transition-none"
          icon={MinusIcon}
          strokeWidth={3.5}
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
