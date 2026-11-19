import * as React from "react";
import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { focusSearchInput } from "../lib/focus-search-input";
import { skeletonBlock } from "../lib/skeleton-hints";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./input-group";
import { Separator } from "./separator";
import { ScrollArea } from "./scroll-area";
import { Icon } from "./icon";
import { RotatingChevron } from "./stateful-icon";

const Combobox = ComboboxPrimitive.Root;

const createComboboxItems = ComboboxPrimitive.createItems;

const ComboboxValue = ({ ...props }: ComboboxPrimitive.Value.Props) => (
  <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />
);

const ComboboxTrigger = ({ className, children, ...props }: ComboboxPrimitive.Trigger.Props) => (
  <ComboboxPrimitive.Trigger
    data-slot="combobox-trigger"
    {...skeletonBlock}
    className={cn(
      "group group/combobox-trigger [&_svg:not([class*='size-'])]:size-control-icon",
      className,
    )}
    {...props}
  >
    {children}
    <RotatingChevron className="pointer-events-none size-control-icon text-muted-foreground" />
  </ComboboxPrimitive.Trigger>
);

const ComboboxClear = ({ className, ...props }: ComboboxPrimitive.Clear.Props) => (
  <ComboboxPrimitive.Clear
    data-slot="combobox-clear"
    render={<InputGroupButton variant="ghost" size="icon-xs" />}
    className={cn(className)}
    {...props}
  >
    <Icon name="x" className="pointer-events-none" />
  </ComboboxPrimitive.Clear>
);

const ComboboxInput = ({
  className,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  ...props
}: ComboboxPrimitive.Input.Props & {
  showTrigger?: boolean;
  showClear?: boolean;
}) => (
  <InputGroup className={cn("w-auto", className)}>
    <ComboboxPrimitive.Input render={<InputGroupInput disabled={disabled} />} {...props} />
    <InputGroupAddon align="inline-end">
      {showTrigger && (
        <InputGroupButton
          size="icon-xs"
          variant="ghost"
          render={<ComboboxTrigger />}
          data-slot="input-group-button"
          className="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent"
          disabled={disabled}
        />
      )}
      {showClear && <ComboboxClear disabled={disabled} />}
    </InputGroupAddon>
    {children}
  </InputGroup>
);

const ComboboxSearchInput = ({ className, ...props }: ComboboxPrimitive.Input.Props) => (
  <div data-slot="combobox-search-input-wrapper">
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
      <ComboboxPrimitive.Input
        data-slot="combobox-search-input"
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

const ComboboxContent = ({
  className,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  anchor,
  ...props
}: ComboboxPrimitive.Popup.Props &
  Pick<
    ComboboxPrimitive.Positioner.Props,
    "side" | "align" | "sideOffset" | "alignOffset" | "anchor"
  >) => (
  <ComboboxPrimitive.Portal>
    <ComboboxPrimitive.Positioner
      side={side}
      sideOffset={sideOffset}
      align={align}
      alignOffset={alignOffset}
      anchor={anchor}
      className="isolate z-50"
    >
      <ComboboxPrimitive.Popup
        data-slot="combobox-content"
        data-chips={!!anchor}
        className={cn(
          "group/combobox-content relative flex max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) min-w-[calc(var(--anchor-width)+(--spacing(7)))] origin-(--transform-origin) flex-col overflow-hidden rounded-lg surface-overlay text-popover-foreground duration-100 data-[chips=true]:min-w-(--anchor-width) data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className,
        )}
        {...props}
      />
    </ComboboxPrimitive.Positioner>
  </ComboboxPrimitive.Portal>
);

const ComboboxList = ({ className, children, ...props }: ComboboxPrimitive.List.Props) => (
  <ScrollArea
    className="flex max-h-72 min-h-0 flex-col overflow-hidden overscroll-contain"
    fade="vertical"
    scrollbar="thin"
    viewportClassName="min-h-0 max-h-72 flex-1 overflow-x-hidden! scroll-py-1"
  >
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn("p-1 outline-none in-data-has-overflow-y:pe-3 data-empty:p-0", className)}
      {...props}
    >
      {children}
    </ComboboxPrimitive.List>
  </ScrollArea>
);

