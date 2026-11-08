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

/* Day state lives on the grid cell (data-selected, data-today, range classes),
   so the button reads it with `in-*` variants instead of a custom DayButton. */
const dayButtonClassName = cn(
  buttonVariants({ size: null, variant: "ghost" }),
  "relative size-(--cell-size) rounded-(--cell-radius) p-0 text-control-sm font-normal focus-visible:z-10",
  "in-data-outside:text-muted-foreground",
  "in-data-disabled:text-muted-foreground in-data-disabled:line-through in-data-disabled:opacity-50",
  "in-data-selected:bg-selection in-data-selected:text-selection-foreground",
  "in-data-selected:in-data-outside:text-selection-foreground",
  "in-[.range-start:not(.range-end)]:rounded-e-none in-[.range-end:not(.range-start)]:rounded-s-none",
  "in-[.range-middle]:rounded-none in-[.range-middle]:in-data-selected:bg-muted in-[.range-middle]:in-data-selected:text-foreground",
  // Today is a dot under the number, so it never competes with a selection fill.
  "in-data-today:after:pointer-events-none in-data-today:after:absolute in-data-today:after:inset-x-0 in-data-today:after:bottom-1 in-data-today:after:mx-auto in-data-today:after:size-0.75 in-data-today:after:rounded-full in-data-today:after:bg-selection",
  "in-data-today:in-data-selected:after:bg-selection-foreground in-[.range-middle]:in-data-today:after:bg-selection in-data-today:in-data-disabled:after:bg-muted-foreground",
);

/* Range days carry marker classes that the day button reads with `in-[.range-*]`. */
const calendarClassNames = {
  button_next: navButtonClassName,
  button_previous: navButtonClassName,
  caption_label: "flex h-full items-center gap-1 font-medium select-none",
  day: "p-0 py-px text-center",
  day_button: dayButtonClassName,
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

/** Month and year navigation through the library Select. */
const CalendarDropdown = ({
  "aria-label": ariaLabel,
  disabled,
  onChange,
  options,
  value,
}: DropdownProps) => {
  const items = (options ?? []).map((option) => ({
    label: option.label,
    value: String(option.value),
  }));

  return (
    <Select
      items={items}
      value={value === undefined ? null : String(value)}
      disabled={disabled}
      onValueChange={(next) => {
        if (next !== null) {
          // SAFETY: DayPicker's month and year handlers read only `target.value`
          // from the change event, so a partial event carries everything they use.
          // oxlint-disable-next-line typescript/no-unsafe-type-assertion
          onChange?.({ target: { value: next } } as React.ChangeEvent<HTMLSelectElement>);
        }
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
      Dropdown: CalendarDropdown,
      Root: CalendarRoot,
      ...components,
    }}
    {...props}
  />
);

/** DayPicker's default day button, for custom `DayButton` components that add content. */
const CalendarDayButton = DayButton;

export { Calendar, CalendarDayButton };

export type { DateRange, Matcher } from "@daypicker/react";
