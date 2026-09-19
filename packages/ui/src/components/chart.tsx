import * as React from "react";
import { Chart as TanStackChart } from "@tanstack/charts/react";
import type { ChartProps as TanStackChartProps } from "@tanstack/charts/react";
import { cn } from "../lib/utils";

const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
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
        <ChartStyle id={chartId} config={config} />
        {children}
      </div>
    </ChartContext.Provider>
  );
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, itemConfig]) => itemConfig.theme ?? itemConfig.color,
  );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) =>
              `${prefix} [data-chart=${id}] {\n${colorConfig
                .map(([key, itemConfig]) => {
                  const color =
                    itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ?? itemConfig.color;
                  return color ? `  --color-${key}: ${color};` : null;
                })
                .filter(Boolean)
                .join("\n")}\n}`,
          )
          .join("\n"),
      }}
    />
  );
};

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
