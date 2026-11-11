import * as React from "react";
import type { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import type { DateRange } from "@daypicker/react";
import { formatDate, formatDateRange, parseDate, parseDateRange, toISODate } from "../lib/date";
import { cn } from "../lib/utils";
import { Calendar } from "./calendar";
import { Icon } from "./icon";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./input-group";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type DatePickerMode = "single" | "range";

type DatePickerValue = Date | DateRange | undefined;

interface DatePickerContextValue {
  anchor: HTMLElement | null;
  commitText: (text: string) => void;
  disabled: boolean;
  input: HTMLInputElement | null;
  mode: DatePickerMode;
  month: Date;
  selectDay: (day: Date) => void;
  setAnchor: (element: HTMLElement | null) => void;
  setInput: (element: HTMLInputElement | null) => void;
  setMonth: (month: Date) => void;
  setOpen: (open: boolean) => void;
  text: string;
  value: DatePickerValue;
}

const DatePickerContext = React.createContext<DatePickerContextValue | null>(null);

const useDatePicker = (part: string) => {
  const context = React.use(DatePickerContext);

  if (!context) {
    throw new Error(`${part} must be used within DatePicker`);
  }

  return context;
};

const startOf = (value: DatePickerValue) => (value instanceof Date ? value : value?.from);

const placeholders = { range: "Pick a date range", single: "Pick a date" } as const;

const triggerLabels = { range: "Choose date range", single: "Choose date" } as const;

interface DatePickerSharedProps {
  children?: React.ReactNode;
  /** Close the popup when a day, or the end of a range, is picked. */
  closeOnSelect?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  /** Intl options for the displayed value. Defaults to `{ dateStyle: "medium" }`. */
  formatOptions?: Intl.DateTimeFormatOptions;
  /** BCP 47 locale for formatting and parsing typed dates. */
  locale?: string;
  /** Submits the value as an ISO date, or an ISO interval in range mode. */
  name?: string;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}

interface DatePickerSingleProps extends DatePickerSharedProps {
  defaultValue?: Date;
  mode?: "single";
  onValueChange?: (value: Date | undefined) => void;
  value?: Date | undefined;
}

interface DatePickerRangeProps extends DatePickerSharedProps {
  defaultValue?: DateRange;
  mode: "range";
  onValueChange?: (value: DateRange | undefined) => void;
  value?: DateRange | undefined;
}

type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps;

const DatePicker = (props: DatePickerProps) => {
  const {
    children,
    closeOnSelect = true,
    defaultOpen = false,
    disabled = false,
    formatOptions,
    locale,
    name,
    onOpenChange,
    open: openProp,
  } = props;

  const mode = props.mode ?? "single";
  const valueControlled = "value" in props;
  const onRangeChange = props.mode === "range" ? props.onValueChange : undefined;
  const onSingleChange = props.mode === "range" ? undefined : props.onValueChange;

  const [uncontrolledValue, setUncontrolledValue] = React.useState<DatePickerValue>(
    props.defaultValue,
  );

  const value = valueControlled ? props.value : uncontrolledValue;

  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = openProp ?? uncontrolledOpen;

  const [month, setMonth] = React.useState(() => startOf(value) ?? new Date());
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  const [input, setInput] = React.useState<HTMLInputElement | null>(null);

  // The first pick of each open session starts a new range; the second ends it.
  const pendingFrom = React.useRef<Date | undefined>(undefined);

  // The last value the picker set itself. A different value came from outside
  // (presets, resets), so the calendar moves to its month.
  const [ownValue, setOwnValue] = React.useState(value);

  if (value !== ownValue) {
    const start = startOf(value);

    setOwnValue(value);

    if (start) {
      setMonth(start);
    }
  }

  const text =
    value instanceof Date
      ? formatDate(value, locale, formatOptions)
      : formatDateRange(value, locale, formatOptions);

  const formValue =
    value instanceof Date
      ? toISODate(value)
      : [value?.from, value?.to].flatMap((day) => (day ? [toISODate(day)] : [])).join("/");

  const context = React.useMemo<DatePickerContextValue>(() => {
    const setValue = (next: DatePickerValue) => {
      setOwnValue(next);

      if (!valueControlled) {
        setUncontrolledValue(next);
      }

      onRangeChange?.(next instanceof Date ? { from: next, to: undefined } : next);
      onSingleChange?.(next instanceof Date ? next : next?.from);
    };

    const setOpen = (next: boolean) => {
      if (next && disabled) {
        return;
      }

      if (next) {
        pendingFrom.current = undefined;
        setMonth(startOf(value) ?? new Date());
      }

      setUncontrolledOpen(next);
      onOpenChange?.(next);
    };

    const selectDay = (day: Date) => {
      if (mode === "range") {
        const from = pendingFrom.current;

        pendingFrom.current = from ? undefined : day;

        if (!from) {
          setValue({ from: day });

          return;
        }

        setValue(day < from ? { from: day, to: from } : { from, to: day });
      } else {
        setValue(day);
      }

      if (closeOnSelect) {
        setOpen(false);
      }
    };

    const commitText = (typed: string) => {
      if (typed.trim() === "") {
        setValue(undefined);

        return;
      }

      const next = mode === "range" ? parseDateRange(typed, locale) : parseDate(typed, locale);
      const start = startOf(next);

      // Invalid text leaves the value unchanged; the input then shows it again.
      if (next && start) {
        setValue(next);
        setMonth(start);
      }
    };

    return {
      anchor,
      commitText,
      disabled,
      input,
      mode,
      month,
      selectDay,
      setAnchor,
      setInput,
      setMonth,
      setOpen,
      text,
      value,
    };
  }, [
    anchor,
    closeOnSelect,
    disabled,
    input,
    locale,
    mode,
    month,
    onOpenChange,
    onRangeChange,
    onSingleChange,
    text,
    value,
    valueControlled,
  ]);

  return (
    <DatePickerContext value={context}>
      <Popover
        open={open}
        onOpenChange={(next) => {
          context.setOpen(next);
        }}
      >
        {children}
      </Popover>
      {name === undefined ? null : (
        <input type="hidden" name={name} value={formValue} disabled={disabled} />
      )}
    </DatePickerContext>
  );
};

/** Text field that shows the value, accepts typed dates, and opens the calendar. */
const DatePickerInput = ({
  className,
  onBlur,
  onChange,
  onKeyDown,
  placeholder,
  triggerLabel,
  ...props
}: Omit<React.ComponentProps<"input">, "defaultValue" | "type" | "value"> & {
  /** Accessible name of the calendar button. */
  triggerLabel?: string;
}) => {
  // Destructured so the ref callbacks stay separate from the values read in render.
  const { commitText, disabled, mode, setAnchor, setInput, setOpen, text } =
    useDatePicker("DatePickerInput");

  // Typed text while editing; null shows the formatted value.
  const [draft, setDraft] = React.useState<string | null>(null);

  const commit = () => {
    if (draft !== null) {
      commitText(draft);
      setDraft(null);
    }
  };

  return (
    <InputGroup
      ref={setAnchor}
      data-slot="date-picker-input"
      data-disabled={disabled ? "" : undefined}
      className={className}
    >
      <InputGroupInput
        autoComplete="off"
        disabled={disabled}
        placeholder={placeholder ?? placeholders[mode]}
        {...props}
        ref={setInput}
        value={draft ?? text}
        onChange={(event) => {
          onChange?.(event);
          setDraft(event.target.value);
        }}
        onBlur={(event) => {
          onBlur?.(event);
          commit();
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);

          if (event.defaultPrevented) {
            return;
          }

          if (event.key === "Enter") {
            commit();
          } else if (event.key === "Escape" && draft !== null) {
            event.preventDefault();
            setDraft(null);
          } else if (event.key === "ArrowDown") {
            event.preventDefault();
            commit();
            setOpen(true);
          }
        }}
      />
      <InputGroupAddon align="inline-end">
        <PopoverTrigger
          disabled={disabled}
          render={
            <InputGroupButton size="icon-xs" aria-label={triggerLabel ?? triggerLabels[mode]} />
          }
        >
          <Icon name="calendar-01" />
        </PopoverTrigger>
      </InputGroupAddon>
    </InputGroup>
  );
};

