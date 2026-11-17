import * as React from "react";
import { defineChart } from "@tanstack/charts";
import {
  angleGrid,
  polar,
  radialArea,
  radialDot,
  radialGrid,
  radialLine,
} from "@tanstack/charts/polar";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { scalePoint } from "@tanstack/charts/scales/point";
import { curveLinearClosed } from "d3-shape";
import {
  Chart,
  ChartLegend,
  ChartRoot,
  chartColorScale,
  chartTheme,
  chartTooltip,
  foldChartSeries,
  formatChartIndex,
  formatChartNumber,
  useChartSeries,
} from "./chart";
import type { ChartDatum, ChartFrameProps, ChartSeries } from "./chart";

type RadarChartProps<
  TIndex extends string,
  TKey extends string,
  TDatum extends ChartDatum<TIndex, TKey>,
> = ChartFrameProps & {
  /** One row per axis, with one numeric field per series. */
  data: readonly TDatum[];
  /** The field that names each axis, such as `"skill"`. */
  index: TIndex;
  /** The numeric fields to draw, in order. */
  series: readonly ChartSeries<TKey>[];
  /** The value at the outer ring. Defaults to the largest value. Keep it fixed when comparing charts. */
  max?: number;
  /** Rings between the center and `max`. Defaults to 4. */
  rings?: number;
  /** Marks each value with a dot. */
  points?: boolean;
};

/** Compares a few series across five to eight shared axes. */
const RadarChart = <
  const TIndex extends string,
  const TKey extends string,
  TDatum extends ChartDatum<TIndex, TKey>,
>({
  data,
  index,
  series,
  max,
  rings = 4,
  points = false,
  ariaLabel,
  height = 280,
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
}: RadarChartProps<TIndex, TKey, TDatum>) => {
  const { all, hidden, toggle, visible } = useChartSeries(series, {
    defaultHiddenSeries,
    hiddenSeries,
    onHiddenSeriesChange,
  });

  const showLegend = legend ?? series.length > 1;

  const definition = React.useMemo(() => {
    const rows = foldChartSeries(data, index, visible).flatMap((row) =>
      row.value === null ? [] : [{ ...row, value: row.value }],
    );

    const axes = data.map((datum) => formatChartIndex(datum[index], locale));
    const outer = max ?? Math.max(1, ...rows.map((row) => row.value));
    const ringValues = Array.from({ length: rings }, (_, ring) => (outer * (ring + 1)) / rings);

    // Radial marks take d3 curve factories directly, unlike cartesian marks.
    const profile = {
      angle: (row: (typeof rows)[number]) => formatChartIndex(row.index, locale),
      color: "series",
      curve: curveLinearClosed,
      radius: "value",
      z: "series",
    } as const;

    return defineChart({
      color: { scale: chartColorScale(all) },
      focus: "nearest",
      marks: [
        polar({
          guides: [
            radialGrid({
              format: (value) => formatChartNumber(Number(value), format),
              // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- `shape` is TanStack Charts' radialGrid option name; polygon rings follow the radar's straight edges.
              shape: "polygon",
              values: ringValues,
            }),
            angleGrid({ labelOffset: 12 }),
          ],
          marks: [
            radialArea(rows, { ...profile, fillOpacity: 0.16 }),
            radialLine(rows, { ...profile, strokeWidth: 2 }),
            ...(points
              ? [
                  radialDot(rows, {
                    angle: profile.angle,
                    color: "series",
                    r: 3,
                    radius: "value",
                  }),
                ]
              : []),
          ],
          radiusRatio: 0.78,
          scales: {
            angle: { scale: scalePoint().domain(axes), wrap: true },
            radius: { scale: scaleLinear().domain([0, outer]) },
          },
        }),
      ],
      scales: { x: null, y: null },
      theme: chartTheme,
      tooltip: tooltip
        ? {
            ...chartTooltip,
            content: (focused) => {
              const [first] = focused;

              return {
                rows: focused.map((point) => ({
                  color: point.color,
                  label: point.datum.series,
                  value: formatChartNumber(point.datum.value, format),
                })),
                title: first === undefined ? "" : formatChartIndex(first.datum.index, locale),
              };
            },
          }
        : false,
    });
  }, [all, data, format, index, locale, max, points, rings, tooltip, visible]);

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

export { RadarChart };

export type { RadarChartProps };
