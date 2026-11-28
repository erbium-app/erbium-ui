---
title: "Relative Time"
description: "Live times such as “3 hours ago” in any language and direction, with a card for the exact moment."
---

## Usage

Tells how far a moment is from now, and keeps that text current. It writes in the locale you give it, sets `lang` and `dir` to match, and needs no translation files.

**Import:** `@erbium/ui/components/relative-time`

```tsx
import { RelativeTime } from "@erbium/ui/components/relative-time";

<RelativeTime date={comment.createdAt} locale="en" />;
```

`date` takes a `Date`, an ISO 8601 string or milliseconds since the epoch. A string without an offset, such as `"2026-11-28T12:00:00"`, is read in the viewer's zone, and a date on its own (`"2026-11-28"`) as midnight UTC. Send times with an offset. An invalid date renders nothing.

| Use                | When                                                                 |
| ------------------ | -------------------------------------------------------------------- |
| `RelativeTime`     | In rows, links and buttons. It is a `<time>`, with no interaction.   |
| `RelativeTimeCard` | In running text or on its own, where people may need the exact time. |

## Language and direction

Set the app's locale once, with `RelativeTimeProvider`, so that times and cards are in the same language as the text around them. Without a `locale`, text is written in the viewer's browser language, which may differ from the language of your interface.

```tsx
import { DirectionProvider } from "@erbium/ui/components/direction";
import { RelativeTimeProvider } from "@erbium/ui/components/relative-time";

<html lang="fa" dir="rtl">
  <body>
    <DirectionProvider direction="rtl">
      <RelativeTimeProvider locale="fa-IR">{children}</RelativeTimeProvider>
    </DirectionProvider>
  </body>
</html>;
```

- Every time sets `lang` and `dir` for the language it writes.
- The card renders in a portal, so it sets its own `lang` and `dir` from the same locale.
- Digits, plural forms and calendars follow the locale: `fa-IR` writes Persian digits and Persian calendar dates. Extensions override them, such as `fa-IR-u-ca-gregory-nu-latn`.
- Direction comes from the locale's script, so `ar`, `fa`, `he`, `ur` and `ckb` are right to left.

| Distance        | `en`         | `fa-IR`     | `de`          |
| --------------- | ------------ | ----------- | ------------- |
| Under a minute  | just now     | اکنون       | jetzt         |
| 5 minutes ahead | in 5 minutes | ۵ دقیقه بعد | in 5 Minuten  |
| 3 hours back    | 3 hours ago  | ۳ ساعت پیش  | vor 3 Stunden |
| 1 day back      | yesterday    | دیروز       | gestern       |
| 4 days ahead    | in 4 days    | ۴ روز دیگر  | in 4 Tagen    |
| 2 months ahead  | in 2 months  | ۲ ماه بعد   | in 2 Monaten  |
| 2 years back    | 2 years ago  | ۲ سال پیش   | vor 2 Jahren  |

## How time is counted

| Distance       | Written in                                                        |
| -------------- | ----------------------------------------------------------------- |
| Under a minute | “just now”. Change the window with `nowThreshold`, in seconds.    |
| Under an hour  | Minutes                                                           |
| Under a day    | Hours                                                             |
| Under a week   | Calendar days in `timeZone`, so “yesterday” means the day before. |
| Under a month  | Weeks                                                             |
| Under a year   | Calendar months                                                   |
| Longer         | Years                                                             |

- Counts are whole units that have passed. Time still to come reaches the next count a moment early, so a deadline two hours out reads “in 2 hours”, and one 61 minutes out reads “in 1 hour”.
- Only days use words such as “yesterday”. Months and years use numbers, because “last year” can be wrong for a time one year away.
- Months and years follow the calendar that `locale` writes dates in, so `fa-IR` counts Persian months. Persian, Islamic, Indian, Ethiopic and Coptic calendars count their own. Chinese, Dangi and Hebrew calendars, which add leap months, count Gregorian ones.
- To count Gregorian months in any language, add `-u-ca-gregory` to the locale. Dates are then written in that calendar too.
- All times share one timer. A time re-renders only when its text changes, and catches up when a hidden tab returns.

## Custom wording

`labels` replace the words around a duration. Write each function in the language of `locale`, and define the object outside render.

```tsx
const labels = {
  future: (duration: string) => `${duration} later`,
  now: "this moment",
  past: (duration: string) => `${duration} earlier`,
};

<RelativeTime date={date} locale="en" labels={labels} />; // "2 months later"
```

