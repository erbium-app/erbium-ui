// @vitest-environment node
import { describe, expect, it } from "vite-plus/test";
import {
  formatDateTime,
  formatRelativeTime,
  getDurationParts,
  getRelativeTime,
  getTextDirection,
  getTimeZoneName,
  getTimeZoneOffset,
  parseRelativeTimeDate,
} from "./core";
import type { RelativeTimeOptions } from "./core";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const now = Date.parse("2026-11-28T12:00:00Z");

const at = (offset: number, options?: RelativeTimeOptions) =>
  formatRelativeTime(now + offset, { locale: "en", now, timeZone: "UTC", ...options });

const on = (date: string, options?: RelativeTimeOptions) =>
  formatRelativeTime(date, { locale: "en", now, timeZone: "UTC", ...options });

describe("relative wording", () => {
  it("reads the minute either side of now as just now", () => {
    expect([at(0), at(-59 * SECOND), at(59 * SECOND), at(-MINUTE)]).toStrictEqual([
      "just now",
      "just now",
      "just now",
      "1 minute ago",
    ]);
  });

  it("counts seconds below a lower threshold", () => {
    expect([
      at(-20 * SECOND, { nowThreshold: 10 }),
      at(20 * SECOND, { nowThreshold: 10 }),
    ]).toStrictEqual(["20 seconds ago", "in 20 seconds"]);
  });

  it("counts whole units that have passed", () => {
    expect([
      at(-(59 * MINUTE + 59 * SECOND)),
      at(-HOUR),
      at(-(23 * HOUR + 59 * MINUTE)),
    ]).toStrictEqual(["59 minutes ago", "1 hour ago", "23 hours ago"]);
  });

  it("forgives only the last step before a whole unit still to come", () => {
    expect([
      at(2 * HOUR - SECOND),
      at(HOUR + MINUTE),
      at(HOUR - SECOND / 2),
      at(59 * MINUTE + 30 * SECOND),
      at(5 * MINUTE - SECOND / 2),
    ]).toStrictEqual(["in 2 hours", "in 1 hour", "in 1 hour", "in 59 minutes", "in 5 minutes"]);
  });

  it("counts days on the calendar", () => {
    expect([
      on("2026-11-27T11:00:00Z"),
      // 36 hours, but two calendar days back.
      on("2026-11-26T23:00:00Z"),
      on("2026-11-29T13:00:00Z"),
      on("2026-12-02T12:00:00Z"),
      on("2026-11-27T11:00:00Z", { numeric: "always" }),
    ]).toStrictEqual(["yesterday", "2 days ago", "tomorrow", "in 4 days", "1 day ago"]);
  });

  it("takes the calendar from the time zone", () => {
    // 00:30 on the 27th in Tehran, and 21:00 on the 26th in UTC.
    expect([
      on("2026-11-26T21:00:00Z", { timeZone: "Asia/Tehran" }),
      on("2026-11-26T21:00:00Z"),
    ]).toStrictEqual(["yesterday", "2 days ago"]);
  });

  it("moves through weeks, months and years without claiming calendar periods", () => {
    expect([
      on("2026-11-14T12:00:00Z"),
      on("2026-10-28T12:00:00Z"),
      on("2027-01-28T12:00:00Z"),
      on("2025-11-29T12:00:00Z"),
      on("2025-11-28T12:00:00Z"),
      on("2024-11-28T12:00:00Z"),
    ]).toStrictEqual([
      "2 weeks ago",
      "1 month ago",
      "in 2 months",
      "11 months ago",
      "1 year ago",
      "2 years ago",
    ]);
  });

  it("treats the end of a shorter month as a whole month", () => {
    expect(
      formatRelativeTime("2027-02-28T12:00:00Z", {
        locale: "en",
        now: "2027-01-31T12:00:00Z",
        timeZone: "UTC",
      }),
    ).toBe("in 1 month");
  });
});

describe("languages", () => {
  it("writes each language's own words and digits", () => {
    // Two whole years on both the Gregorian and the Persian calendar.
    const twoYears = "2024-11-27T12:00:00Z";

    expect(
      Object.fromEntries(
        ["fa", "ar", "he", "de", "ja"].map((locale) => [locale, on(twoYears, { locale })]),
      ),
    ).toStrictEqual({
      ar: "قبل سنتين",
      de: "vor 2 Jahren",
      fa: "۲ سال پیش",
      he: "לפני שנתיים",
      ja: "2 年前",
    });
  });

  it("never leaks the English default for now into another language", () => {
    expect([at(0, { locale: "fa" }), at(0, { locale: "en-GB" })]).toStrictEqual([
      "اکنون",
      "just now",
    ]);
  });

  it("reports the direction of a locale's script", () => {
    expect(
      ["fa-IR", "ar", "he", "ur", "ckb", "en", "ja", "ku", "az-Arab"].map((locale) =>
        getTextDirection(locale),
      ),
    ).toStrictEqual(["rtl", "rtl", "rtl", "rtl", "rtl", "ltr", "ltr", "ltr", "rtl"]);
  });

  it("names the language it wrote, with its direction", () => {
    expect(getRelativeTime(now, { locale: "fa-IR", now })).toMatchObject({
      direction: "rtl",
      locale: "fa-IR",
    });
  });
});

