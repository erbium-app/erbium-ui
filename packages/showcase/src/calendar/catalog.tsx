import type { Meta, StoryObj } from "../types";

import { Calendar } from "@erbium/ui/components/calendar";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/calendar-demo.tsx?raw";

import BasicExample from "./variants/basic";

import BasicSource from "./examples/calendar-basic.tsx?raw";

import RangeCalendarExample from "./variants/range-calendar";

import RangeCalendarSource from "./examples/calendar-range.tsx?raw";

import MultipleExample from "./variants/multiple";

import MultipleSource from "./examples/calendar-multiple.tsx?raw";

import MonthAndYearSelectorExample from "./variants/month-and-year-selector";

import MonthAndYearSelectorSource from "./examples/calendar-caption.tsx?raw";

import BookedDatesExample from "./variants/booked-dates";

import BookedDatesSource from "./examples/calendar-booked-dates.tsx?raw";

import WeekNumbersExample from "./variants/week-numbers";

import WeekNumbersSource from "./examples/calendar-week-numbers.tsx?raw";

import PresetsExample from "./variants/presets";

import PresetsSource from "./examples/calendar-presets.tsx?raw";

import DateAndTimePickerExample from "./variants/date-and-time-picker";

import DateAndTimePickerSource from "./examples/calendar-time.tsx?raw";

import CustomDaysExample from "./variants/custom-days";

import CustomDaysSource from "./examples/calendar-custom-days.tsx?raw";

import PersianExample from "./variants/persian";

import PersianSource from "./examples/calendar-persian.tsx?raw";

import SelectedDateWithTimezoneExample from "./variants/selected-date-with-timezone";

import SelectedDateWithTimezoneSource from "./examples/calendar-timezone.tsx?raw";

const meta = {
  component: Calendar,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("calendar"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Calendar>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{
  showOutsideDays: boolean;
  showWeekNumber: boolean;
  fixedWeeks: boolean;
  numberOfMonths: number;
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  captionLayout: "label" | "dropdown" | "dropdown-months" | "dropdown-years";
}> = {
  argTypes: {
    captionLayout: {
      control: "select",
      options: ["label", "dropdown", "dropdown-months", "dropdown-years"],
    },
    fixedWeeks: { control: "boolean" },
    numberOfMonths: { control: { max: 3, min: 1, type: "number" } },
    showOutsideDays: { control: "boolean" },
    showWeekNumber: { control: "boolean" },
    weekStartsOn: { control: "select", options: [0, 1, 2, 3, 4, 5, 6] },
  },
  args: PlaygroundDefaults,
  parameters: {
    docs: {
      description: { story: variantDocumentation("calendar", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("calendar", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Basic: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("calendar", "basic") },
      source: { code: BasicSource },
    },
  },
  render: BasicExample,
};

export const RangeCalendar: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("calendar", "range-calendar") },
      source: { code: RangeCalendarSource },
    },
  },
  render: RangeCalendarExample,
};

export const Multiple: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("calendar", "multiple") },
      source: { code: MultipleSource },
    },
  },
  render: MultipleExample,
};

export const MonthAndYearSelector: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("calendar", "month-and-year-selector") },
      source: { code: MonthAndYearSelectorSource },
    },
  },
  render: MonthAndYearSelectorExample,
};

export const BookedDates: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("calendar", "booked-dates") },
      source: { code: BookedDatesSource },
    },
  },
  render: BookedDatesExample,
};

export const WeekNumbers: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("calendar", "week-numbers") },
      source: { code: WeekNumbersSource },
    },
  },
  render: WeekNumbersExample,
};

export const Presets: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("calendar", "presets") },
      source: { code: PresetsSource },
    },
  },
  render: PresetsExample,
};

export const DateAndTimePicker: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("calendar", "date-and-time-picker") },
      source: { code: DateAndTimePickerSource },
    },
  },
  render: DateAndTimePickerExample,
};

export const CustomDays: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("calendar", "custom-days") },
      source: { code: CustomDaysSource },
    },
  },
  render: CustomDaysExample,
};

export const Persian: Story = {
  name: "Persian (Jalali) Calendar",
  parameters: {
    docs: {
      description: { story: variantDocumentation("calendar", "persian") },
      source: { code: PersianSource },
    },
  },
  render: PersianExample,
};

export const SelectedDateWithTimezone: Story = {
  name: "Selected Date (With TimeZone)",
  parameters: {
    docs: {
      description: { story: variantDocumentation("calendar", "selected-date-with-timezone") },
      source: { code: SelectedDateWithTimezoneSource },
    },
  },
  render: SelectedDateWithTimezoneExample,
};
