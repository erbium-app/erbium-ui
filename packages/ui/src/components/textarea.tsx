import * as React from "react";
import { Field as FieldPrimitive } from "@base-ui/react/field";
import { mergeProps } from "@base-ui/react/merge-props";
import { textareaClassName } from "../lib/form-control-styles";
import { cn } from "../lib/utils";

/**
 * Base UI has no textarea part: `Field.Control` is the primitive, rendered as a
 * `<textarea>`. The value, disabled, name and id props go to the control so the
 * surrounding `Field` tracks `filled`, `dirty`, `touched` and `disabled`; the
 * rest merge onto the element.
 */
const Textarea = ({ className, ref, ...props }: React.ComponentProps<"textarea">) => (
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
        className={cn(textareaClassName, className)}
        {...mergeProps(defaultProps, props)}
      />
    )}
  />
);

export { Textarea };
