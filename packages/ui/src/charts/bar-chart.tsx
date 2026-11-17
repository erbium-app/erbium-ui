import * as React from "react";
import { barX, barY, defineChart, group, stack } from "@tanstack/charts";
import type { ChartValue } from "@tanstack/charts";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import {
  Chart,
  ChartLegend,
  ChartRoot,
  chartColorScale,
  chartTheme,
  chartValueTooltip,
  foldChartSeries,
  formatChartNumber,
  useChartSeries,
} from "./chart";
import type { ChartDatum, ChartFrameProps, ChartSeries } from "./chart";

type BarChartProps<
  TIndex extends string,
  TKey extends string,
  TDatum extends ChartDatum<TIndex, TKey>,
> = ChartFrameProps & {
  /** One row per category, with one numeric field per series. */
  data: readonly TDatum[];
  /** The field that names each category, such as `"month"`. */
  index: TIndex;
  /** The numeric fields to draw, in order. */
  series: readonly ChartSeries<TKey>[];
  /** Stacks the series instead of grouping them side by side. */
  stacked?: boolean;
  /** `horizontal` lists categories down the side, which fits long names. */
  orientation?: "vertical" | "horizontal";
  /** Shows gridlines along the value axis. Defaults to on. */
  grid?: boolean;
  /** Shows the axes. Defaults to on. */
  axis?: boolean;
  /** Formats category labels and the tooltip heading. */
  indexFormat?: (value: ChartValue) => string;
};

/** Compares values across categories, grouped, stacked, or horizontal. */
const BarChart = <
  const TIndex extends string,
  const TKey extends string,
  TDatum extends ChartDatum<TIndex, TKey>,
>({
  data,
  index,
  series,
  stacked = false,
  orientation = "vertical",
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
}: BarChartProps<TIndex, TKey, TDatum>) => {
  const { all, hidden, toggle, visible } = useChartSeries(series, {
    defaultHiddenSeries,
    hiddenSeries,
    onHiddenSeriesChange,
  });

  const showLegend = legend ?? series.length > 1;

  const definition = React.useMemo(() => {
    const rows = foldChartSeries(data, index, visible);
    const horizontal = orientation === "horizontal";
    const layout = stacked ? stack() : group({ padding: 0.12 });
    // Stacked bars round only the outer end of each stack, so segments meet flush.
    const radius = stacked ? { end: 4, stack: "outer" as const } : 4;

    const indexAxis = {
      axis: axis ? { ticks: { format: indexFormat } } : (false as const),
      scale: scaleBand,
    };

    const valueAxis = {
      axis: axis
        ? { ticks: { format: (value: number) => formatChartNumber(value, format) } }
        : (false as const),
      grid,
      nice: true,
      scale: scaleLinear,
    };

    return defineChart({
      color: { scale: chartColorScale(all) },
      focus: horizontal ? "group-y" : "group-x",
      marks: [
        horizontal
          ? barX(rows, {
              color: "series",
              inset: 1,
              layout,
              radius,
              x: "value",
              y: "index",
              z: "series",
            })
          : barY(rows, {
              color: "series",
              inset: 1,
              layout,
              radius,
              x: "index",
              y: "value",
              z: "series",
            }),
      ],
      scales: horizontal ? { x: valueAxis, y: indexAxis } : { x: indexAxis, y: valueAxis },
      theme: chartTheme,
      tooltip: tooltip
        ? chartValueTooltip({
            format,
            indexFormat,
            locale,
            valueAxis: horizontal ? "x" : "y",
          })
        : false,
    });
  }, [
    all,
    axis,
    data,
    format,
    grid,
    index,
    indexFormat,
    locale,
    orientation,
    stacked,
    tooltip,
    visible,
  ]);

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

export { BarChart };

export type { BarChartProps };
