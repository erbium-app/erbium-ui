import * as React from "react";
import { defineChart, dot } from "@tanstack/charts";
import type { ChartValue } from "@tanstack/charts";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import {
  Chart,
  ChartLegend,
  ChartRoot,
  chartColorScale,
  chartTheme,
  chartTooltip,
  formatChartIndex,
  formatChartNumber,
  useChartSeries,
} from "./chart";
import type { ChartFormat, ChartFrameProps, ChartSeries } from "./chart";

type ScatterDatum<TX extends string, TY extends string, TGroup extends string> = Record<
  TX | TY,
  number
> &
  Record<TGroup, ChartValue>;

type ScatterChartProps<
  TX extends string,
  TY extends string,
  TGroup extends string,
  TDatum extends ScatterDatum<TX, TY, TGroup>,
> = ChartFrameProps & {
  /** One row per point. */
  data: readonly TDatum[];
  /** The numeric field on the x axis. */
  x: TX;
  /** The numeric field on the y axis. */
  y: TY;
  /** The field that groups points into colored series. */
  group?: TGroup;
  /** Labels and colors by group value. Defaults to the groups in data order. */
  series?: readonly ChartSeries[];
  /** Dot radius in pixels. Defaults to 4. */
  radius?: number;
  /** Formats x-axis values. `format` covers the y axis. */
  xFormat?: ChartFormat;
  /** Names the x axis. Defaults to the x field. */
  xLabel?: string;
  /** Names the y axis. Defaults to the y field. */
  yLabel?: string;
  /** Shows gridlines on both axes. Defaults to on. */
  grid?: boolean;
};

/** One point, with its fields resolved from the caller's row. */
interface ScatterPoint {
  group: string;
  x: number;
  y: number;
}

/** Shows the relationship between two measures, optionally grouped. */
const ScatterChart = <
  const TX extends string,
  const TY extends string,
  const TGroup extends string = never,
  TDatum extends ScatterDatum<TX, TY, TGroup> = ScatterDatum<TX, TY, TGroup>,
>({
  data,
  x,
  y,
  group,
  series,
  radius = 4,
  xFormat,
  xLabel = x,
  yLabel = y,
  grid = true,
  ariaLabel,
  height = 240,
  initialWidth,
  className,
  legend,
  tooltip = true,
  format,
  locale,
  emptyMessage,
  hiddenSeries,
  defaultHiddenSeries,
  onHiddenSeriesChange,
}: ScatterChartProps<TX, TY, TGroup, TDatum>) => {
  const points = React.useMemo(
    () =>
      data.map((datum): ScatterPoint => ({
        group: group === undefined ? ariaLabel : formatChartIndex(datum[group], locale),
        x: datum[x],
        y: datum[y],
      })),
    [ariaLabel, data, group, locale, x, y],
  );

  const groups = React.useMemo(
    () => series ?? [...new Set(points.map((point) => point.group))].map((key) => ({ key })),
    [points, series],
  );

  const { all, hidden, toggle, visible } = useChartSeries(groups, {
    defaultHiddenSeries,
    hiddenSeries,
    onHiddenSeriesChange,
  });

  const showLegend = legend ?? all.length > 1;

  const definition = React.useMemo(() => {
    const labels = new Map(all.map((item) => [item.key, item.label]));
    const shown = new Set(visible.map((item) => item.key));

    const rows = points
      .filter((point) => shown.has(point.group))
      .map((point) => ({ ...point, series: labels.get(point.group) ?? point.group }));

    const axisFor = (label: string, valueFormat: ChartFormat | undefined) => ({
      label,
      ticks: { format: (value: number) => formatChartNumber(value, valueFormat) },
    });

    return defineChart({
      color: { scale: chartColorScale(all) },
      focus: "nearest",
      marks: [dot(rows, { color: "series", fillOpacity: 0.8, r: radius, x: "x", y: "y" })],
      scales: {
        x: { axis: axisFor(xLabel, xFormat), grid, nice: true, scale: scaleLinear },
        y: { axis: axisFor(yLabel, format), grid, nice: true, scale: scaleLinear },
      },
      theme: chartTheme,
      tooltip: tooltip
        ? {
            ...chartTooltip,
            content: ([point]) =>
              point === undefined
                ? { rows: [] }
                : {
                    color: point.color,
                    rows: [
                      { label: xLabel, value: formatChartNumber(point.datum.x, xFormat) },
                      { label: yLabel, value: formatChartNumber(point.datum.y, format) },
                    ],
                    title: group === undefined ? "" : point.datum.series,
                  },
          }
        : false,
    });
  }, [all, format, grid, group, points, radius, tooltip, visible, xFormat, xLabel, yLabel]);

  return (
    <ChartRoot
      ariaLabel={ariaLabel}
      className={className}
      empty={data.length === 0}
      emptyMessage={emptyMessage}
      height={height}
      legend={
        showLegend ? (
          <ChartLegend series={all} hiddenSeries={hidden} onToggleSeries={toggle} />
        ) : null
      }
    >
      <Chart
        ariaLabel={ariaLabel}
        definition={definition}
        height={height}
        initialWidth={initialWidth}
      />
    </ChartRoot>
  );
};

export { ScatterChart };

export type { ScatterChartProps };
