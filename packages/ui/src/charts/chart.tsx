import * as React from "react";
import { d3Curve } from "@tanstack/charts";
import type { ChartPoint, ChartTheme, ChartTooltipContent, ChartValue } from "@tanstack/charts";
import { Chart as TanStackChart } from "@tanstack/charts/react/tooltip";
import type {
  ChartProps as TanStackChartProps,
  ChartTooltipBodyRenderContext,
} from "@tanstack/charts/react/tooltip";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { scaleOrdinal } from "@tanstack/charts/scales/ordinal";
import { scalePoint } from "@tanstack/charts/scales/point";
import { scaleUtc } from "@tanstack/charts/scales/time";
import { tooltip } from "@tanstack/charts/tooltip";
import { curveLinear, curveMonotoneX, curveStepAfter } from "d3-shape";
import { cn } from "../lib/utils";

/**
 * Series colors in order: the six Vitesse accents (green, blue, cyan, orange,
 * magenta, yellow), with separate light and dark values in `theme.css`. A series
 * without its own color takes the next one. Past six series, group the smallest
 * into one "Other" series: more colors stop being distinguishable.
 */
const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
] as const;

/** Scene colors for TanStack Charts, resolved from Erbium's theme tokens. */
const chartTheme = {
  background: "transparent",
  foreground: "var(--foreground)",
  grid: "var(--border)",
  muted: "var(--muted-foreground)",
  palette: chartColors,
} satisfies Partial<ChartTheme>;

/** The built-in tooltip, styled by `.erbium-chart-tooltip` in `chart.css`. */
const chartTooltip = { className: "erbium-chart-tooltip", use: tooltip } as const;

/** Formats a number for ticks and tooltips. Build one with `chartNumberFormat`. */
type ChartFormat = (value: number) => string;

/** A `ChartFormat` from `Intl.NumberFormat` options, such as `{ style: "percent" }`. */
const chartNumberFormat = (options?: Intl.NumberFormatOptions, locale?: string): ChartFormat => {
  const formatter = new Intl.NumberFormat(locale, options);

  return (value) => formatter.format(value);
};

const formatChartNumber = (value: number, format: ChartFormat = chartNumberFormat()) =>
  format(value);

/** Prints an x or category value: dates in the reader's locale, everything else as written. */
const formatChartIndex = (value: ChartValue, locale?: string) =>
  value instanceof Date ? value.toLocaleDateString(locale) : String(value);

/**
 * The fields of `TDatum` whose values fit `TValue`. Chart types use it to accept
 * only fields of the right kind, such as numeric fields for series.
 */
type ChartFieldOf<TDatum, TValue> = {
  [TField in keyof TDatum]-?: TDatum[TField] extends TValue ? TField : never;
}[keyof TDatum] &
  string;

/** A row with an x or category field and numeric series fields. */
type ChartDatum<TIndex extends string, TKey extends string> = Record<TIndex, ChartValue> &
  Partial<Record<TKey, number | null>>;

/** One series, or one category of a pie, scatter, or heatmap. */
interface ChartSeries<TKey extends string = string> {
  /** The data key that holds the series' values, or the category value it names. */
  key: TKey;
  /** The name in the legend and tooltip. Defaults to `key`. */
  label?: string;
  /** Any CSS color. Defaults to the next of `--chart-1` to `--chart-6`. */
  color?: string;
}

interface ResolvedChartSeries<TKey extends string = string> {
  key: TKey;
  label: string;
  color: string;
}

const resolveChartSeries = <TKey extends string>(
  series: readonly ChartSeries<TKey>[],
): ResolvedChartSeries<TKey>[] =>
  series.map((item, position) => ({
    color: item.color ?? chartColors[position % chartColors.length] ?? "var(--chart-1)",
    key: item.key,
    label: item.label ?? item.key,
  }));

/** One value of one series: the long form TanStack Charts marks consume. */
interface ChartRow<TDatum = unknown> {
  datum: TDatum;
  /** The category or position the value belongs to. */
  index: ChartValue;
  /** The series label, which is also its color-scale value. */
  series: string;
  value: number | null;
}

/** Turns wide rows (`{ month, desktop, mobile }`) into one row per series value. */
const foldChartSeries = <
  TIndex extends string,
  TKey extends string,
  TDatum extends ChartDatum<TIndex, TKey>,
>(
  data: readonly TDatum[],
  index: TIndex,
  series: readonly ResolvedChartSeries<TKey>[],
): ChartRow<TDatum>[] =>
  data.flatMap((datum) =>
    series.map((item) => ({
      datum,
      index: datum[index],
      series: item.label,
      value: datum[item.key] ?? null,
    })),
  );

/** Maps series labels to their colors. Pass every series, hidden ones included, so colors stay put. */
const chartColorScale = (series: readonly ResolvedChartSeries[]) =>
  scaleOrdinal(
    series.map((item) => item.label),
    series.map((item) => item.color),
  );