/** Button that shows the value and opens the calendar, for pickers without typing. */
const DatePickerTrigger = ({
  children,
  className,
  placeholder,
  ...props
}: PopoverPrimitive.Trigger.Props & { placeholder?: string }) => {
  const context = useDatePicker("DatePickerTrigger");

  return (
    <PopoverTrigger
      data-slot="date-picker-trigger"
      data-placeholder={context.text === "" ? "" : undefined}
      disabled={context.disabled}
      className={cn(
        "flex w-fit min-w-0 items-center gap-control-gap control-size touch-target rounded-lg border surface-control text-control-sm whitespace-nowrap transition-[color,background-color,box-shadow] duration-150 outline-none select-none motion-reduce:transition-none aria-invalid:border-error aria-invalid:ring-[1.5px] aria-invalid:ring-invalid-halo data-placeholder:text-muted-foreground data-disabled:cursor-not-allowed data-disabled:opacity-50 dark:aria-invalid:border-invalid [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-control-icon",
        className,
      )}
      {...props}
    >
      <Icon name="calendar-01" className="text-muted-foreground" />
      <span className="truncate">
        {children ??
          (context.text === "" ? (placeholder ?? placeholders[context.mode]) : context.text)}
      </span>
    </PopoverTrigger>
  );
};

/** Popup anchored to the input (or the trigger) that holds the calendar. */
const DatePickerContent = ({
  align = "start",
  className,
  ...props
}: React.ComponentProps<typeof PopoverContent>) => {
  const context = useDatePicker("DatePickerContent");
  const popupRef = React.useRef<HTMLDivElement>(null);

  return (
    <PopoverContent
      anchor={context.anchor ?? undefined}
      align={align}
      // Focus the selected day, or today, so arrow keys move through the grid.
      initialFocus={() =>
        popupRef.current?.querySelector<HTMLElement>(
          "[data-slot=calendar] [role=gridcell] button[tabindex='0']",
        ) ?? true
      }
      finalFocus={() => context.input ?? true}
      className={cn("w-auto", className)}
      {...props}
      ref={popupRef}
    />
  );
};

type DatePickerCalendarProps = Omit<
  React.ComponentProps<typeof Calendar>,
  "mode" | "month" | "onMonthChange" | "onSelect" | "required" | "selected"
>;

/** Calendar bound to the picker's value and visible month. */
const DatePickerCalendar = (props: DatePickerCalendarProps) => {
  const context = useDatePicker("DatePickerCalendar");

  const shared = {
    month: context.month,
    onMonthChange: context.setMonth,
  };

  if (context.mode === "range") {
    return (
      <Calendar
        {...props}
        {...shared}
        mode="range"
        selected={context.value instanceof Date ? { from: context.value } : context.value}
        onSelect={(_, day) => {
          context.selectDay(day);
        }}
      />
    );
  }

  return (
    <Calendar
      {...props}
      {...shared}
      mode="single"
      selected={startOf(context.value)}
      onSelect={(_, day) => {
        context.selectDay(day);
      }}
    />
  );
};

export { DatePicker, DatePickerCalendar, DatePickerContent, DatePickerInput, DatePickerTrigger };
