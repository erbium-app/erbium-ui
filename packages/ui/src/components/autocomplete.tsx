import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";
import { Input } from "./input";
import { ScrollArea } from "./scroll-area";
import { Separator } from "./separator";
import { cn } from "../lib/utils";
import { cva } from "class-variance-authority";
import { Icon } from "./icon";
import { focusSearchInput } from "../lib/focus-search-input";

import type React from "react";

export const Autocomplete: typeof AutocompletePrimitive.Root = AutocompletePrimitive.Root;

/** Search within an inline surface; form fields use AutocompleteInput. */
export const AutocompleteSearchInput = ({
  className,
  placeholder = "Search…",
  ...props
}: AutocompletePrimitive.Input.Props) => (
  <div data-slot="autocomplete-search" className="shrink-0">
    <div
      className="flex search-input-row items-center"
      onPointerDown={(event) => {
        focusSearchInput(event.currentTarget, event);
      }}
    >
      <Icon
        name="search-01"
        aria-hidden="true"
        className="size-control-icon shrink-0 text-muted-foreground"
      />
      <AutocompletePrimitive.Input
        data-slot="autocomplete-search-input"
        aria-label="Search"
        placeholder={placeholder}
        className={cn(
          "min-h-0 min-w-0 flex-1 bg-transparent py-0 text-field outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    </div>
    <Separator variant="full" />
  </div>
);

const autocompleteInputVariants = cva("", {
  variants: {
    size: {
      default:
        "has-[+[data-slot=autocomplete-trigger],+[data-slot=autocomplete-clear]]:*:data-[slot=autocomplete-input]:pe-7",
      lg: "has-[+[data-slot=autocomplete-trigger],+[data-slot=autocomplete-clear]]:*:data-[slot=autocomplete-input]:pe-7",
      sm: "has-[+[data-slot=autocomplete-trigger],+[data-slot=autocomplete-clear]]:*:data-[slot=autocomplete-input]:pe-6.5",
    },
    startAddon: {
      false: "",
      true: "data-[size=sm]:*:data-[slot=autocomplete-input]:ps-[calc(--spacing(7.5)-1px)] *:data-[slot=autocomplete-input]:ps-[calc(--spacing(8.5)-1px)] sm:data-[size=sm]:*:data-[slot=autocomplete-input]:ps-[calc(--spacing(7)-1px)] sm:*:data-[slot=autocomplete-input]:ps-[calc(--spacing(8)-1px)]",
    },
  },
});

const autocompleteFieldVariants = cva("", {
  variants: {
    size: {
      default: "",
      lg: "control-size-lg text-field",
      sm: "control-size-sm text-field",
    },
  },
});

const autocompleteActionVariants = cva(
  "absolute top-1/2 inline-flex size-control-sm shrink-0 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md border border-transparent opacity-80 outline-none transition-colors touch-target hover:opacity-100 has-[+[data-slot=autocomplete-clear]]:hidden [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-control-icon [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      size: {
        default: "inset-e-0.5",
        lg: "inset-e-0.5",
        sm: "inset-e-0",
      },
    },
  },
);

export const AutocompleteTrigger = ({
  className,
  children,
  ...props
}: AutocompletePrimitive.Trigger.Props): React.ReactElement => (
  <AutocompletePrimitive.Trigger className={className} data-slot="autocomplete-trigger" {...props}>
    {children}
  </AutocompletePrimitive.Trigger>
);

export const AutocompleteClear = ({
  className,
  ...props
}: AutocompletePrimitive.Clear.Props): React.ReactElement => (
  <AutocompletePrimitive.Clear
    className={cn(
      "absolute inset-e-0.5 top-1/2 inline-flex size-control-sm shrink-0 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md border border-transparent opacity-80 outline-none transition-[color,background-color,box-shadow,opacity] touch-target hover:opacity-100 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-control-icon [&_svg]:pointer-events-none [&_svg]:shrink-0",
      className,
    )}
    data-slot="autocomplete-clear"
    {...props}
  >
    <Icon name="x" />
  </AutocompletePrimitive.Clear>
);

export const AutocompleteInput = ({
  className,
  showTrigger = false,
  showClear = false,
  startAddon,
  size,
  triggerProps,
  clearProps,
  ...props
}: Omit<AutocompletePrimitive.Input.Props, "size"> & {
  showTrigger?: boolean;
  showClear?: boolean;
  startAddon?: React.ReactNode;
  size?: "sm" | "default" | "lg" | number;
  ref?: React.Ref<HTMLInputElement>;
  triggerProps?: AutocompletePrimitive.Trigger.Props;
  clearProps?: AutocompletePrimitive.Clear.Props;
}): React.ReactElement => {
  /* Numeric sizes set the native input width; the visual size stays default. */
  const visualSize = size === "sm" || size === "lg" ? size : "default";
  const hasStartAddon = startAddon !== undefined && startAddon !== null && startAddon !== false;

  return (
    <AutocompletePrimitive.InputGroup
      className="relative not-has-[>*.w-full]:w-fit w-full text-foreground has-disabled:opacity-64"
      data-slot="autocomplete-input-group"
    >
      {hasStartAddon && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 inset-s-px z-10 flex items-center ps-[calc(--spacing(3)-1px)] opacity-80 has-[+[data-size=sm]]:ps-[calc(--spacing(2.5)-1px)] [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-control-icon [&_svg]:-mx-0.5"
          data-slot="autocomplete-start-addon"
        >
          {startAddon}
        </div>
      )}
      <AutocompletePrimitive.Input
        className={cn(
          autocompleteInputVariants({ className, size: visualSize, startAddon: hasStartAddon }),
        )}
        data-slot="autocomplete-input"
        render={<Input className={cn(autocompleteFieldVariants({ size: visualSize }))} />}
        {...props}
      />
      {showTrigger && (
        <AutocompleteTrigger
          className={cn(autocompleteActionVariants({ size: visualSize }))}
          {...triggerProps}
        >
          <AutocompletePrimitive.Icon data-slot="autocomplete-icon">
            <Icon name="arrow-up-down" />
          </AutocompletePrimitive.Icon>
        </AutocompleteTrigger>
      )}
      {showClear && (
        <AutocompleteClear
          className={cn(autocompleteActionVariants({ size: visualSize }))}
          {...clearProps}
        >
          <Icon name="x" />
        </AutocompleteClear>
      )}
    </AutocompletePrimitive.InputGroup>
  );
};

