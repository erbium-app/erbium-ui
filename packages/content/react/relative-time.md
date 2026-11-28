---
title: "Relative Time"
description: "Headless live relative times in any language, with direction, a shared clock and server rendering."
---

A `<time>` that reads “3 hours ago” and stays current. `Intl` writes the text, each element carries its `lang` and `dir`, and all times share one timer. Use [styled Relative Time](/docs/components/relative-time) for Erbium's styles and card.

**Import:** `@erbium-ui/react/relative-time`

## Anatomy

```tsx
<RelativeTime.Provider date={comment.createdAt} locale="fa-IR">
  <RelativeTime.Root />
  <RelativeTime.Absolute timeZone="Asia/Tehran" />
  <RelativeTime.TimeZoneName timeZone="Asia/Tehran" />
</RelativeTime.Provider>
```

`Provider` renders no element, and nested providers add up. Parts also work alone, as in `<RelativeTime.Root date={date} />`, and render nothing without a valid date.

## Styling

`Root` and `Absolute` take `render`, and `className`, `style` and `children` as values or functions of their state. `Root` sets these attributes:

| Attribute       | Value                                                                    |
| --------------- | ------------------------------------------------------------------------ |
| `data-tense`    | `past`, `present` or `future`                                            |
| `data-unit`     | `second`, `minute`, `hour`, `day`, `week`, `month` or `year`             |
| `data-absolute` | Present while the text is the date: beyond `threshold`, or from a server |

## Hooks

- `useRelativeTime(date, options)` returns `Root`'s state, or `null` for an invalid date. It re-renders only when the text changes.
- `useRelativeTimeLocale()` returns the `locale` and `direction` for a container of your own, such as a popup in a portal.
- `useTimeZoneMatch(zones, { date, timeZone })` is `true` when a zone, by default the viewer's, has the same offset as one of `zones`.

## Core

`@erbium-ui/react/relative-time/core` works without React, for servers, emails and notifications:

```ts
formatRelativeTime(order.shippedAt, { locale: user.locale, timeZone: user.timeZone });
```

| Function                | Returns                                                                      |
| ----------------------- | ---------------------------------------------------------------------------- |
| `formatRelativeTime`    | The text, or `""` for an invalid date.                                       |
| `getRelativeTime`       | The text with `tense`, `unit`, `value`, `locale`, `direction`, `nextChange`. |
| `getDurationParts`      | The distance between two moments, in the calendar units of `locale`.         |
| `formatDateTime`        | A moment in a locale and zone.                                               |
| `getTimeZoneName`       | A zone's name at a moment.                                                   |
| `getTimeZoneOffset`     | A zone's offset from UTC at a moment, in minutes.                            |
| `getTextDirection`      | `"ltr"` or `"rtl"` for a locale.                                             |
| `resolveLocale`         | The locale the runtime writes for a tag.                                     |
| `parseRelativeTimeDate` | A `Date`, or `null` for an input that names no moment.                       |

## API

| Part           | Element  | Props                                                           |
| -------------- | -------- | --------------------------------------------------------------- |
| `Provider`     | none     | The settings.                                                   |
| `Root`         | `<time>` | The settings.                                                   |
| `Absolute`     | `<time>` | `date`, `locale`, `timeZone`, `dateFormat` (its own).           |
| `TimeZoneName` | `<bdi>`  | `date`, `locale`, `timeZone`, `timeZoneName` (default `short`). |

The settings, also taken by `useRelativeTime`, are listed in [the styled API](/docs/components/relative-time#api): `date`, `locale`, `timeZone`, `format`, `formatStyle`, `numeric`, `maxUnits`, `nowThreshold`, `threshold`, `dateFormat`, `labels` and `serverNow`. [Counting](/docs/components/relative-time#counting) and [server rendering](/docs/components/relative-time#server-rendering) work the same here.
