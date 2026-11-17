---
title: "Chart"
description: "The shared parts of every chart: palette, tooltip, legend, frame, and the TanStack Charts renderer."
---

## Structure

Charts live in `@erbium/ui/charts`, apart from the interface components. Each chart type is one file, such as `bar-chart` or `pie-chart`, built on this shared `chart` file.

| Layer         | Owner                                          | Role                                                                                                                                                   |
| ------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Math          | d3 (`d3-scale`, `d3-shape`, `d3-array`)        | Scales, curves, stacks, and pie angles. Bundled inside TanStack Charts; `d3-shape` is imported directly for curves.                                    |
| Engine        | [TanStack Charts](https://tanstack.com/charts) | Compiles a chart definition of marks, channels, and scales into a scene, lays out axes, and renders SVG with focus, keyboard navigation, and tooltips. |
| Design system | `charts/chart`                                 | Erbium's palette, theme, tooltip body, HTML legend, empty state, and value formatting.                                                                 |
| Chart types   | `charts/*-chart`                               | Typed props for common charts. Each builds a definition and renders it through `Chart`.                                                                |

## Colors

Series take `--chart-1` to `--chart-6` in order: the six Vitesse accents (green, blue, cyan, orange, magenta, yellow), with separate values for light and dark themes. Give a series its own `color` to override it. `chart.css` points TanStack Charts' `--ts-chart-*` palette at the same tokens, so a hand-written definition also uses them. Past six series, group the smallest into one "Other" series.

## Shared props

Every chart type takes `ariaLabel` (required), `height`, `legend`, `tooltip`, `format` (a function from number to text; `chartNumberFormat(options, locale)` builds one from `Intl.NumberFormat` options), `locale`, and `emptyMessage`. Charts with series take `series`, an array of `{ key, label, color }`, and the legend hides and shows series with `hiddenSeries`, `defaultHiddenSeries`, and `onHiddenSeriesChange`.

## Custom charts

When no chart type fits, write a TanStack Charts definition and render it with `Chart`. Use `chartTheme` for scene colors, `chartTooltip` for the styled tooltip, and `ChartLegend` with `resolveChartSeries` for a legend.