export const AutocompletePopup = ({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  alignOffset,
  align = "start",
  anchor,
  portalProps,
  ...props
}: AutocompletePrimitive.Popup.Props & {
  align?: AutocompletePrimitive.Positioner.Props["align"];
  sideOffset?: AutocompletePrimitive.Positioner.Props["sideOffset"];
  alignOffset?: AutocompletePrimitive.Positioner.Props["alignOffset"];
  side?: AutocompletePrimitive.Positioner.Props["side"];
  anchor?: AutocompletePrimitive.Positioner.Props["anchor"];
  portalProps?: AutocompletePrimitive.Portal.Props;
}): React.ReactElement => (
  <AutocompletePrimitive.Portal {...portalProps}>
    <AutocompletePrimitive.Positioner
      align={align}
      alignOffset={alignOffset}
      anchor={anchor}
      className="z-50 select-none"
      data-slot="autocomplete-positioner"
      side={side}
      sideOffset={sideOffset}
    >
      <span
        className={cn(
          "relative flex min-h-0 max-h-full min-w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) overflow-hidden rounded-lg surface-overlay transition-[scale,opacity]",
          className,
        )}
      >
        <AutocompletePrimitive.Popup
          className="flex min-h-0 max-h-[min(var(--available-height),23rem)] flex-1 flex-col text-foreground"
          data-slot="autocomplete-popup"
          {...props}
        >
          {children}
        </AutocompletePrimitive.Popup>
      </span>
    </AutocompletePrimitive.Positioner>
  </AutocompletePrimitive.Portal>
);

export const AutocompleteItem = ({
  className,
  children,
  ...props
}: AutocompletePrimitive.Item.Props): React.ReactElement => (
  <AutocompletePrimitive.Item
    className={cn(
      "flex cursor-default select-none items-center rounded-md row-size text-control-sm outline-none data-disabled:pointer-events-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-64",
      className,
    )}
    data-slot="autocomplete-item"
    {...props}
  >
    {children}
  </AutocompletePrimitive.Item>
);

export const AutocompleteSeparator = ({
  className,
  ...props
}: AutocompletePrimitive.Separator.Props): React.ReactElement => (
  <AutocompletePrimitive.Separator
    className={cn("-mx-1 my-1 last:hidden", className)}
    data-slot="autocomplete-separator"
    render={<Separator />}
    {...props}
  />
);

export const AutocompleteGroup = ({
  className,
  ...props
}: AutocompletePrimitive.Group.Props): React.ReactElement => (
  <AutocompletePrimitive.Group
    className={cn("[[role=group]+&]:mt-1.5", className)}
    data-slot="autocomplete-group"
    {...props}
  />
);

export const AutocompleteGroupLabel = ({
  className,
  ...props
}: AutocompletePrimitive.GroupLabel.Props): React.ReactElement => (
  <AutocompletePrimitive.GroupLabel
    className={cn("px-2 py-1.5 text-muted-foreground text-control-sm", className)}
    data-slot="autocomplete-group-label"
    {...props}
  />
);

export const AutocompleteEmpty = ({
  className,
  ...props
}: AutocompletePrimitive.Empty.Props): React.ReactElement => (
  <AutocompletePrimitive.Empty
    className={cn("not-empty:p-2 text-center text-caption text-muted-foreground", className)}
    data-slot="autocomplete-empty"
    {...props}
  />
);

export const AutocompleteRow = ({
  className,
  ...props
}: AutocompletePrimitive.Row.Props): React.ReactElement => (
  <AutocompletePrimitive.Row className={className} data-slot="autocomplete-row" {...props} />
);

export const AutocompleteValue: typeof AutocompletePrimitive.Value = AutocompletePrimitive.Value;

export const AutocompleteList = ({
  className,
  ...props
}: AutocompletePrimitive.List.Props): React.ReactElement => (
  <ScrollArea
    className="flex min-h-0 max-h-72 flex-col overflow-hidden overscroll-contain"
    fade="vertical"
    scrollbar="thin"
    viewportClassName="min-h-0 max-h-72 flex-1 overflow-x-hidden! scroll-py-1"
  >
    <AutocompletePrimitive.List
      className={cn("not-empty:scroll-py-1 not-empty:p-1 in-data-has-overflow-y:pe-3", className)}
      data-slot="autocomplete-list"
      {...props}
    />
  </ScrollArea>
);

export const AutocompleteStatus = ({
  className,
  ...props
}: AutocompletePrimitive.Status.Props): React.ReactElement => (
  <AutocompletePrimitive.Status
    className={cn("px-3 py-2 text-muted-foreground text-control-sm empty:m-0 empty:p-0", className)}
    data-slot="autocomplete-status"
    {...props}
  />
);

export const AutocompleteCollection: typeof AutocompletePrimitive.Collection =
  AutocompletePrimitive.Collection;

export const useAutocompleteFilter: typeof AutocompletePrimitive.useFilter =
  AutocompletePrimitive.useFilter;

export { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";
