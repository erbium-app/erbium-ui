import * as React from "react";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import { Spinner } from "./spinner";
import { Textarea } from "./textarea";

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-related py-1.5 text-control-sm font-medium text-muted-foreground select-none [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4",
  {
    defaultVariants: {
      align: "inline-start",
    },
    variants: {
      align: {
        "block-end":
          "order-last w-full justify-start px-2.5 pb-2 group-has-[>input]/input-group:pb-2",
        "block-start":
          "order-first w-full justify-start px-2.5 pt-2 group-has-[>input]/input-group:pt-2",
        "inline-end": "order-last py-0 pe-2 has-[>button]:me-[-0.3rem] has-[>kbd]:me-[-0.15rem]",
        "inline-start": "order-first py-0 ps-2 has-[>button]:ms-[-0.3rem] has-[>kbd]:ms-[-0.15rem]",
      },
    },
  },
);

// Elements in an addon that handle their own pointer input.
const interactiveSelector =
  "a, button, input, label, select, textarea, [contenteditable], [role='button'], [role='combobox'], [role='listbox']";

const InputGroupAddon = ({
  className,
  align = "inline-start",
  onMouseDown,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) => (
  <div
    role="presentation"
    data-slot="input-group-addon"
    data-align={align}
    className={cn(inputGroupAddonVariants({ align }), className)}
    onMouseDown={(event) => {
      onMouseDown?.(event);

      const interactive =
        event.target instanceof Element ? event.target.closest(interactiveSelector) : null;

      if (event.defaultPrevented || (interactive && event.currentTarget.contains(interactive))) {
        return;
      }

      // Keep focus in the control: focusing on mousedown, not click, avoids a
      // blur that would flash the ring and mark a Field as touched.
      event.preventDefault();
      event.currentTarget.parentElement
        ?.querySelector<HTMLElement>(":scope > :is(input, textarea)")
        ?.focus();
    }}
    {...props}
  />
);

const InputGroup = ({
  children,
  className,
  loading = false,
  "aria-busy": ariaBusy,
  ...props
}: React.ComponentProps<"fieldset"> & { loading?: boolean }) => (
  <fieldset
    data-slot="input-group"
    aria-busy={loading || ariaBusy}
    data-loading={loading ? "" : undefined}
    className={cn(
      "data-loading:[&>[data-slot=input-group-control]]:ps-8 group/input-group relative m-0 flex min-h-control control-adaptive w-full min-w-0 items-center gap-control-gap rounded-lg border p-0 surface-field transition-[color,background-color,box-shadow] duration-150 outline-none motion-reduce:transition-none in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 has-[>[data-slot=input-group-control][data-disabled]]:opacity-50 has-[[data-slot][aria-invalid=true]]:border-error has-[[data-slot][aria-invalid=true]]:ring-[1.5px] has-[[data-slot][aria-invalid=true]]:ring-invalid-halo has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pe-1.5 has-[>[data-align=inline-start]]:[&>input]:ps-1.5",
      className,
    )}
    {...props}
  >
    {children}
    {loading && (
      <InputGroupAddon className="absolute inset-s-0 top-0 min-h-control">
        <Spinner aria-hidden size="sm" />
      </InputGroupAddon>
    )}
  </fieldset>
);

const inputGroupButtonVariants = cva(
  "flex control-embedded items-center gap-control-gap text-control-sm shadow-none",
  {
    defaultVariants: {
      size: "xs",
    },
    variants: {
      size: {
        "icon-sm": "size-control-sm p-0 has-[>svg]:p-0",
        "icon-xs": "size-control-xs rounded-[calc(var(--radius)-3px)] p-0 has-[>svg]:p-0",
        sm: "",
        xs: "min-h-control-xs gap-1 rounded-[calc(var(--radius)-3px)] px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
      },
    },
  },
);

const InputGroupButton = ({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size" | "type"> &
  VariantProps<typeof inputGroupButtonVariants> & {
    type?: "button" | "submit" | "reset";
  }) => (
  <Button
    type={type}
    size={size ?? "xs"}
    variant={variant}
    className={cn(inputGroupButtonVariants({ size }), className)}
    {...props}
  />
);

const InputGroupText = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span
    className={cn(
      "flex items-center gap-related text-caption text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
      className,
    )}
    {...props}
  />
);

const InputGroupInput = ({ className, ...props }: React.ComponentProps<"input">) => (
  <Input
    data-slot="input-group-control"
    className={cn(
      // -my-px lets the control overlap the group's border, so the group is as tall as an Input.
      "-my-px flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent disabled:opacity-100 aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent",
      className,
    )}
    {...props}
  />
);

const InputGroupTextarea = ({ className, ...props }: React.ComponentProps<"textarea">) => (
  <Textarea
    data-slot="input-group-control"
    className={cn(
      "flex-1 resize-none rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent disabled:opacity-100 aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent",
      className,
    )}
    {...props}
  />
);

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
};
