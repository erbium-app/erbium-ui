import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { Separator } from "./separator";

// A fieldset gives the group its native group role. min-w-0 resets the
// fieldset's min-content minimum inline size.
const buttonGroupVariants = cva(
  "m-0 flex w-fit min-w-0 items-stretch border-0 p-0 *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-related has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-e-lg [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>[data-slot=input-control]]:flex-1",
  {
    defaultVariants: {
      orientation: "horizontal",
    },
    variants: {
      orientation: {
        horizontal:
          "*:data-slot:rounded-e-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-e-lg! [&>[data-slot]~[data-slot]]:rounded-s-none [&>[data-slot]~[data-slot]]:-ms-px",
        vertical:
          "flex-col *:data-slot:rounded-b-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-lg! [&>[data-slot]~[data-slot]]:rounded-t-none [&>[data-slot]~[data-slot]]:-mt-px",
      },
    },
  },
);

const ButtonGroup = ({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"fieldset"> & VariantProps<typeof buttonGroupVariants>) => (
  <fieldset
    data-slot="button-group"
    data-orientation={orientation}
    className={cn(buttonGroupVariants({ orientation }), className)}
    {...props}
  />
);

const ButtonGroupText = ({ className, render, ...props }: useRender.ComponentProps<"div">) =>
  useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "flex items-center gap-related rounded-lg border bg-muted px-control-inset text-control-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-control-icon",
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: "button-group-text",
    },
  });

const ButtonGroupSeparator = ({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) => (
  <Separator
    data-slot="button-group-separator"
    orientation={orientation}
    variant="full"
    className={cn(
      "relative self-stretch data-horizontal:mx-px data-horizontal:w-auto data-vertical:my-px data-vertical:h-auto",
      className,
    )}
    {...props}
  />
);

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants };
