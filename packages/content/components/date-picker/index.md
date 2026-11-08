---
title: "Date Picker"
description: "Type or pick a date or a date range."
---

A field for entering a date or a date range by typing or by picking from a calendar.

**Import:** `@erbium/ui/components/date-picker`

## Usage

```tsx
import {
  DatePicker,
  DatePickerCalendar,
  DatePickerContent,
  DatePickerInput,
} from "@erbium/ui/components/date-picker";
```

```tsx
const [date, setDate] = React.useState<Date | undefined>();

return (
  <DatePicker value={date} onValueChange={setDate}>
    <DatePickerInput aria-label="Due date" />
    <DatePickerContent>
      <DatePickerCalendar />
    </DatePickerContent>
  </DatePicker>
);
```

## Composition

```text
DatePicker
├── DatePickerInput     (or DatePickerTrigger)
└── DatePickerContent
    └── DatePickerCalendar
```

- `DatePicker` owns the value, the open state, and the visible month. It renders no element of its own.
- `DatePickerInput` is an `InputGroup` with a text input and a calendar button. The popup anchors to the whole group.
- `DatePickerTrigger` is a select-style button for pickers without typing.
- `DatePickerContent` is a `Popover` popup. Put presets, a footer, or other controls next to the calendar here.
- `DatePickerCalendar` is a `Calendar` bound to the picker. It accepts every `Calendar` prop except the selection and month props, such as `numberOfMonths`, `captionLayout`, `disabled`, and `locale`.

## Value

`mode="single"` (the default) uses a `Date`; `mode="range"` uses a `DateRange` (`{ from, to }`). Both work controlled (`value`, `onValueChange`) or uncontrolled (`defaultValue`). Values are local calendar days.

In range mode the first pick of each opening starts a new range and the second ends it. The popup closes after a single date or a complete range; set `closeOnSelect={false}` to keep it open. Control the popup with `open` and `onOpenChange`.

Setting `value` from outside, as presets do, moves the calendar to that month.

## Typing

The input shows the value formatted with `Intl.DateTimeFormat` (`dateStyle: "medium"` by default; change it with `formatOptions`). It commits typed text on Enter or blur:

- ISO dates: `2026-11-09`.
- Numeric dates in the locale's order: `11/9/2026` in `en-US`, `9.11.2026` in `de-DE`. Two-digit years map to 1950–2049.
- Dates with a month name: `Nov 9, 2026`, `9 November 2026`.
- Ranges join two dates with an en dash, a spaced hyphen, or "to".

Text that is not a valid date reverts to the current value. Empty text clears it. Escape discards the edit, and the down arrow opens the calendar with focus on the selected day. Set `locale` to format and parse for a specific locale, and pass a matching DayPicker locale to `DatePickerCalendar`.

## Forms

Give `DatePicker` a `name` to submit its value through a hidden input. Single dates submit as ISO dates (`2026-11-09`); ranges submit as ISO intervals (`2026-11-09/2026-11-14`). Inside a `Field`, the label targets the input by `id`, and a disabled `Field` disables the input.

## Helpers

`@erbium/ui/lib/date` exports the helpers the picker uses: `formatDate`, `formatDateRange`, `parseDate`, `parseDateRange`, `toISODate`, and `addDays`.
