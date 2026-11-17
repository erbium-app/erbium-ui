import * as React from "react";
import { areaY, defineChart, lineY, stack } from "@tanstack/charts";
import type { ChartGradient, ChartValue } from "@tanstack/charts";
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
import type {
  ChartCurve,
  ChartDatum,
  ChartFrameProps,
  ChartIndexType,
  ChartRow,
  ChartSeries,
} from "./chart";

type AreaChartProps<
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
  /** Stacks the series so the top edge is their total. */
  stacked?: boolean;
  /** Defaults to `smooth`. */
  curve?: ChartCurve;
  /** `gradient` fades the fill toward the baseline; `solid` fills it evenly. Defaults to `gradient`. */
  fill?: "gradient" | "solid";
  /** Shows gridlines along the value axis. Defaults to on. */
  grid?: boolean;
  /** Shows the axes. Defaults to on. */
  axis?: boolean;
  /** Formats x-axis labels and the tooltip heading. */
  indexFormat?: (value: ChartValue) => string;
};

/** TanStack Charts scopes resource ids to each chart, so a fixed prefix cannot collide. */
const gradientPrefix = "erbium-area";

/** Shows a trend over a range where volume matters, with a fill under each line. */
const AreaChart = <
  const TIndex extends string,
  const TKey extends string,
  TDatum extends ChartDatum<TIndex, TKey>,
>({
  data,
  index,
  indexType = "category",
  series,
  stacked = false,
  curve = "smooth",
  fill = "gradient",
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
}: AreaChartProps<TIndex, TKey, TDatum>) => {
  const { all, hidden, toggle, visible } = useChartSeries(series, {
    defaultHiddenSeries,
    hiddenSeries,
    onHiddenSeriesChange,
  });

  const showLegend = legend ?? series.length > 1;

  const definition = React.useMemo(() => {
    const rows = foldChartSeries(data, index, visible);
    const seriesPosition = new Map(all.map((item, position) => [item.label, position]));

    const gradients: ChartGradient[] = all.map((item, position) => ({
      id: `${gradientPrefix}-${position}`,
      stops: [
        { color: item.color, offset: 0, opacity: 0.02 },
        { color: item.color, offset: 1, opacity: stacked ? 0.5 : 0.32 },
      ],
      x1: 0,
      x2: 0,
      y1: 1,
      y2: 0,
    }));

    const gradientFill = (row: ChartRow<TDatum>) =>
      `url(#${gradientPrefix}-${seriesPosition.get(row.series) ?? 0})`;

    return defineChart({
      color: { scale: chartColorScale(all) },
      focus: "group-x",
      gradients,
      marks: [
        // Without explicit endpoints, areaY stacks its series, so unstacked areas
        // span from zero to their own value.
        stacked
          ? areaY(rows, {
              color: "series",
              curve: chartCurves[curve],
              fill: fill === "gradient" ? gradientFill : undefined,
              fillOpacity: fill === "gradient" ? 1 : 0.24,
              layout: stack(),
              x: "index",
              y: "value",
              z: "series",
            })
          : areaY(rows, {
              color: "series",
              curve: chartCurves[curve],
              fill: fill === "gradient" ? gradientFill : undefined,
              fillOpacity: fill === "gradient" ? 1 : 0.24,
              x: "index",
              y1: 0,
              y2: "value",
              z: "series",
            }),
        // A stacked area's top edges come from the stack, so only unstacked areas get a line.
        ...(stacked
          ? []
          : [
              lineY(rows, {
                color: "series",
                curve: chartCurves[curve],
                strokeWidth: 2,
                x: "index",
                y: "value",
                z: "series",
              }),
            ]),
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
    });
  }, [
    all,
    axis,
    curve,
    data,
    fill,
    format,
    grid,
    index,
    indexFormat,
    indexType,
    locale,
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

export { AreaChart };

export type { AreaChartProps };
