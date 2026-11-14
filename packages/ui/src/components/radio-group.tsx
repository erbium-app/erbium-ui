import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { skeletonBlock } from "../lib/skeleton-hints";
import { radioClassName, radioDotClassName } from "../lib/choice-styles";
import { cn } from "../lib/utils";

const RadioGroup = ({ className, ...props }: RadioGroupPrimitive.Props) => (
  <RadioGroupPrimitive
    data-slot="radio-group"
    className={cn("grid w-full gap-related", className)}
    {...props}
  />
);

const RadioGroupItem = ({ className, ...props }: RadioPrimitive.Root.Props) => (
  <RadioPrimitive.Root
    data-slot="radio-group-item"
    {...skeletonBlock}
    data-choice=""
    className={cn(radioClassName, className)}
    {...props}
  >
    {/* The dot grows from the center with a slight overshoot and
          shrinks back on exit; Base UI unmounts it once its scale settles. */}
    <RadioPrimitive.Indicator
      data-slot="radio-group-indicator"
      className="absolute inset-0 grid place-content-center transition-[scale,opacity] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] data-ending-style:scale-0 data-ending-style:opacity-0 data-ending-style:duration-150 data-ending-style:ease-in data-starting-style:scale-0 motion-reduce:transition-none"
    >
      <span className={radioDotClassName} />
    </RadioPrimitive.Indicator>
  </RadioPrimitive.Root>
);

export { RadioGroup, RadioGroupItem };
