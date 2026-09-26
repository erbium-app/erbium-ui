import type { Meta, StoryObj } from "@storybook/react-vite";
import { Calendar } from "@erbium/ui/components/calendar";
import Demo from "./examples/calendar-demo";

const meta = {
  title: "UI/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A calendar component that allows users to select a date or a range of dates.\n\n**Import:** `@erbium/ui/components/calendar`  \n\n**shadcn/ui page:** [Calendar](https://ui.shadcn.com/docs/components/base/calendar)\n\n### Usage\n\nSee the [React DayPicker](https://react-day-picker.js.org) documentation for more information.\n\n```tsx\nimport { Calendar } from "@erbium/ui/components/calendar"\n```\n\n```tsx\nconst [date, setDate] = React.useState<Date | undefined>(new Date())\n\nreturn (\n  <Calendar\n    mode="single"\n    selected={date}\n    onSelect={setDate}\n    className="rounded-lg border"\n  />\n)\n```\n\n### About\n\nThe `Calendar` component is built on top of [React DayPicker](https://react-day-picker.js.org).\n\n### Date Picker\n\nYou can use the `<Calendar>` component to build a date picker. See the [Date Picker](https://ui.shadcn.com/docs/components/base/date-picker) page for more information.\n\n### Persian / Hijri / Jalali Calendar\n\nTo use the Persian calendar, edit `components/ui/calendar.tsx` and replace `react-day-picker` with `react-day-picker/persian`.\n\nstyleName="base-nova"\n\nname="calendar-hijri"\n\ntitle="Persian / Hijri / Jalali Calendar"\n\ndescription="A Persian calendar."\n\npreviewClassName="h-[400px]"\n\n/>\n\n### Selected Date (With TimeZone)\n\nThe Calendar component accepts a `timeZone` prop to ensure dates are displayed and selected in the user\'s local timezone.\n\n**Note:** If you notice a selected date offset (for example, selecting the 20th highlights the 19th), make sure the `timeZone` prop is set to the user\'s local timezone.\n\n**Why client-side?** The timezone is detected using `Intl.DateTimeFormat().resolvedOptions().timeZone` inside a `useEffect` to ensure compatibility with server-side rendering. Detecting the timezone during render would cause hydration mismatches, as the server and client may be in different timezones.\n\n```tsx\nexport function CalendarWithTimezone() {\n  const [date, setDate] = React.useState<Date | undefined>(undefined)\n  const [timeZone, setTimeZone] = React.useState<string | undefined>(undefined)\n\n  React.useEffect(() => {\n    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone)\n  }, [])\n\n  return (\n    <Calendar\n      mode="single"\n      selected={date}\n      onSelect={setDate}\n      timeZone={timeZone}\n    />\n  )\n}\n```\n\n### Basic\n\nA basic calendar component. We used `className="rounded-lg border"` to style the calendar.\n\nstyleName="base-nova"\n\nname="calendar-basic"\n\npreviewClassName="h-96"\n\n/>\n\n### Range Calendar\n\nUse the `mode="range"` prop to enable range selection.\n\nstyleName="base-nova"\n\nname="calendar-range"\n\npreviewClassName="h-[36rem] md:h-96"\n\n/>\n\n### Month and Year Selector\n\nUse `captionLayout="dropdown"` to show month and year dropdowns.\n\nstyleName="base-nova"\n\nname="calendar-caption"\n\npreviewClassName="h-96"\n\n/>\n\n### Presets\n\nstyleName="base-nova"\n\nname="calendar-presets"\n\npreviewClassName="h-[650px]"\n\n/>\n\n### Date and Time Picker\n\nstyleName="base-nova"\n\nname="calendar-time"\n\npreviewClassName="h-[600px]"\n\n/>\n\n### Booked dates\n\nstyleName="base-nova"\n\nname="calendar-booked-dates"\n\npreviewClassName="h-96"\n\n/>\n\n### Custom Cell Size\n\nstyleName="base-nova"\n\nname="calendar-custom-days"\n\ntitle="Custom Cell Size"\n\ndescription="A calendar with custom cell size that\'s responsive."\n\nclassName="**:[.preview]:h-[560px]"\n\n/>\n\nYou can customize the size of calendar cells using the `--cell-size` CSS variable. You can also make it responsive by using breakpoint-specific values:\n\nOr use fixed values:\n\n```tsx\n<Calendar\n  mode="single"\n  selected={date}\n  onSelect={setDate}\n  className="rounded-lg border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]"\n/>\n```\n\n```tsx\n<Calendar\n  mode="single"\n  selected={date}\n  onSelect={setDate}\n  className="rounded-lg border [--cell-size:2.75rem] md:[--cell-size:3rem]"\n/>\n```\n\n### Week Numbers\n\nUse `showWeekNumber` to show week numbers.\n\nstyleName="base-nova"\n\nname="calendar-week-numbers"\n\npreviewClassName="h-96"\n\n/>\n\n### Changelog\n\nIf you\'re upgrading from a previous version of the `Calendar` component, you\'ll need to apply the following updates to add locale support:\n\nAdd `Locale` to your imports from `react-day-picker`:\n\nAdd the `locale` prop to the component\'s props:\n\nPass the `locale` prop to the `DayPicker` component:\n\nUpdate the `CalendarDayButton` component signature and pass `locale`:\n\nUse `locale?.code` in the date formatting:\n\nUpdate the `DayButton` component usage to pass the `locale` prop:\n\nReplace directional classes with logical properties for better RTL support:\n\nAfter applying these changes, you can use the `locale` prop to provide locale-specific formatting:\n\n```tsx\nimport { enUS } from "react-day-picker/locale"\n\n;<Calendar mode="single" selected={date} onSelect={setDate} locale={enUS} />\n```',
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