describe("custom wording and several units", () => {
  const later = now + 3 * DAY + 4 * HOUR + 5 * MINUTE;

  it("wraps a duration in labels", () => {
    expect(
      on("2027-01-28T12:00:00Z", { labels: { future: (duration) => `${duration} later` } }),
    ).toBe("2 months later");
  });

  it("replaces the text for now", () => {
    expect(at(0, { labels: { now: "this moment" } })).toBe("this moment");
  });

  it("writes several units in English", () => {
    expect([
      at(later - now, { maxUnits: 2 }),
      at(-(HOUR + 30 * MINUTE), { maxUnits: 2 }),
    ]).toStrictEqual(["in 3 days, 4 hours", "1 hour, 30 minutes ago"]);
  });

  it("uses one unit in a language without its own wrapping", () => {
    expect(at(-(HOUR + 30 * MINUTE), { locale: "fa", maxUnits: 2 })).toBe("۱ ساعت پیش");
  });

  it("writes several units in a language that supplies it", () => {
    expect(
      at(-(HOUR + 30 * MINUTE), {
        labels: { past: (duration) => `${duration} پیش` },
        locale: "fa",
        maxUnits: 2,
      }),
    ).toBe("۱ ساعت و ۳۰ دقیقه پیش");
  });
});

const duration = (offset: number, options?: RelativeTimeOptions) =>
  at(offset, { format: "duration", ...options });

describe("durations", () => {
  it("writes the distance without a tense", () => {
    expect([
      duration(-(2 * MINUTE + 5 * SECOND), { maxUnits: 2 }),
      duration(2 * MINUTE + 5 * SECOND, { maxUnits: 2 }),
      duration(0),
      duration(-(10 * DAY)),
      duration(-(10 * DAY), { formatStyle: "narrow", maxUnits: 2 }),
    ]).toStrictEqual([
      "2 minutes, 5 seconds",
      "2 minutes, 5 seconds",
      "0 seconds",
      "1 week",
      "1w 3d",
    ]);
  });

  it("skips a unit that is zero without reaching further down", () => {
    expect(duration(-(3 * DAY + 5 * MINUTE), { maxUnits: 2 })).toBe("3 days");
  });

  it("breaks a distance into calendar units", () => {
    expect(
      getDurationParts("2024-10-27T10:00:00Z", "2026-11-28T12:00:00Z", {
        locale: "en",
        timeZone: "UTC",
      }),
    ).toStrictEqual([
      { unit: "year", value: 2 },
      { unit: "month", value: 1 },
      { unit: "day", value: 1 },
      { unit: "hour", value: 2 },
    ]);
  });
});

// Dates are measured from 7 Azar 1405 in the Persian calendar.
const persian = (date: string, options?: RelativeTimeOptions) =>
  on(date, { locale: "fa-IR", ...options });

describe("calendars", () => {
  it("counts months in the locale's calendar", () => {
    expect([
      // 8 and 7 Aban, then 7 Dey: Aban and Azar have 30 days.
      persian("2026-10-30T12:00:00Z"),
      persian("2026-10-29T12:00:00Z"),
      persian("2026-12-28T12:00:00Z"),
      persian("2025-11-28T12:00:00Z"),
    ]).toStrictEqual(["۴ هفته پیش", "۱ ماه پیش", "۱ ماه بعد", "۱ سال پیش"]);
  });

  it("keeps Gregorian counting when the locale asks for it", () => {
    expect(persian("2026-10-29T12:00:00Z", { locale: "fa-IR-u-ca-gregory" })).toBe("۴ هفته پیش");
  });

  it("counts in a calendar named by the locale's extension", () => {
    expect(
      getDurationParts("2026-10-29T12:00:00Z", "2026-11-28T12:00:00Z", {
        locale: "en-u-ca-persian",
        timeZone: "UTC",
      }),
    ).toStrictEqual([{ unit: "month", value: 1 }]);
  });

  it("ends a shorter month on its last day", () => {
    // 31 Shahrivar to 30 Mehr, and the leap day 30 Esfand 1403 to 29 Esfand 1404.
    expect([
      persian("2026-10-22T12:00:00Z", { now: "2026-09-22T12:00:00Z" }),
      persian("2025-03-20T12:00:00Z", { now: "2026-03-20T12:00:00Z" }),
      // A day short of the whole month.
      persian("2026-10-21T12:00:00Z", { now: "2026-09-22T12:00:00Z" }),
    ]).toStrictEqual(["۱ ماه بعد", "۱ سال پیش", "۴ هفته بعد"]);
  });

  it("counts lunar months", () => {
    // 1 Ramadan to 1 Shawwal 1447.
    expect(
      getDurationParts("2026-02-18T12:00:00Z", "2026-03-20T12:00:00Z", {
        locale: "ar-u-ca-islamic-umalqura",
        timeZone: "UTC",
      }),
    ).toStrictEqual([{ unit: "month", value: 1 }]);
  });

  it("counts thirteen months to a year where the calendar has them", () => {
    const ethiopian = { locale: "en-u-ca-ethiopic", timeZone: "UTC" };

    // 1 Meskerem 2018 to 1 Meskerem 2019, and to the short thirteenth month before it.
    expect([
      getDurationParts("2025-09-11T12:00:00Z", "2026-09-11T12:00:00Z", ethiopian),
      getDurationParts("2025-09-11T12:00:00Z", "2026-09-06T12:00:00Z", ethiopian),
    ]).toStrictEqual([[{ unit: "year", value: 1 }], [{ unit: "month", value: 12 }]]);
  });

  it("counts calendars with leap months as Gregorian", () => {
    expect(
      getDurationParts("2026-10-28T12:00:00Z", "2026-11-28T12:00:00Z", {
        locale: "en-u-ca-hebrew",
        timeZone: "UTC",
      }),
    ).toStrictEqual([{ unit: "month", value: 1 }]);
  });
});

