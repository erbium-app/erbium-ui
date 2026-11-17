import * as React from "react";
import { defineChart } from "@tanstack/charts";
import type { ChartValue } from "@tanstack/charts";
import { pie, polar, radialArc } from "@tanstack/charts/polar";
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
import type { ChartFrameProps, ChartSeries } from "./chart";

type PieDatum<TIndex extends string, TValue extends string> = Record<TIndex, ChartValue> &
  Record<TValue, number>;

type PieChartProps<
  TIndex extends string,
  TValue extends string,
  TDatum extends PieDatum<TIndex, TValue>,
> = ChartFrameProps & {
  /** One row per slice. */
  data: readonly TDatum[];
  /** The field that names each slice, such as `"browser"`. */
  index: TIndex;
  /** The numeric field that sizes each slice. */
  value: TValue;
  /**
   * Labels and colors by slice name. Defaults to the slices in data order,
   * colored `--chart-1` to `--chart-6`.
   */
  series?: readonly ChartSeries[];
  /** Cuts a hole in the middle. Defaults to on. */
  donut?: boolean;
  /** Content over the donut's hole, such as the total. */
  center?: React.ReactNode;
};

/** One slice, with its fields resolved from the caller's row. */
interface Slice {
  amount: number;
  name: string;
}

/** Shows the parts of a whole, for up to five slices, as a pie or donut. */
const PieChart = <
  const TIndex extends string,
  const TValue extends string,
  TDatum extends PieDatum<TIndex, TValue>,
>({
  data,
  index,
  value,
  series,
  donut = true,
  center,
  ariaLabel,
  height = 240,
  initialWidth,
  className,
  legend = true,
  tooltip = true,
  format,
  locale,
  emptyMessage,
  hiddenSeries,
  defaultHiddenSeries,
  onHiddenSeriesChange,
}: PieChartProps<TIndex, TValue, TDatum>) => {
  const slices = React.useMemo(
    () =>
      data.map((datum): Slice => ({
        amount: datum[value],
        name: formatChartIndex(datum[index], locale),
      })),
    [data, index, locale, value],
  );

  const sliceSeries = React.useMemo(
    () => series ?? slices.map((slice) => ({ key: slice.name })),
    [series, slices],
  );

  const { all, hidden, toggle, visible } = useChartSeries(sliceSeries, {
    defaultHiddenSeries,
    hiddenSeries,
    onHiddenSeriesChange,
  });

  const definition = React.useMemo(() => {
    const labels = new Map(all.map((item) => [item.key, item.label]));
    const shown = new Set(visible.map((item) => item.key));

    const rows = slices
      .filter((slice) => shown.has(slice.name))
      .map((slice) => ({ ...slice, label: labels.get(slice.name) ?? slice.name }));

    return defineChart({
      color: { scale: chartColorScale(all) },
      focus: "nearest",
      marks: [
        polar({
          inset: 4,
          marks: [
            radialArc(pie(rows, { gapAngle: 0.012, value: "amount" }), {
              color: "label",
              cornerRadius: 4,
              innerRadius: donut ? ({ radius }) => radius * 0.62 : 0,
              key: "name",
            }),
          ],
          scales: { angle: null, radius: null },
        }),
      ],
      scales: { x: null, y: null },
      theme: chartTheme,
      tooltip: tooltip
        ? {
            ...chartTooltip,
            content: (points) => ({
              rows: points.map((point) => ({
                color: point.color,
                label: point.datum.label,
                value: formatChartNumber(point.datum.amount, format),
              })),
            }),
          }
        : false,
    });
  }, [all, donut, format, slices, tooltip, visible]);

  return (
    <ChartRoot
      ariaLabel={ariaLabel}
      className={className}
      empty={data.length === 0}
      emptyMessage={emptyMessage}
      height={height}
      legend={
        legend ? <ChartLegend series={all} hiddenSeries={hidden} onToggleSeries={toggle} /> : null
      }
    >
      <div className="relative">
        <Chart
          ariaLabel={ariaLabel}
          definition={definition}
          height={height}
          initialWidth={initialWidth}
        />
        {donut && center !== undefined ? (
          <div
            data-slot="chart-center"
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center"
          >
            {center}
          </div>
        ) : null}
      </div>
    </ChartRoot>
  );
};

export { PieChart };

export type { PieChartProps };
