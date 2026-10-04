---
title: "Calendar"
description: "Select a date or date range."
---

Select a date or date range.

**Import:** `@erbium/ui/components/calendar`

## Usage

See the [React DayPicker](https://daypicker.dev/v9) documentation for more information.

```tsx
import { Calendar } from "@erbium/ui/components/calendar";
```

```tsx
const [date, setDate] = React.useState<Date | undefined>(new Date());

return <Calendar mode="single" selected={date} onSelect={setDate} />;
```

## About

The `Calendar` component is built on top of [React DayPicker](https://daypicker.dev/v9).

## Date Picker

You can use the `<Calendar>` component to build a date picker. See the [Date Picker](https://ui.shadcn.com/docs/components/base/date-picker) page for more information.

## Localization

Pass the `locale` prop to provide locale-specific formatting.

```tsx
import { enUS } from "react-day-picker/locale";

<Calendar mode="single" selected={date} onSelect={setDate} locale={enUS} />;
```
