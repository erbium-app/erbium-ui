import * as React from "react";
import { Chart as TanStackChart } from "@tanstack/charts/react";
import type { ChartProps as TanStackChartProps } from "@tanstack/charts/react";
import { cn } from "../lib/utils";

type ChartTheme = "light" | "dark";

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & ({ color?: string; theme?: never } | { color?: never; theme: Record<ChartTheme, string> })
>;

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children?: React.ReactNode;
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn("flex min-h-0 w-full justify-center text-xs", className)}
        {...props}
      >
        {children}
      </div>
    </ChartContext.Provider>
  );
}

/**
 * Kept as a compatibility export for shadcn chart compositions.
 *
 * TanStack Charts receives colors and theme tokens through its chart
 * definition, so chart-specific CSS is no longer generated at runtime.
 * Shared tokens such as `--chart-1` through `--chart-5` live in theme.css.
 */
function ChartStyle(_props: { id: string; config: ChartConfig }) {
  return null;
}

/** TanStack Charts' built-in interactive tooltip is enabled by the chart definition. */
function ChartTooltip() {
  return null;
}

/** Compatibility slot for shadcn chart compositions using an external tooltip body. */
function ChartTooltipContent({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

/** TanStack Charts renders legends from chart marks; this remains a composition slot. */
function ChartLegend() {
  return null;
}

function ChartLegendContent({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

export type ChartProps = TanStackChartProps;
export const Chart = TanStackChart;

export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  useChart,
};
