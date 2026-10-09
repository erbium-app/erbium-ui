import { Chart as TanStackChart } from "@tanstack/charts/react";
import type { ChartProps as TanStackChartProps } from "@tanstack/charts/react";
import type { ChartValue } from "@tanstack/charts";
import { cn } from "../lib/utils";

export function Chart<
  TDatum,
  TXValue extends ChartValue = ChartValue,
  TYValue extends ChartValue = ChartValue,
>({ className, ...props }: TanStackChartProps<TDatum, TXValue, TYValue>) {
  return <TanStackChart className={cn("erbium-chart text-metadata", className)} {...props} />;
}
export type ChartProps = TanStackChartProps;
