import * as React from "react";
import { DayButton, DayPicker } from "@daypicker/react";
import type { ChevronProps, ClassNames, DropdownProps, RootProps } from "@daypicker/react";
import { buttonVariants } from "../lib/button-variants";
import { cn } from "../lib/utils";
import { Icon } from "./icon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

/* Navigation and day buttons share the ghost button surface, so hover, press,
   focus, and disabled states match every other flat control. */
const navButtonClassName = cn(
  buttonVariants({ size: null, variant: "ghost" }),
  "size-(--cell-size) rounded-(--cell-radius) p-0 aria-disabled:pointer-events-none aria-disabled:opacity-50",
);

/* Day buttons take a library button variant from their state: ghost by
   default, the primary fill when selected, and secondary between range ends.
   Range rounding reads the marker classes DayPicker puts on the grid cell. */
const dayButtonClassName = cn(
  "relative size-(--cell-size) rounded-(--cell-radius) p-0 text-control-sm font-normal focus-visible:z-10",
  "in-data-outside:not-in-data-selected:text-muted-foreground",
  "in-data-disabled:line-through",
  "in-[.range-end:not(.range-start)]:rounded-s-none in-[.range-middle]:rounded-none in-[.range-start:not(.range-end)]:rounded-e-none",
  // Today is a dot under the number in the button's text colour.
  "in-data-today:after:pointer-events-none in-data-today:after:absolute in-data-today:after:inset-x-0 in-data-today:after:bottom-1 in-data-today:after:mx-auto in-data-today:after:size-0.75 in-data-today:after:rounded-full in-data-today:after:bg-current",
);

const dayButtonVariant = (modifiers: React.ComponentProps<typeof DayButton>["modifiers"]) => {
  if (modifiers.range_middle) {
    return "secondary";
  }

  return modifiers.selected ? "default" : "ghost";
};

/** The calendar's day button. Wrap it in a custom `DayButton` to add content to a day. */
const CalendarDayButton = ({
  className,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) => (
  <DayButton
    data-slot="calendar-day-button"
    modifiers={modifiers}
    className={cn(
      buttonVariants({ size: null, variant: dayButtonVariant(modifiers) }),
      dayButtonClassName,
      className,
    )}
    {...props}
  />
);

/* Range days carry marker classes that the day button reads with `in-[.range-*]`. */
const calendarClassNames = {
  button_next: navButtonClassName,
  button_previous: navButtonClassName,
  caption_label: "flex h-full items-center gap-1 font-medium select-none",
  day: "p-0 py-px text-center",
  dropdowns: "flex items-center justify-center gap-1.5",
  hidden: "invisible",
  month: "flex w-full flex-col gap-related",
  month_caption: "relative z-20 mx-(--cell-size) flex h-(--cell-size) items-center justify-center",
  month_grid: "w-full border-collapse",
  months: "relative flex flex-col gap-group sm:flex-row",
  nav: "absolute inset-x-0 top-0 z-10 flex items-center justify-between",
  range_end: "range-end",
  range_middle: "range-middle",
  range_start: "range-start",
  week_number:
    "size-(--cell-size) p-0 text-center text-control-sm font-normal text-muted-foreground select-none",
  week_number_header: "size-(--cell-size) p-0 select-none",
  weekday: "size-(--cell-size) p-0 text-control-sm font-normal text-muted-foreground select-none",
} satisfies Partial<ClassNames>;

/** Adds user classes to the defaults instead of replacing them, keeping range markers. */
const mergeClassNames = (overrides: Partial<ClassNames> | undefined) => {
  const merged = new Map(Object.entries(calendarClassNames));

  for (const [key, value] of Object.entries(overrides ?? {})) {
    merged.set(key, cn(merged.get(key), value));
  }

  return Object.fromEntries(merged);
};

const CalendarRoot = ({ className, rootRef, ...props }: RootProps) => (
  <div data-slot="calendar" ref={rootRef} className={className} {...props} />
);

const CalendarChevron = ({ className, orientation, size: _size, ...props }: ChevronProps) => {
  if (orientation === "left" || orientation === "right") {
    return (
      <Icon
        name={orientation === "left" ? "chevron-left" : "chevron-right"}
        className={cn("size-4 rtl:rotate-180", className)}
        {...props}
      />
    );
  }

  return <Icon name="chevron-down" className={cn("size-4", className)} {...props} />;
};

/** Month and year navigation through the library Select.
 *
 * DayPicker's month and year handlers expect a native select change event and
 * resolve the target month through the calendar's own date library, which keeps
 * non-Gregorian calendars correct. A hidden native select receives that event:
 * the visible Select writes its value and dispatches a real `change` event. */
const CalendarDropdown = ({
  "aria-label": ariaLabel,
  disabled,
  onChange,
  options,
  value,
}: DropdownProps) => {
  const nativeRef = React.useRef<HTMLSelectElement>(null);

  const items = (options ?? []).map((option) => ({
    label: option.label,
    value: String(option.value),
  }));

  return (
    <>
      <select
        ref={nativeRef}
        hidden
        aria-hidden
        tabIndex={-1}
        disabled={disabled}
        value={value}
        onChange={onChange}
      >
        {items.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      <Select
        items={items}
        value={value === undefined ? null : String(value)}
        disabled={disabled}
        onValueChange={(next) => {
          const native = nativeRef.current;

          if (next === null || native === null) {
            return;
          }

          native.value = next;
          native.dispatchEvent(new Event("change", { bubbles: true }));
        }}
      >
        <SelectTrigger size="sm" aria-label={ariaLabel} className="gap-1 font-medium">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-72">
          {(options ?? []).map((option) => (
            <SelectItem key={option.value} value={String(option.value)} disabled={option.disabled}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

const Calendar = ({
  className,
  classNames,
  components,
  formatters,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) => (
  <DayPicker
    showOutsideDays={showOutsideDays}
    className={cn(
      "w-fit rounded-xl surface-panel p-2 text-control-sm tabular-nums [--cell-radius:var(--radius-md)] [--cell-size:var(--control-height)] pointer-coarse:[--cell-size:2.75rem]",
      // Inside a card or popover the container already supplies the surface.
      "in-data-[slot=card]:rounded-none in-data-[slot=card]:bg-transparent in-data-[slot=card]:shadow-none in-data-[slot=popover-content]:rounded-none in-data-[slot=popover-content]:bg-transparent in-data-[slot=popover-content]:p-0 in-data-[slot=popover-content]:shadow-none",
      className,
    )}
    formatters={{
      // Format through the calendar's date library so non-Gregorian calendars
      // and locales name their own months.
      formatMonthDropdown: (month, dateLib) =>
        dateLib?.format(month, "LLL") ?? month.toLocaleString(undefined, { month: "short" }),
      ...formatters,
    }}
    classNames={mergeClassNames(classNames)}
    components={{
      Chevron: CalendarChevron,
      DayButton: CalendarDayButton,
      Dropdown: CalendarDropdown,
      Root: CalendarRoot,
      ...components,
    }}
    {...props}
  />
);

export { Calendar, CalendarDayButton };

export type { DateRange, Matcher } from "@daypicker/react";
