import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "../lib/utils";

/**
 * A standalone `<label>` that takes `htmlFor`. Base UI's `Field.Label` throws
 * outside a `Field.Root`, so inside a `Field` use `FieldLabel`, which links to
 * the control and mirrors its disabled and invalid state.
 */
function Label({ className, render, ...props }: useRender.ComponentProps<"label">) {
  const defaultProps = {
    "data-slot": "label",
    className: cn(
      "flex items-center gap-2 text-sm leading-none font-medium select-none data-disabled:pointer-events-none data-disabled:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-data-disabled:cursor-not-allowed peer-data-disabled:opacity-50",
      className,
    ),
  };

  return useRender({
    defaultTagName: "label",
    render,
    props: mergeProps<"label">(defaultProps, props),
  });
}

export { Label };
