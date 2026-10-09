import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { cn } from "../lib/utils";

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid w-full gap-related", className)}
      {...props}
    />
  );
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "group/radio-group-item peer relative flex aspect-square size-choice shrink-0 rounded-full border border-input transition-[border-color,box-shadow,scale] duration-150 ease-out outline-none group-has-disabled/field:opacity-50 group-has-focus-visible/field-card:not-aria-invalid:ring-0 group-has-focus-visible/field-card:not-data-checked:not-aria-invalid:border-input after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring not-data-disabled:not-data-readonly:active:scale-90 data-disabled:cursor-not-allowed data-disabled:opacity-50 aria-invalid:border-error aria-invalid:ring-[1.5px] aria-invalid:ring-invalid-halo aria-invalid:focus-visible:border-error aria-invalid:data-checked:border-error motion-reduce:transition-none dark:bg-input/30 dark:aria-invalid:border-invalid dark:aria-invalid:focus-visible:border-invalid dark:aria-invalid:data-checked:border-invalid data-checked:border-selection group-has-focus-visible/field-card:data-checked:not-aria-invalid:border-selection",
        className,
      )}
      {...props}
    >
      {/* The dot grows from the center with a slight overshoot and
          shrinks back on exit; Base UI unmounts it once its scale settles. */}
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="absolute inset-0 grid place-content-center transition-[scale,opacity] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] data-ending-style:scale-0 data-ending-style:opacity-0 data-ending-style:duration-150 data-ending-style:ease-in data-starting-style:scale-0 motion-reduce:transition-none"
      >
        <span className="size-2 rounded-full bg-selection" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  );
}

export { RadioGroup, RadioGroupItem };
