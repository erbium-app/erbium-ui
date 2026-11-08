import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { useId } from "react";
import { cn } from "../lib/utils";

/* Spinner sizes follow the control icon scale. */
const spinnerVariants = cva("inline-block shrink-0 animate-spin", {
  defaultVariants: {
    size: "default",
  },
  variants: {
    size: {
      default: "size-control-icon-lg",
      lg: "size-5",
      sm: "size-control-icon",
      xl: "size-6",
      xs: "size-control-icon-sm",
    },
  },
});

const Spinner = ({
  className,
  size = "default",
  "data-icon": dataIcon = "inline-start",
  ...props
}: React.ComponentProps<"output"> &
  VariantProps<typeof spinnerVariants> & { "data-icon"?: "inline-start" }) => {
  const id = useId();
  const leadingId = `${id}-leading`;
  const trailingId = `${id}-trailing`;

  return (
    <output
      data-slot="spinner"
      data-size={size}
      data-icon={dataIcon}
      aria-label="Loading"
      className={cn(spinnerVariants({ className, size }))}
      {...props}
    >
      <svg className="size-full" fill="none" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M9 16.25C13.0041 16.25 16.25 13.0041 16.25 9C16.25 4.99594 13.0041 1.75 9 1.75"
          stroke={`url(#${leadingId})`}
          strokeWidth="1.5"
        />
        <path
          d="M9 16.25C4.99594 16.25 1.75 13.0041 1.75 9C1.75 4.99594 4.99594 1.75 9 1.75"
          stroke={`url(#${trailingId})`}
          strokeWidth="1.5"
        />
        <circle className="fill-current" cx="9" cy="16.25" r="0.75" />
        <defs>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id={leadingId}
            x1="9"
            x2="9"
            y1="2.5"
            y2="16.25"
          >
            <stop stopColor="currentColor" stopOpacity="0.5" />
            <stop offset="1" stopColor="currentColor" />
          </linearGradient>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id={trailingId}
            x1="9"
            x2="9"
            y1="2.5"
            y2="16.25"
          >
            <stop stopColor="currentColor" stopOpacity="0.5" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </output>
  );
};

export { Spinner };