describe("threshold", () => {
  it("writes the date beyond it", () => {
    expect(
      getRelativeTime(now - 8 * DAY, {
        now,
        locale: "en",
        threshold: (7 * DAY) / SECOND,
        timeZone: "UTC",
      }),
    ).toMatchObject({ absolute: true, nextChange: null, text: "Nov 20, 2026", unit: "week" });
  });

  it("returns to relative text as a moment to come gets near", () => {
    const date = now + 8 * DAY;

    expect(
      getRelativeTime(date, { now, threshold: (7 * DAY) / SECOND, timeZone: "UTC" })?.nextChange,
    ).toBe(date - 7 * DAY);
  });
});

describe("next change", () => {
  const offsets = [
    0,
    -30 * SECOND,
    30 * SECOND,
    -MINUTE,
    90 * SECOND,
    -(5 * MINUTE + 400),
    5 * MINUTE + 400,
    -HOUR,
    HOUR + 400,
    5 * HOUR - 400,
    23 * HOUR,
    25 * HOUR,
    -3 * DAY,
  ];

  const cases: RelativeTimeOptions[] = [
    {},
    { nowThreshold: 0 },
    { maxUnits: 2 },
    { format: "duration", maxUnits: 2 },
    { format: "duration" },
    { threshold: 3600 },
  ];

  it("never lets the text change before the time it reports", () => {
    const early = cases.flatMap((options) =>
      offsets.flatMap((offset) => {
        const date = now + offset;
        const settings = { locale: "en", timeZone: "UTC", ...options };
        const first = getRelativeTime(date, { ...settings, now });
        const due = first?.nextChange ?? null;

        const holds =
          due === null ||
          (due > now && formatRelativeTime(date, { ...settings, now: due - 1 }) === first?.text);

        return holds ? [] : [{ offset, options }];
      }),
    );

    expect(early).toStrictEqual([]);
  });

  it("changes at the time it reports for counts below a day", () => {
    for (const offset of [-30 * SECOND, -MINUTE, 90 * SECOND, 5 * MINUTE + 400, -HOUR]) {
      const date = now + offset;
      const settings = { locale: "en", nowThreshold: 0, timeZone: "UTC" };
      const first = getRelativeTime(date, { ...settings, now });

      expect(formatRelativeTime(date, { ...settings, now: first?.nextChange ?? 0 })).not.toBe(
        first?.text,
      );
    }
  });
});

describe("dates and zones", () => {
  it("rejects what names no date", () => {
    expect([
      parseRelativeTimeDate("not a date"),
      parseRelativeTimeDate(""),
      getRelativeTime("not a date"),
      formatRelativeTime(Number.NaN),
      formatDateTime("not a date"),
    ]).toStrictEqual([null, null, null, "", ""]);
  });

  it("writes a moment in a zone and calendar", () => {
    expect([
      formatDateTime(now, { locale: "en", timeZone: "Asia/Tehran" }),
      formatDateTime(now, { dateFormat: { dateStyle: "long" }, locale: "fa-IR", timeZone: "UTC" }),
    ]).toStrictEqual(["Nov 28, 2026, 3:30 PM", "۷ آذر ۱۴۰۵"]);
  });

  it("names a zone and measures its offset", () => {
    expect([
      getTimeZoneName(now, { locale: "en", timeZone: "UTC" }),
      getTimeZoneName(now, { locale: "en", timeZone: "Asia/Tehran" }),
      getTimeZoneOffset(now, "Asia/Tehran"),
      getTimeZoneOffset(now, "America/New_York"),
    ]).toStrictEqual(["UTC", "GMT+3:30", 210, -300]);
  });
});
