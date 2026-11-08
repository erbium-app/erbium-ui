---
title: "Calendar"
description: "Select a date, a date range, or several dates."
---

Select a date, a date range, or several dates from a month grid.

**Import:** `@erbium/ui/components/calendar`

## Usage

```tsx
import { Calendar } from "@erbium/ui/components/calendar";
```

```tsx
const [date, setDate] = React.useState<Date | undefined>(new Date());

return <Calendar mode="single" selected={date} onSelect={setDate} />;
```

## About

`Calendar` wraps [React DayPicker](https://daypicker.dev) 10 (`@daypicker/react`) and passes every DayPicker prop through. It styles DayPicker's own elements through `classNames`, so keyboard navigation and focus management stay DayPicker's:

- Days and navigation buttons are library buttons. Days use the `ghost` variant, a selected day and the ends of a range use `default`, and the days between range ends use `secondary`, so hover, press, focus, and disabled states match every other button.
- Today is marked with a dot under the number in the day's text colour, so it never competes with a selection.
- `captionLayout="dropdown"` renders the month and year pickers with the library `Select`.
- Standalone, the calendar sits on a panel surface. Inside a `Card` or a `Popover` it drops its own surface and uses the container's.

To pick a date from a field, use [Date Picker](/docs/components/date-picker), which composes `Calendar` with an input and a popover.

## Styling

`classNames` adds to the defaults instead of replacing them:

```tsx
<Calendar classNames={{ day_button: "flex-col gap-0.5" }} />
```

Day cells follow the control height and grow to a 2.75rem touch target on coarse pointers. Keep that sizing so the calendar lines up with inputs, selects, and buttons; do not override the cell size per calendar.

To add content to a day, wrap `CalendarDayButton`, DayPicker's default day button, in a custom `DayButton` (see Custom Days).

## Localization

Pass a DayPicker locale for month names, weekday names, and the first day of the week:

```tsx
import { de } from "@daypicker/react/locale";

<Calendar mode="single" selected={date} onSelect={setDate} locale={de} />;
```

Non-Gregorian calendars ship as DayPicker add-ons (`@daypicker/persian`, `@daypicker/hijri`, `@daypicker/hebrew`, `@daypicker/buddhist`, `@daypicker/ethiopic`). Pass the add-on's date library and locale to `Calendar` to keep the library styling; see Persian (Jalali) Calendar.

## Types

`DateRange` and `Matcher` are re-exported from `@erbium/ui/components/calendar`, so most code needs no direct DayPicker import. Date helpers (`addDays`, `formatDate`, `parseDate`, and their range variants) live in `@erbium/ui/lib/date`.
