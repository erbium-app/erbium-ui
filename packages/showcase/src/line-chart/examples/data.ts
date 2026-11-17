import type { ChartValue } from "@tanstack/charts";
import { formatChartIndex } from "@erbium/ui/charts/chart";

export const visitors = [
  { desktop: 186, mobile: 80, month: "January" },
  { desktop: 305, mobile: 200, month: "February" },
  { desktop: 237, mobile: 120, month: "March" },
  { desktop: 73, mobile: 190, month: "April" },
  { desktop: 209, mobile: 130, month: "May" },
  { desktop: 214, mobile: 140, month: "June" },
];

export const devices = [
  { key: "desktop", label: "Desktop" },
  { key: "mobile", label: "Mobile" },
] as const;

export const shortMonth = (value: ChartValue) => formatChartIndex(value).slice(0, 3);