/** How the x axis reads its values: categories, numbers, or UTC dates. */
type ChartIndexType = "category" | "number" | "time";

/** The x scale for line and area charts. Categories sit on points, inset from the edges. */
const chartIndexScale = (type: ChartIndexType) => {
  if (type === "number") {
    return scaleLinear;
  }

  if (type === "time") {
    return scaleUtc;
  }

  return () => scalePoint().padding(0.2);
};

/** How a line or area moves between values. */
type ChartCurve = "linear" | "smooth" | "step";

const chartCurves = {
  linear: d3Curve(curveLinear),
  smooth: d3Curve(curveMonotoneX),
  step: d3Curve(curveStepAfter),
} as const;

interface ChartTooltipFormatOptions {
  /** Which position channel carries the value. */
  valueAxis?: "x" | "y";
  format?: ChartFormat;
  indexFormat?: (value: ChartValue) => string;
  locale?: string;
}

/** The tooltip for series charts: the shared x value as the heading, one row per series. */
const chartValueTooltip = ({
  valueAxis = "y",
  format,
  indexFormat,
  locale,
}: ChartTooltipFormatOptions) => {
  const valueOf = (point: ChartPoint) => Number(valueAxis === "y" ? point.yValue : point.xValue);
  const indexOf = (point: ChartPoint) => (valueAxis === "y" ? point.xValue : point.yValue);

  return {
    ...chartTooltip,
    format: (point: ChartPoint) => formatChartNumber(valueOf(point), format),
    formatGroup: (points: readonly ChartPoint[]) => {
      const [first] = points;

      if (first === undefined) {
        return "";
      }

      return indexFormat ? indexFormat(indexOf(first)) : formatChartIndex(indexOf(first), locale);
    },
  };
};

interface ChartSeriesStateOptions {
  /** Series hidden through the legend, by key. */
  hiddenSeries?: readonly string[];
  defaultHiddenSeries?: readonly string[];
  onHiddenSeriesChange?: (hiddenSeries: string[]) => void;
}

const noSeries: readonly string[] = [];

/**
 * Resolves colors and labels, and tracks which series the reader hid through the
 * legend. Hidden series keep their colors, so the remaining series do not repaint.
 */
const useChartSeries = <TKey extends string>(
  series: readonly ChartSeries<TKey>[],
  {
    hiddenSeries,
    defaultHiddenSeries = noSeries,
    onHiddenSeriesChange,
  }: ChartSeriesStateOptions = {},
) => {
  const [uncontrolled, setUncontrolled] = React.useState<readonly string[]>(defaultHiddenSeries);
  const hidden = hiddenSeries ?? uncontrolled;
  const all = React.useMemo(() => resolveChartSeries(series), [series]);

  const visible = React.useMemo(
    () => all.filter((item) => !hidden.includes(item.key)),
    [all, hidden],
  );

  const toggle = React.useCallback(
    (key: string) => {
      const next = hidden.includes(key) ? hidden.filter((item) => item !== key) : [...hidden, key];

      if (hiddenSeries === undefined) {
        setUncontrolled(next);
      }

      onHiddenSeriesChange?.(next);
    },
    [hidden, hiddenSeries, onHiddenSeriesChange],
  );

  return { all, hidden, toggle, visible };
};

/** The key beside a legend entry or tooltip value. */
const ChartSwatch = ({ className, color, style, ...props }: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    data-slot="chart-swatch"
    className={cn("size-2 shrink-0 rounded-full", className)}
    style={{ backgroundColor: color, ...style }}
    {...props}
  />
);

type ChartLegendProps = Omit<React.ComponentProps<"ul">, "children"> & {
  series: readonly ResolvedChartSeries[];
  /** Keys of hidden series. */
  hiddenSeries?: readonly string[];
  /** Makes each entry a toggle that hides or shows its series. */
  onToggleSeries?: (key: string) => void;
};

