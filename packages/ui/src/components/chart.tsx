import { Chart as TanStackChart } from "@tanstack/charts/react";
import type { ChartProps as TanStackChartProps } from "@tanstack/charts/react";
import type { ChartValue } from "@tanstack/charts";
import { cn } from "../lib/utils";

/** Render a TanStack Charts definition. Create marks with `@tanstack/charts`. */
export function Chart<
  TDatum,
  TXValue extends ChartValue = ChartValue,
  TYValue extends ChartValue = ChartValue,
>({ className, ...props }: TanStackChartProps<TDatum, TXValue, TYValue>) {
  return <TanStackChart className={cn("erbium-chart", className)} {...props} />;
}
export type ChartProps = TanStackChartProps;
