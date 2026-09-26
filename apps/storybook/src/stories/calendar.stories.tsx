import CalendarTimezone from "../examples/calendar-timezone";
import { CalendarRange } from "../examples/upstream/calendar-range";
import { CalendarWithPresets } from "../examples/upstream/calendar-presets";
import CalendarBasic from "../examples/upstream/calendar-basic";
import { CalendarCaption } from "../examples/upstream/calendar-caption";
import { CalendarWithTime } from "../examples/upstream/calendar-time";
import { CalendarBookedDates } from "../examples/upstream/calendar-booked-dates";
import { CalendarWeekNumbers } from "../examples/upstream/calendar-week-numbers";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import CalendarHijri from "../examples/calendar-hijri";
import { Calendar } from "@erbium/ui/components/calendar";
import Demo from "../examples/calendar-demo";

const meta = {
  title: "UI/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A calendar component that allows users to select a date or a range of dates.\n\n**Import:** `@erbium/ui/components/calendar`  \n\n**shadcn/ui page:** [Calendar](https://ui.shadcn.com/docs/components/base/calendar)\n\n### Usage\n\nSee the [React DayPicker](https://react-day-picker.js.org) documentation for more information.\n\n```tsx\nimport { Calendar } from "@erbium/ui/components/calendar"\n```\n\n```tsx\nconst [date, setDate] = React.useState<Date | undefined>(new Date())\n\nreturn (\n  <Calendar\n    mode="single"\n    selected={date}\n    onSelect={setDate}\n    className="rounded-lg border"\n  />\n)\n```\n\n### About\n\nThe `Calendar` component is built on top of [React DayPicker](https://react-day-picker.js.org).\n\n### Date Picker\n\nYou can use the `<Calendar>` component to build a date picker. See the [Date Picker](https://ui.shadcn.com/docs/components/base/date-picker) page for more information.\n\n### Changelog\n\nIf you\'re upgrading from a previous version of the `Calendar` component, you\'ll need to apply the following updates to add locale support:\n\nAdd `Locale` to your imports from `react-day-picker`:\n\nAdd the `locale` prop to the component\'s props:\n\nPass the `locale` prop to the `DayPicker` component:\n\nUpdate the `CalendarDayButton` component signature and pass `locale`:\n\nUse `locale?.code` in the date formatting:\n\nUpdate the `DayButton` component usage to pass the `locale` prop:\n\nReplace directional classes with logical properties for better RTL support:\n\nAfter applying these changes, you can use the `locale` prop to provide locale-specific formatting:\n\n```tsx\nimport { enUS } from "react-day-picker/locale"\n\n;<Calendar mode="single" selected={date} onSelect={setDate} locale={enUS} />\n```',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import * as React from "react";\n\nimport { Calendar } from "@erbium/ui/components/calendar";\n\nexport default function CalendarDemo() {\n  const [date, setDate] = React.useState<Date | undefined>(new Date());\n\n  return (\n    <Calendar\n      mode="single"\n      selected={date}\n      onSelect={setDate}\n      className="rounded-md border shadow-sm"\n      captionLayout="dropdown"\n    />\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A basic calendar component. We used `className="rounded-lg border"` to style the calendar.',
      },
      source: {
        code: 'import { Calendar } from "@erbium/ui/components/calendar";\n\nexport default function CalendarBasic() {\n  return <Calendar mode="single" className="rounded-lg border" />;\n}\n',
      },
    },
  },
  render: () => <CalendarBasic />,
};
export const BookedDates: Story = {
  parameters: {
    docs: {
      description: { story: "Disable and mark dates that are already booked." },

      source: {
        code: 'import * as React from "react";\n\nimport { Calendar } from "@erbium/ui/components/calendar";\nimport { Card, CardContent } from "@erbium/ui/components/card";\n\nexport function CalendarBookedDates() {\n  const [date, setDate] = React.useState<Date | undefined>(\n    new Date(new Date().getFullYear(), 0, 6),\n  );\n  const bookedDates = Array.from(\n    { length: 15 },\n    (_, i) => new Date(new Date().getFullYear(), 0, 12 + i),\n  );\n\n  return (\n    <Card className="mx-auto w-fit p-0">\n      <CardContent className="p-0">\n        <Calendar\n          mode="single"\n          defaultMonth={date}\n          selected={date}\n          onSelect={setDate}\n          disabled={bookedDates}\n          modifiers={{\n            booked: bookedDates,\n          }}\n          modifiersClassNames={{\n            booked: "[&>button]:line-through opacity-100",\n          }}\n        />\n      </CardContent>\n    </Card>\n  );\n}\n',
      },
    },
  },
  render: () => <CalendarBookedDates />,
};
export const WeekNumbers: Story = {
  parameters: {
    docs: {
      description: { story: "Use `showWeekNumber` to show week numbers." },
      source: {
        code: 'import * as React from "react";\n\nimport { Calendar } from "@erbium/ui/components/calendar";\nimport { Card, CardContent } from "@erbium/ui/components/card";\n\nexport function CalendarWeekNumbers() {\n  const [date, setDate] = React.useState<Date | undefined>(\n    new Date(new Date().getFullYear(), 0, 12),\n  );\n\n  return (\n    <Card className="mx-auto w-fit p-0">\n      <CardContent className="p-0">\n        <Calendar\n          mode="single"\n          defaultMonth={date}\n          selected={date}\n          onSelect={setDate}\n          showWeekNumber\n        />\n      </CardContent>\n    </Card>\n  );\n}\n',
      },
    },
  },
  render: () => <CalendarWeekNumbers />,
};