/** The chart's legend, as HTML so it follows text direction, wrapping, and focus styles. */
const ChartLegend = ({
  className,
  series,
  hiddenSeries = noSeries,
  onToggleSeries,
  ...props
}: ChartLegendProps) => (
  <ul
    data-slot="chart-legend"
    className={cn("flex flex-wrap items-center gap-x-1 gap-y-0.5 text-metadata", className)}
    {...props}
  >
    {series.map((item) => {
      const isHidden = hiddenSeries.includes(item.key);

      const content = (
        <>
          <ChartSwatch color={item.color} />
          {item.label}
        </>
      );

      return (
        <li key={item.key}>
          {onToggleSeries ? (
            <button
              type="button"
              aria-pressed={!isHidden}
              data-hidden={isHidden ? "" : undefined}
              onClick={() => {
                onToggleSeries(item.key);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-transparent px-1.5 py-0.5 text-foreground outline-none transition-colors duration-150 motion-reduce:transition-none hover:bg-accent focus-visible:border-ring data-hidden:text-muted-foreground data-hidden:line-through data-hidden:[&>[data-slot=chart-swatch]]:opacity-40"
            >
              {content}
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-1.5 py-0.5 text-foreground">
              {content}
            </span>
          )}
        </li>
      );
    })}
  </ul>
);

/** Tooltip content in Erbium markup. Passed to TanStack Charts as `renderTooltipBody`. */
const ChartTooltipBody = ({ content }: { content: ChartTooltipContent | string }) => {
  // oxlint-disable-next-line anti-slop/no-runtime-typeof -- TanStack Charts types tooltip content as its own union of a plain string or rows; this branches on that library contract, not on unparsed input.
  if (typeof content === "string") {
    return <div data-slot="chart-tooltip">{content}</div>;
  }

  const { title = "", rows } = content;

  return (
    <div data-slot="chart-tooltip" className="grid min-w-32 gap-1">
      {title === "" ? null : (
        <div data-slot="chart-tooltip-title" className="text-muted-foreground">
          {title}
        </div>
      )}
      <ul className="grid gap-0.5">
        {rows.map(({ active = false, color = "", label, value }) => (
          <li
            key={label}
            data-slot="chart-tooltip-row"
            data-active={active ? "" : undefined}
            className="flex items-center gap-2"
          >
            {color === "" ? null : <ChartSwatch color={color} />}
            <span className="flex-1">{label}</span>
            <span className="font-medium tabular-nums">{value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const renderChartTooltip = ({ content }: ChartTooltipBodyRenderContext) => (
  <ChartTooltipBody content={content} />
);

type ChartProps<
  TDatum,
  TXValue extends ChartValue = ChartValue,
  TYValue extends ChartValue = ChartValue,
> = TanStackChartProps<TDatum, TXValue, TYValue>;

/**
 * Renders any TanStack Charts definition with Erbium's palette, tooltip body,
 * and typography. Chart types such as `BarChart` build their definition and
 * render through this component; use it directly for compositions they do not cover.
 */
const Chart = <
  TDatum,
  TXValue extends ChartValue = ChartValue,
  TYValue extends ChartValue = ChartValue,
>({
  className,
  renderTooltipBody = renderChartTooltip,
  ...props
}: ChartProps<TDatum, TXValue, TYValue>) => (
  <TanStackChart
    className={cn("erbium-chart text-metadata", className)}
    renderTooltipBody={renderTooltipBody}
    {...props}
  />
);

/** Props every chart type shares. */
interface ChartFrameProps extends ChartSeriesStateOptions {
  /** Names the chart for screen readers, such as "Revenue by month". */
  ariaLabel: string;
  /** Plot height in pixels. */
  height?: number;
  /** Width used for server rendering before the container is measured. */
  initialWidth?: number;
  className?: string;
  /** Shows the legend. Defaults to on when there is more than one series. */
  legend?: boolean;
  /** Shows a tooltip for the hovered or focused value. Defaults to on. */
  tooltip?: boolean;
  /** Formats values in ticks and tooltips. */
  format?: ChartFormat;
  /** The locale dates are printed in. Defaults to the browser's. */
  locale?: string;
  /** Shown in place of the plot when there is no data. */
  emptyMessage?: React.ReactNode;
}

type ChartRootProps = Omit<React.ComponentProps<"div">, "children"> & {
  ariaLabel: string;
  height: number;
  empty?: boolean;
  emptyMessage?: React.ReactNode;
  legend?: React.ReactNode;
  children: React.ReactNode;
};

/** The frame every chart type renders inside: legend, plot, and empty state. */
const ChartRoot = ({
  ariaLabel,
  className,
  height,
  empty = false,
  emptyMessage = "No data to show.",
  legend,
  children,
  ...props
}: ChartRootProps) => (
  <div data-slot="chart" className={cn("flex min-w-0 flex-col gap-3", className)} {...props}>
    {legend}
    {empty ? (
      <output
        aria-label={ariaLabel}
        data-slot="chart-empty"
        className="flex items-center justify-center rounded-lg border border-dashed text-metadata text-muted-foreground"
        style={{ height }}
      >
        {emptyMessage}
      </output>
    ) : (
      children
    )}
  </div>
);

export {
  Chart,
  ChartLegend,
  ChartRoot,
  ChartSwatch,
  ChartTooltipBody,
  chartColorScale,
  chartColors,
  chartCurves,
  chartIndexScale,
  chartNumberFormat,
  chartTheme,
  chartTooltip,
  chartValueTooltip,
  foldChartSeries,
  formatChartIndex,
  formatChartNumber,
  resolveChartSeries,
  useChartSeries,
};

export type {
  ChartCurve,
  ChartDatum,
  ChartFieldOf,
  ChartFormat,
  ChartFrameProps,
  ChartIndexType,
  ChartLegendProps,
  ChartProps,
  ChartRootProps,
  ChartRow,
  ChartSeries,
  ChartSeriesStateOptions,
  ResolvedChartSeries,
};