`maxUnits={2}` writes “3 days, 4 hours ago”. `Intl` cannot add “ago” to two units, so outside English this needs `labels.past` and `labels.future`; without them the text uses one unit.

## Card

```tsx
<RelativeTimeCard date={deployedAt} />
```

The trigger shows the relative time. The card shows the full date, then the time in the viewer's zone and UTC. When the viewer is on UTC, it is listed once. It opens on hover, and with a press, a tap or the keyboard.

Compose it to choose the zones and add actions:

```tsx
<RelativeTimeCard date={date}>
  <RelativeTimeCardTrigger />
  <RelativeTimeCardContent>
    <RelativeTimeCardTitle />
    <RelativeTimeZoneList>
      <RelativeTimeZone hideIfSameAs={["Asia/Tehran"]} />
      <RelativeTimeZone timeZone="Asia/Tehran" label="Tehran" />
    </RelativeTimeZoneList>
  </RelativeTimeCardContent>
</RelativeTimeCard>
```

The trigger takes `render` to become another element, such as a `Button`, which then keeps its own look in place of the dotted underline. Keep `RelativeTimeCard` out of links and buttons, since its trigger is a button.

## Server rendering

A server knows neither the viewer's zone nor, usually, the current time they will see the page at.

- By default the server writes the date, in `locale` or English and `timeZone` or UTC. It turns relative after hydration.
- Pass `serverNow`, the time the request is rendered at, to put relative text in the server's HTML. With it, pass `locale` and `timeZone` too, so the server writes what the browser will.

```tsx
<RelativeTimeProvider locale={locale} timeZone={timeZone} serverNow={loaderData.renderedAt}>
  {children}
</RelativeTimeProvider>
```

## API

`RelativeTime`, `RelativeTimeCard` and `RelativeTimeProvider` accept these. A component's own prop wins over the provider's.

| Prop           | Type                            | Default      | Description                                        |
| -------------- | ------------------------------- | ------------ | -------------------------------------------------- |
| `date`         | `Date \| string \| number`      |              | The moment.                                        |
| `locale`       | `string`                        | viewer's     | A BCP 47 tag.                                      |
| `timeZone`     | `string`                        | viewer's     | An IANA zone, for calendar days and written dates. |
| `format`       | `"relative" \| "duration"`      | `"relative"` | A duration has no “ago” or “in”.                   |
| `formatStyle`  | `"long" \| "short" \| "narrow"` | `"long"`     | How short the units are written.                   |
| `numeric`      | `"auto" \| "always"`            | `"auto"`     | `"always"` writes “1 day ago” for “yesterday”.     |
| `maxUnits`     | `number`                        | `1`          | Units written, largest first.                      |
| `nowThreshold` | `number`                        | `60`         | Seconds either side of now read as “just now”.     |
| `threshold`    | `number`                        |              | Seconds beyond which the date is written.          |
| `dateFormat`   | `Intl.DateTimeFormatOptions`    | medium date  | The date written beyond `threshold`.               |
| `labels`       | `{ now?, past?, future? }`      |              | Custom wording.                                    |
| `serverNow`    | `Date \| string \| number`      |              | The time of the server render.                     |

| Part                      | Props                                                                             |
| ------------------------- | --------------------------------------------------------------------------------- |
| `RelativeTime`            | The props above, `render`, and `children` as content or a function of the state.  |
| `RelativeTimeAbsolute`    | `date`, `locale`, `timeZone`, `dateFormat` (default: medium date and short time). |
| `RelativeTimeCard`        | The props above, `open`, `defaultOpen`, `onOpenChange`.                           |
| `RelativeTimeCardTrigger` | Popover trigger props: `openOnHover`, `delay` (`400`), `closeDelay` (`150`).      |
| `RelativeTimeCardContent` | Popover content props: `side`, `align`, `sideOffset`.                             |
| `RelativeTimeCardTitle`   | The date in full, which names the card for screen readers.                        |
| `RelativeTimeZoneList`    | `timeZones` (default `["UTC"]`), listed after the viewer's.                       |
| `RelativeTimeZone`        | `timeZone`, `label`, `dateFormat`, `hideIfSameAs`.                                |

`useRelativeTime(date, options)` returns the live `text`, `tense`, `unit`, `value`, `locale` and `direction`. The wording, clock and server rendering come from the [unstyled Relative Time](/docs/react/relative-time).
