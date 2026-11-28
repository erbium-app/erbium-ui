---
title: "Relative Time"
description: "Live times such as “3 hours ago” in any language and direction, with a card for the exact moment."
---

## Usage

A time that stays current. It writes in the locale you give it, sets `lang` and `dir` to match, and needs no translation files.

**Import:** `@erbium/ui/components/relative-time`

```tsx
<RelativeTime date={comment.createdAt} locale="en" />
<RelativeTimeCard date={deployedAt} locale="en" />
```

`RelativeTime` is a plain `<time>` for rows, links and buttons. `RelativeTimeCard` is a button that shows the exact time, so keep it out of other buttons and links.

`date` takes a `Date`, milliseconds or an ISO 8601 string. Include an offset in strings: without one, a time is read in the viewer's zone and a date alone as midnight UTC. An invalid date renders nothing.

## Language and direction

Set the app's locale once, so times and cards match the text around them. Without one, they use the browser's language.

```tsx
<html lang="fa" dir="rtl">
  <body>
    <DirectionProvider direction="rtl">
      <RelativeTimeProvider locale="fa-IR">{children}</RelativeTimeProvider>
    </DirectionProvider>
  </body>
</html>
```

Words, digits, plurals, calendar and direction all follow the locale: `fa-IR` writes right to left with Persian digits and dates. Extensions override them, as in `fa-IR-u-ca-gregory-nu-latn`.

## Counting

Distances are written in minutes, hours, days, weeks, months, then years.

- Counts are whole units that have passed. Time to come reaches the next count a moment early: a deadline two hours out reads “in 2 hours”, and one 61 minutes out “in 1 hour”.
- Within `nowThreshold` seconds the text is “just now”.
- Days follow the calendar in `timeZone`, so “yesterday” means the day before. Longer units use numbers.
- Months and years follow the locale's calendar, so `fa-IR` counts Persian months. Chinese, Dangi and Hebrew calendars, which add leap months, count Gregorian ones.

## Custom wording

`labels` replace the words around a duration. Write them in the language of `locale`, and define them outside render.

```tsx
const labels = {
  future: (duration: string) => `${duration} later`,
  now: "this moment",
  past: (duration: string) => `${duration} earlier`,
};

<RelativeTime date={date} locale="en" labels={labels} />; // "2 months later"
```

`maxUnits={2}` writes “3 days, 4 hours ago”. Outside English this needs `labels.past` and `labels.future`, or one unit is written.

## Card

The card shows the full date, then the time in the viewer's zone and UTC. It opens on hover, press, tap or keyboard. Compose it to choose zones or add actions:

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

A trigger given `render`, such as a `Button`, takes that element's look.

## Server rendering

By default the server writes the date, in `locale` or English and `timeZone` or UTC, and the text turns relative after hydration. For relative text in the server's HTML, pass the request time as `serverNow`, along with `locale` and `timeZone`.

```tsx
<RelativeTimeProvider locale={locale} timeZone={timeZone} serverNow={renderedAt}>
  {children}
</RelativeTimeProvider>
```

## API

`RelativeTime`, `RelativeTimeCard` and `RelativeTimeProvider` accept these. A component's own prop wins over the provider's.

| Prop           | Type                            | Default      | Description                                      |
| -------------- | ------------------------------- | ------------ | ------------------------------------------------ |
| `date`         | `Date \| string \| number`      |              | The moment.                                      |
| `locale`       | `string`                        | viewer's     | A BCP 47 tag.                                    |
| `timeZone`     | `string`                        | viewer's     | An IANA zone.                                    |
| `format`       | `"relative" \| "duration"`      | `"relative"` | A duration has no “ago” or “in”.                 |
| `formatStyle`  | `"long" \| "short" \| "narrow"` | `"long"`     | How short the units are.                         |
| `numeric`      | `"auto" \| "always"`            | `"auto"`     | `"always"` writes “1 day ago” for “yesterday”.   |
| `maxUnits`     | `number`                        | `1`          | Units written, largest first.                    |
| `nowThreshold` | `number`                        | `60`         | Seconds from now read as “just now”.             |
| `threshold`    | `number`                        |              | Seconds from now beyond which the date is shown. |
| `dateFormat`   | `Intl.DateTimeFormatOptions`    | medium date  | The date shown beyond `threshold`.               |
| `labels`       | `{ now?, past?, future? }`      |              | Custom wording.                                  |
| `serverNow`    | `Date \| string \| number`      |              | The time of the server render.                   |

| Part                      | Props                                                                            |
| ------------------------- | -------------------------------------------------------------------------------- |
| `RelativeTime`            | The props above, `render`, and `children` as content or a function of the state. |
| `RelativeTimeCard`        | The props above, `open`, `defaultOpen`, `onOpenChange`.                          |
| `RelativeTimeCardTrigger` | Popover trigger props: `openOnHover`, `delay` (`400`), `closeDelay` (`150`).     |
| `RelativeTimeCardContent` | Popover content props.                                                           |
| `RelativeTimeCardTitle`   | The date in full, which names the card for screen readers.                       |
| `RelativeTimeAbsolute`    | `date`, `locale`, `timeZone`, `dateFormat` (medium date, short time).            |
| `RelativeTimeZoneList`    | `timeZones` (`["UTC"]`), listed after the viewer's.                              |
| `RelativeTimeZone`        | `timeZone`, `label`, `dateFormat`, `hideIfSameAs`.                               |

`useRelativeTime(date, options)` returns the live `text`, `tense`, `unit`, `value`, `locale` and `direction`. For your own markup, use the [unstyled Relative Time](/docs/react/relative-time).