export const Presets: Story = {
  parameters: {
    docs: {
      description: { story: "Choose a date using preset buttons." },

      source: {
        code: 'import * as React from "react";\nimport { addDays } from "date-fns";\n\nimport { Button } from "@erbium/ui/components/button";\nimport { Calendar } from "@erbium/ui/components/calendar";\nimport { Card, CardContent, CardFooter } from "@erbium/ui/components/card";\n\nexport function CalendarWithPresets() {\n  const [date, setDate] = React.useState<Date | undefined>(\n    new Date(new Date().getFullYear(), 1, 12),\n  );\n  const [currentMonth, setCurrentMonth] = React.useState<Date>(\n    new Date(new Date().getFullYear(), new Date().getMonth(), 1),\n  );\n\n  return (\n    <Card className="mx-auto w-fit max-w-[300px]" size="sm">\n      <CardContent>\n        <Calendar\n          mode="single"\n          selected={date}\n          onSelect={setDate}\n          month={currentMonth}\n          onMonthChange={setCurrentMonth}\n          fixedWeeks\n          className="p-0 [--cell-size:--spacing(9.5)]"\n        />\n      </CardContent>\n      <CardFooter className="flex flex-wrap gap-2 border-t">\n        {[\n          { label: "Today", value: 0 },\n          { label: "Tomorrow", value: 1 },\n          { label: "In 3 days", value: 3 },\n          { label: "In a week", value: 7 },\n          { label: "In 2 weeks", value: 14 },\n        ].map((preset) => (\n          <Button\n            key={preset.value}\n            variant="outline"\n            size="sm"\n            className="flex-1"\n            onClick={() => {\n              const newDate = addDays(new Date(), preset.value);\n              setDate(newDate);\n              setCurrentMonth(new Date(newDate.getFullYear(), newDate.getMonth(), 1));\n            }}\n          >\n            {preset.label}\n          </Button>\n        ))}\n      </CardFooter>\n    </Card>\n  );\n}\n',
      },
    },
  },
  render: () => <CalendarWithPresets />,
};
export const Hijri: Story = {
  name: "Persian / Hijri / Jalali Calendar",
  parameters: {
    docs: {
      description: {
        story:
          "To use the Persian calendar, edit `components/ui/calendar.tsx` and replace `react-day-picker` with `react-day-picker/persian`.",
      },
      source: {
        code: 'import * as React from "react";\nimport { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";\nimport { Button } from "@erbium/ui/components/button";\n\nconst monthFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {\n  month: "long",\n  year: "numeric",\n});\nconst monthKeyFormatter = new Intl.DateTimeFormat("en-US-u-ca-persian", {\n  month: "numeric",\n  year: "numeric",\n});\nconst dayFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { day: "numeric" });\nconst weekDays = ["ش", "ی", "د", "س", "چ", "پ", "ج"];\n\nfunction moveDay(date: Date, amount: number) {\n  const next = new Date(date);\n  next.setDate(next.getDate() + amount);\n  return next;\n}\n\nfunction getMonthDays(anchor: Date) {\n  const key = monthKeyFormatter.format(anchor);\n  let first = new Date(anchor);\n  while (monthKeyFormatter.format(moveDay(first, -1)) === key) first = moveDay(first, -1);\n  const days: Date[] = [];\n  for (let date = first; monthKeyFormatter.format(date) === key; date = moveDay(date, 1)) {\n    days.push(date);\n  }\n  return days;\n}\n\nexport default function CalendarHijri() {\n  const [anchor, setAnchor] = React.useState(() => new Date());\n  const [selected, setSelected] = React.useState<Date>();\n  const days = getMonthDays(anchor);\n  const first = days[0];\n  const offset = first ? (first.getDay() + 1) % 7 : 0;\n\n  return (\n    <div dir="rtl" className="w-72 rounded-lg border p-3 font-sans">\n      <div className="mb-3 flex items-center justify-between">\n        <Button\n          aria-label="ماه قبل"\n          size="icon-sm"\n          variant="ghost"\n          onClick={() => first && setAnchor(moveDay(first, -10))}\n        >\n          <ChevronRightIcon />\n        </Button>\n        <span className="text-sm font-medium">{monthFormatter.format(anchor)}</span>\n        <Button\n          aria-label="ماه بعد"\n          size="icon-sm"\n          variant="ghost"\n          onClick={() => first && setAnchor(moveDay(first, 35))}\n        >\n          <ChevronLeftIcon />\n        </Button>\n      </div>\n      <div className="grid grid-cols-7 text-center text-sm">\n        {weekDays.map((day, index) => (\n          <span className="py-2 text-muted-foreground" key={index}>\n            {day}\n          </span>\n        ))}\n        {Array.from({ length: offset }, (_, index) => (\n          <span key={`empty-${index}`} />\n        ))}\n        {days.map((date) => {\n          const active = selected?.toDateString() === date.toDateString();\n          return (\n            <Button\n              aria-label={new Intl.DateTimeFormat("fa-IR-u-ca-persian", {\n                dateStyle: "full",\n              }).format(date)}\n              aria-pressed={active}\n              className="size-9 rounded-md"\n              key={date.toISOString()}\n              size="icon-sm"\n              variant={active ? "default" : "ghost"}\n              onClick={() => setSelected(date)}\n            >\n              {dayFormatter.format(date)}\n            </Button>\n          );\n        })}\n      </div>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <CalendarHijri />,
};

export const SelectedDateWithTimezone: Story = {
  name: "Selected Date (With TimeZone)",
  parameters: {
    docs: {
      description: {
        story:
          "The Calendar component accepts a `timeZone` prop to ensure dates are displayed and selected in the user's local timezone.\n\n**Note:** If you notice a selected date offset (for example, selecting the 20th highlights the 19th), make sure the `timeZone` prop is set to the user's local timezone.\n\n**Why client-side?** The timezone is detected using `Intl.DateTimeFormat().resolvedOptions().timeZone` inside a `useEffect` to ensure compatibility with server-side rendering. Detecting the timezone during render would cause hydration mismatches, as the server and client may be in different timezones.",
      },
      source: {
        code: 'import * as React from "react";\nimport { Calendar } from "@erbium/ui/components/calendar";\n\nexport default function CalendarTimezone() {\n  const [date, setDate] = React.useState<Date>();\n  const [timeZone, setTimeZone] = React.useState<string>();\n\n  React.useEffect(() => {\n    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);\n  }, []);\n\n  return (\n    <Calendar\n      className="rounded-lg border"\n      mode="single"\n      onSelect={setDate}\n      selected={date}\n      timeZone={timeZone}\n    />\n  );\n}\n',
      },
    },
  },
  render: () => <CalendarTimezone />,
};

export const RangeCalendar: Story = {
  parameters: {
    docs: {
      description: { story: 'Use the `mode="range"` prop to enable range selection.' },
      source: {
        code: 'import * as React from "react";\nimport { addDays } from "date-fns";\nimport { type DateRange } from "react-day-picker";\n\nimport { Calendar } from "@erbium/ui/components/calendar";\n\nexport function CalendarRange() {\n  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({\n    from: new Date(new Date().getFullYear(), 0, 12),\n    to: addDays(new Date(new Date().getFullYear(), 0, 12), 30),\n  });\n\n  return (\n    <Calendar\n      mode="range"\n      defaultMonth={dateRange?.from}\n      selected={dateRange}\n      onSelect={setDateRange}\n      numberOfMonths={2}\n      className="rounded-lg border"\n    />\n  );\n}\n',
      },
    },
  },
  render: () => <CalendarRange />,
};

export const MonthAndYearSelector: Story = {
  parameters: {
    docs: {
      description: { story: 'Use `captionLayout="dropdown"` to show month and year dropdowns.' },
      source: {
        code: 'import { Calendar } from "@erbium/ui/components/calendar";\n\nexport function CalendarCaption() {\n  return <Calendar mode="single" captionLayout="dropdown" className="rounded-lg border" />;\n}\n',
      },
    },
  },
  render: () => <CalendarCaption />,
};

export const DateAndTimePicker: Story = {
  parameters: {
    docs: {
      description: { story: "Select both a date and a time." },

      source: {
        code: 'import * as React from "react";\nimport { Clock2Icon } from "lucide-react";\n\nimport { Calendar } from "@erbium/ui/components/calendar";\nimport { Card, CardContent, CardFooter } from "@erbium/ui/components/card";\nimport { Field, FieldGroup, FieldLabel } from "@erbium/ui/components/field";\nimport { InputGroup, InputGroupAddon, InputGroupInput } from "@erbium/ui/components/input-group";\n\nexport function CalendarWithTime() {\n  const [date, setDate] = React.useState<Date | undefined>(\n    new Date(new Date().getFullYear(), new Date().getMonth(), 12),\n  );\n\n  return (\n    <Card size="sm" className="mx-auto w-fit">\n      <CardContent>\n        <Calendar mode="single" selected={date} onSelect={setDate} className="p-0" />\n      </CardContent>\n      <CardFooter className="border-t bg-card">\n        <FieldGroup>\n          <Field>\n            <FieldLabel htmlFor="time-from">Start Time</FieldLabel>\n            <InputGroup>\n              <InputGroupInput\n                id="time-from"\n                type="time"\n                step="1"\n                defaultValue="10:30:00"\n                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"\n              />\n              <InputGroupAddon>\n                <Clock2Icon className="text-muted-foreground" />\n              </InputGroupAddon>\n            </InputGroup>\n          </Field>\n          <Field>\n            <FieldLabel htmlFor="time-to">End Time</FieldLabel>\n            <InputGroup>\n              <InputGroupInput\n                id="time-to"\n                type="time"\n                step="1"\n                defaultValue="12:30:00"\n                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"\n              />\n              <InputGroupAddon>\n                <Clock2Icon className="text-muted-foreground" />\n              </InputGroupAddon>\n            </InputGroup>\n          </Field>\n        </FieldGroup>\n      </CardFooter>\n    </Card>\n  );\n}\n',
      },
    },
  },
  render: () => <CalendarWithTime />,
};

export const CustomCellSize: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Customize calendar cell size with the `--cell-size` CSS variable, including responsive values.",
      },
      source: {
        code: '<Calendar mode="single" className="rounded-lg border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]" />',
      },
    },
  },
  render: () => (
    <Calendar
      mode="single"
      className="rounded-lg border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]"
    />
  ),
};