const ComboboxItem = ({ className, children, ...props }: ComboboxPrimitive.Item.Props) => (
  <ComboboxPrimitive.Item
    data-slot="combobox-item"
    className={cn(
      "relative flex row-size w-full cursor-default items-center rounded-md pe-8 text-control-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=error]:data-highlighted:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-control-icon",
      className,
    )}
    {...props}
  >
    {children}
    <ComboboxPrimitive.ItemIndicator
      render={
        <span className="pointer-events-none absolute inset-e-2 flex size-control-icon items-center justify-center" />
      }
    >
      <Icon name="check" className="pointer-events-none" />
    </ComboboxPrimitive.ItemIndicator>
  </ComboboxPrimitive.Item>
);

const ComboboxGroup = ({ className, ...props }: ComboboxPrimitive.Group.Props) => (
  <ComboboxPrimitive.Group data-slot="combobox-group" className={cn(className)} {...props} />
);

const ComboboxLabel = ({ className, ...props }: ComboboxPrimitive.GroupLabel.Props) => (
  <ComboboxPrimitive.GroupLabel
    data-slot="combobox-label"
    className={cn("px-2 py-1.5 text-control-sm text-muted-foreground", className)}
    {...props}
  />
);

const ComboboxCollection = ({ ...props }: ComboboxPrimitive.Collection.Props) => (
  <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />
);

const ComboboxEmpty = ({ className, ...props }: ComboboxPrimitive.Empty.Props) => (
  <ComboboxPrimitive.Empty
    data-slot="combobox-empty"
    className={cn(
      "w-full text-center text-control text-muted-foreground not-empty:py-2 empty:py-0",
      className,
    )}
    {...props}
  />
);

/** Keep mounted and update its children so async changes are announced consistently. */
const ComboboxStatus = ({ className, ...props }: ComboboxPrimitive.Status.Props) => (
  <ComboboxPrimitive.Status
    data-slot="combobox-status"
    className={cn("px-3 py-2 text-control-sm text-muted-foreground empty:m-0 empty:p-0", className)}
    {...props}
  />
);

const ComboboxSeparator = ({ className, ...props }: ComboboxPrimitive.Separator.Props) => (
  <ComboboxPrimitive.Separator
    data-slot="combobox-separator"
    className={cn("-mx-1 my-1", className)}
    render={<Separator />}
    {...props}
  />
);

const ComboboxChips = ({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof ComboboxPrimitive.Chips> & ComboboxPrimitive.Chips.Props) => (
  <ComboboxPrimitive.Chips
    data-slot="combobox-chips"
    className={cn(
      "flex min-h-control flex-wrap items-center gap-1 rounded-lg border surface-field px-2.5 py-1 text-control transition-[color,background-color,box-shadow] duration-150 has-aria-invalid:border-error has-aria-invalid:ring-[1.5px] has-aria-invalid:ring-invalid-halo has-data-[slot=combobox-chip]:px-1 motion-reduce:transition-none dark:has-aria-invalid:border-invalid",
      className,
    )}
    {...props}
  />
);

const ComboboxChip = ({
  className,
  children,
  showRemove = true,
  ...props
}: ComboboxPrimitive.Chip.Props & {
  showRemove?: boolean;
}) => (
  <ComboboxPrimitive.Chip
    data-slot="combobox-chip"
    className={cn(
      "flex h-[calc(--spacing(5.25))] w-fit items-center justify-center gap-1 rounded-sm bg-muted px-1.5 text-control-sm whitespace-nowrap text-foreground has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50 has-data-[slot=combobox-chip-remove]:pe-0",
      className,
    )}
    {...props}
  >
    {children}
    {showRemove && (
      <ComboboxPrimitive.ChipRemove
        render={<Button variant="ghost" size="icon-xs" />}
        className="-ms-1 opacity-50 hover:opacity-100"
        data-slot="combobox-chip-remove"
      >
        <Icon name="x" className="pointer-events-none" />
      </ComboboxPrimitive.ChipRemove>
    )}
  </ComboboxPrimitive.Chip>
);

const ComboboxChipsInput = ({ className, ...props }: ComboboxPrimitive.Input.Props) => (
  <ComboboxPrimitive.Input
    data-slot="combobox-chip-input"
    className={cn("min-w-16 flex-1 outline-none", className)}
    {...props}
  />
);

const useComboboxAnchor = () => React.useRef<HTMLDivElement | null>(null);

export {
  createComboboxItems,
  Combobox,
  ComboboxInput,
  ComboboxSearchInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxStatus,
  ComboboxClear,
  ComboboxSeparator,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
};
