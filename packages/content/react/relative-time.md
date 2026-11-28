---
title: "Relative Time"
description: "Headless live relative times in any language, with direction, a shared clock and server rendering."
---

A `<time>` that reads “3 hours ago” and stays current. All wording comes from `Intl`, each element carries the `lang` and `dir` of the language it writes, and every time on the page shares one timer.

Use [styled Relative Time](/docs/components/relative-time) for Erbium's styles and card.

**Import:** `@erbium-ui/react/relative-time`

## Anatomy

```tsx
import { RelativeTime } from "@erbium-ui/react/relative-time";

<RelativeTime.Provider date={comment.createdAt} locale="fa-IR">
  <RelativeTime.Root />
  <RelativeTime.Absolute timeZone="Asia/Tehran" />
  <RelativeTime.TimeZoneName timeZone="Asia/Tehran" />
</RelativeTime.Provider>;
```

Each part also takes `date` itself, so `<RelativeTime.Root date={date} />` works alone. `Provider` renders no element, and nested providers add to the ones around them. A part renders nothing without a valid date.

## Language and direction

`locale` is a BCP 47 tag. Without it, text uses the runtime's locale. The parts set:

- `lang` to the locale that was written. An unsupported tag falls back to the runtime's, and `lang` names that one.
- `dir` from the locale's script.

Containers you render yourself, such as a popup in a portal, can take both from `useRelativeTimeLocale()`:

```tsx
const { locale, direction } = useRelativeTimeLocale();

<div lang={locale} dir={direction}>
  …
</div>;
```

## Styling

`Root` and `Absolute` take `render`, and `className`, `style` and `children` as values or functions of their state. `Root` sets these attributes:

| Attribute       | Value                                                                    |
| --------------- | ------------------------------------------------------------------------ |
| `data-tense`    | `past`, `present` or `future`                                            |
| `data-unit`     | `second`, `minute`, `hour`, `day`, `week`, `month` or `year`             |
| `data-absolute` | Present while the text is the date: beyond `threshold`, or from a server |

```css
time[data-tense="future"] {
  color: var(--upcoming);
}
```

## Hooks

`useRelativeTime(date, options)` returns the state without an element, or `null` for an invalid date. It re-renders only when the text changes.

```tsx
const state = useRelativeTime(expiresAt, { format: "duration", maxUnits: 2 });
```

`useTimeZoneMatch(zones, { date, timeZone })` is `true` when a zone, by default the viewer's, is as far from UTC at the date as one of `zones`. Use it to leave a repeated row out of a list.

## Server rendering

The server writes the date in `locale` (default `en`) and `timeZone` (default `UTC`), and the client renders the same while hydrating. It then turns relative in the viewer's locale and zone.

With `serverNow`, the server writes relative text from that time. Pass `locale` and `timeZone` with it, so the client's first live text matches.

## Counting

Under a day, the distance is elapsed time in minutes or hours. From a day on, it is counted on calendar days in `timeZone`: days, then weeks, months and years. Time still to come reaches the next count one smaller unit early, so two hours less a second reads “in 2 hours”.

Months and years belong to the calendar of `locale`, as written dates do. From ۷ آبان to ۷ آذر is one month in `fa-IR`, though only 30 days.

| Calendar of the locale                              | Months counted     |
| --------------------------------------------------- | ------------------ |
| `persian`, `indian` and the `islamic` calendars     | Its own, 12 a year |
| `coptic`, `ethiopic`, `ethioaa`                     | Its own, 13 a year |
| `gregory`, `buddhist`, `japanese`, `roc`            | Gregorian          |
| `chinese`, `dangi`, `hebrew`, which add leap months | Gregorian          |

An extension picks the calendar, as in `fa-IR-u-ca-gregory`. `getDurationParts` takes `locale` for the same reason.

## Core

`@erbium-ui/react/relative-time/core` has the wording without React, for servers, emails and notifications:

```ts
import { formatRelativeTime } from "@erbium-ui/react/relative-time/core";

formatRelativeTime(order.shippedAt, { locale: user.locale, timeZone: user.timeZone });
```

| Function                | Purpose                                                                      |
| ----------------------- | ---------------------------------------------------------------------------- |
| `formatRelativeTime`    | The text, or `""` for an invalid date.                                       |
| `getRelativeTime`       | The text with `tense`, `unit`, `value`, `locale`, `direction`, `nextChange`. |
| `getDurationParts`      | The distance between two moments in calendar units.                          |
| `formatDateTime`        | A moment in a locale and zone.                                               |
| `getTimeZoneName`       | A zone's name at a moment.                                                   |
| `getTimeZoneOffset`     | A zone's offset from UTC at a moment, in minutes.                            |
| `getTextDirection`      | `"ltr"` or `"rtl"` for a locale.                                             |
| `resolveLocale`         | The locale the runtime writes for a tag.                                     |
| `parseRelativeTimeDate` | A `Date`, or `null` for an input that names no moment.                       |

## API reference

### Settings

`Provider`, `Root` and `useRelativeTime` accept:

| Prop           | Type                            | Default      |
| -------------- | ------------------------------- | ------------ |
| `date`         | `Date \| string \| number`      |              |
| `locale`       | `string`                        | runtime's    |
| `timeZone`     | `string`                        | runtime's    |
| `format`       | `"relative" \| "duration"`      | `"relative"` |
| `formatStyle`  | `"long" \| "short" \| "narrow"` | `"long"`     |
| `numeric`      | `"auto" \| "always"`            | `"auto"`     |
| `maxUnits`     | `number`                        | `1`          |
| `nowThreshold` | `number` (seconds)              | `60`         |
| `threshold`    | `number` (seconds)              |              |
| `dateFormat`   | `Intl.DateTimeFormatOptions`    | medium date  |
| `labels`       | `RelativeTimeLabels`            |              |
| `serverNow`    | `Date \| string \| number`      |              |

`labels.now` replaces the text for the present. `labels.past` and `labels.future` receive the duration, such as `"2 months"`, and return the whole text. With `maxUnits` above `1`, a relative text needs them outside English.

### Parts

| Part           | Element  | Props                                                           |
| -------------- | -------- | --------------------------------------------------------------- |
| `Provider`     | none     | The settings.                                                   |
| `Root`         | `<time>` | The settings.                                                   |
| `Absolute`     | `<time>` | `date`, `locale`, `timeZone`, `dateFormat` (its own).           |
| `TimeZoneName` | `<bdi>`  | `date`, `locale`, `timeZone`, `timeZoneName` (default `short`). |
