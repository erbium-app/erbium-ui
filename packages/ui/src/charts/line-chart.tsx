import * as React from "react";
import { defineChart, lineY } from "@tanstack/charts";
import type { ChartValue } from "@tanstack/charts";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import {
  Chart,
  ChartLegend,
  ChartRoot,
  chartColorScale,
  chartCurves,
  chartIndexScale,
  chartTheme,
  chartValueTooltip,
  foldChartSeries,
  formatChartNumber,
  useChartSeries,
} from "./chart";
import type { ChartCurve, ChartDatum, ChartFrameProps, ChartIndexType, ChartSeries } from "./chart";

type LineChartProps<
  TIndex extends string,
  TKey extends string,
  TDatum extends ChartDatum<TIndex, TKey>,
> = ChartFrameProps & {
  /** One row per x value, with one numeric field per series. */
  data: readonly TDatum[];
  /** The field on the x axis, such as `"month"` or `"date"`. */
  index: TIndex;
  /** How the x field reads: categories, numbers, or UTC dates. Defaults to `category`. */
  indexType?: ChartIndexType;
  /** The numeric fields to draw, in order. */
  series: readonly ChartSeries<TKey>[];
  /** Defaults to `smooth`. */
  curve?: ChartCurve;
  /** Marks each value with a dot. */
  points?: boolean;
  /** Shows gridlines along the value axis. Defaults to on. */
  grid?: boolean;
  /** Shows the axes. Defaults to on. */
  axis?: boolean;
  /** Formats x-axis labels and the tooltip heading. */
  indexFormat?: (value: ChartValue) => string;
};

/** Shows change over a range, for one series or several that overlap. */
const LineChart = <
  const TIndex extends string,
  const TKey extends string,
  TDatum extends ChartDatum<TIndex, TKey>,
>({
  data,
  index,
  indexType = "category",
  series,
  curve = "smooth",
  points = false,
  grid = true,
  axis = true,
  indexFormat,
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
}: LineChartProps<TIndex, TKey, TDatum>) => {
  const { all, hidden, toggle, visible } = useChartSeries(series, {
    defaultHiddenSeries,
    hiddenSeries,
    onHiddenSeriesChange,
  });

  const showLegend = legend ?? series.length > 1;

  const definition = React.useMemo(
    () =>
      defineChart({
        color: { scale: chartColorScale(all) },
        focus: "group-x",
        marks: [
          lineY(foldChartSeries(data, index, visible), {
            color: "series",
            curve: chartCurves[curve],
            points,
            strokeWidth: 2,
            x: "index",
            y: "value",
            z: "series",
          }),
        ],
        scales: {
          x: {
            axis: axis ? { ticks: { format: indexFormat } } : false,
            scale: chartIndexScale(indexType),
          },
          y: {
            axis: axis
              ? { ticks: { format: (value: number) => formatChartNumber(value, format) } }
              : false,
            grid,
            nice: true,
            scale: scaleLinear,
          },
        },
        theme: chartTheme,
        tooltip: tooltip ? chartValueTooltip({ format, indexFormat, locale }) : false,
      }),
    [
      all,
      axis,
      curve,
      data,
      format,
      grid,
      index,
      indexFormat,
      indexType,
      locale,
      points,
      tooltip,
      visible,
    ],
  );

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

export { LineChart };

export type { LineChartProps };
