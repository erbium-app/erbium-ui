import * as React from "react";
import { cell, defineChart } from "@tanstack/charts";
import type { ChartValue } from "@tanstack/charts";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleOrdinal } from "@tanstack/charts/scales/ordinal";
import {
  Chart,
  ChartRoot,
  chartTheme,
  chartTooltip,
  formatChartIndex,
  formatChartNumber,
} from "./chart";
import type { ChartFrameProps } from "./chart";

type HeatmapDatum<TX extends string, TY extends string, TValue extends string> = Record<
  TX | TY,
  ChartValue
> &
  Record<TValue, number | null>;

type HeatmapChartProps<
  TX extends string,
  TY extends string,
  TValue extends string,
  TDatum extends HeatmapDatum<TX, TY, TValue>,
> = Omit<ChartFrameProps, "hiddenSeries" | "defaultHiddenSeries" | "onHiddenSeriesChange"> & {
  /** One row per cell. */
  data: readonly TDatum[];
  /** The field for columns, such as `"hour"`. */
  x: TX;
  /** The field for rows, such as `"weekday"`. */
  y: TY;
  /** The numeric field that sets each cell's strength. */
  value: TValue;
  /** The color at full strength. Defaults to `--chart-1`. */
  color?: string;
  /** Column order. Defaults to data order. */
  columns?: readonly ChartValue[];
  /** Row order. Defaults to data order. */
  rows?: readonly ChartValue[];
};

/** Strengths in percent of `color`, from the weakest level to the strongest. */
const levelStrength = [12, 30, 50, 72, 100] as const;
const levels = levelStrength.map((_, level) => level);

/** Mixes the level into the surface rather than interpolating colors, so cells follow light and dark themes. */
const levelFill = (color: string, level: number) =>
  `color-mix(in oklab, ${color} ${levelStrength[level] ?? 100}%, var(--background))`;

const levelOf = (amount: number, min: number, max: number) =>
  max === min
    ? levelStrength.length - 1
    : Math.min(
        levelStrength.length - 1,
        Math.floor(((amount - min) / (max - min)) * levelStrength.length),
      );

/** One cell, with its fields resolved from the caller's row. */
interface HeatmapCell {
  amount: number;
  level: number;
  x: ChartValue;
  y: ChartValue;
}

const bandScale = (domain: readonly ChartValue[] | undefined) =>
  domain ? () => scaleBand<ChartValue>().domain(domain) : scaleBand;

/** Shows intensity across two categories, such as activity by weekday and hour. */
const HeatmapChart = <
  const TX extends string,
  const TY extends string,
  const TValue extends string,
  TDatum extends HeatmapDatum<TX, TY, TValue>,
>({
  data,
  x,
  y,
  value,
  color = "var(--chart-1)",
  columns,
  rows,
  ariaLabel,
  height = 240,
  initialWidth,
  className,
  legend = true,
  tooltip = true,
  format,
  locale,
  emptyMessage,
}: HeatmapChartProps<TX, TY, TValue, TDatum>) => {
  const definition = React.useMemo(() => {
    const filled = data.flatMap((datum): Omit<HeatmapCell, "level">[] => {
      const amount = datum[value];

      return amount === null ? [] : [{ amount, x: datum[x], y: datum[y] }];
    });

    const amounts = filled.map((item) => item.amount);
    const min = Math.min(...amounts);
    const max = Math.max(...amounts);
    const cells = filled.map((item) => ({ ...item, level: levelOf(item.amount, min, max) }));

    return defineChart({
      // An ordinal scale maps each strength level to its mixed color; a continuous
      // scale would have to interpolate CSS variables, which it cannot.
      color: {
        scale: scaleOrdinal(
          levels,
          levels.map((level) => levelFill(color, level)),
        ),
      },
      focus: "nearest",
      marks: [cell(cells, { color: "level", inset: 1.5, radius: 3, x: "x", y: "y" })],
      scales: {
        x: { axis: { line: false, ticks: { line: false } }, scale: bandScale(columns) },
        y: { axis: { line: false, ticks: { line: false } }, scale: bandScale(rows) },
      },
      theme: chartTheme,
      tooltip: tooltip
        ? {
            ...chartTooltip,
            content: ([point]) =>
              point === undefined
                ? { rows: [] }
                : {
                    rows: [
                      {
                        color: levelFill(color, point.datum.level),
                        label: formatChartIndex(point.datum.x, locale),
                        value: formatChartNumber(point.datum.amount, format),
                      },
                    ],
                    title: formatChartIndex(point.datum.y, locale),
                  },
          }
        : false,
    });
  }, [color, columns, data, format, locale, rows, tooltip, value, x, y]);

  return (
    <ChartRoot
      ariaLabel={ariaLabel}
      className={className}
      empty={data.length === 0}
      emptyMessage={emptyMessage}
      height={height}
    >
      <Chart
        ariaLabel={ariaLabel}
        definition={definition}
        height={height}
        initialWidth={initialWidth}
      />
      {legend ? (
        <div
          aria-hidden
          data-slot="chart-scale"
          className="flex items-center gap-1.5 text-metadata text-muted-foreground"
        >
          Less
          {levelStrength.map((strength, level) => (
            <span
              key={strength}
              className="h-3 w-5 rounded-sm"
              style={{ backgroundColor: levelFill(color, level) }}
            />
          ))}
          More
        </div>
      ) : null}
    </ChartRoot>
  );
};

export { HeatmapChart };

export type { HeatmapChartProps };
