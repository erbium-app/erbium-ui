import * as React from "react";
import { Field as FieldPrimitive } from "@base-ui/react/field";
import { mergeProps } from "@base-ui/react/merge-props";
import { cn } from "../lib/utils";

/**
 * Base UI has no textarea part: `Field.Control` is the primitive, rendered as a
 * `<textarea>`. The value, disabled, name and id props go to the control so the
 * surrounding `Field` tracks `filled`, `dirty`, `touched` and `disabled`; the
 * rest merge onto the element.
 */
function Textarea({ className, ref, ...props }: React.ComponentProps<"textarea">) {
  return (
    <FieldPrimitive.Control
      ref={ref}
      value={props.value}
      defaultValue={props.defaultValue}
      disabled={props.disabled}
      id={props.id}
      name={props.name}
      render={(defaultProps: React.ComponentProps<"textarea">) => (
        <textarea
          data-slot="textarea"
          className={cn(
            "flex field-sizing-content min-h-16 w-full rounded-lg border surface-field px-2.5 py-2 text-base transition-[color,background-color,box-shadow] duration-150 outline-none motion-reduce:transition-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-error aria-invalid:ring-[1.5px] aria-invalid:ring-error/20 md:text-sm dark:aria-invalid:border-error/50 dark:aria-invalid:ring-error/40",
            className,
          )}
          {...mergeProps(defaultProps, props)}
        />
      )}
    />
  );
}

export { Textarea };
