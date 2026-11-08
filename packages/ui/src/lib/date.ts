/*
 * Calendar-day helpers shared by Calendar and DatePicker. Values are local
 * calendar days (midnight in the user's time zone), matching DayPicker.
 * Formatting uses Intl; parsing reads Gregorian dates in the locale's order.
 */

import type { DateRange } from "@daypicker/react";

type NumericField = "day" | "month" | "year";

const defaultFormat: Intl.DateTimeFormatOptions = { dateStyle: "medium" };

/** Separates the two ends of a typed range: an en dash, hyphen, or "to". */
const rangeSeparator = /\s+[–—-]\s+|\s+to\s+/iu;

const numericOrders = new Map<string, NumericField[]>();
const monthNameLists = new Map<string, string[][]>();

const cacheKey = (locale: string | undefined) => locale ?? "";

/** The order of day, month, and year in the locale's numeric date format. */
const numericOrder = (locale: string | undefined): NumericField[] => {
  const key = cacheKey(locale);
  const cached = numericOrders.get(key);

  if (cached) {
    return cached;
  }

  const order = new Intl.DateTimeFormat(locale, {
    calendar: "gregory",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  })
    .formatToParts(new Date(2000, 10, 22))
    .flatMap((part) =>
      part.type === "day" || part.type === "month" || part.type === "year" ? [part.type] : [],
    );

  numericOrders.set(key, order);

  return order;
};

/** Long and short month names of the locale, with English as a fallback. */
const monthNames = (locale: string | undefined): string[][] => {
  const key = cacheKey(locale);
  const cached = monthNameLists.get(key);

  if (cached) {
    return cached;
  }

  const formatters = [locale, "en"].flatMap((tag) =>
    (["long", "short"] as const).map(
      (month) => new Intl.DateTimeFormat(tag, { calendar: "gregory", month }),
    ),
  );

  const names = Array.from({ length: 12 }, (_, month) =>
    formatters.map((formatter) =>
      formatter
        .format(new Date(2000, month, 1))
        .toLocaleLowerCase()
        .replaceAll(/[^\p{L}]/gu, ""),
    ),
  );

  monthNameLists.set(key, names);

  return names;
};

/** Converts Arabic-Indic and Persian digits to ASCII digits. */
const normalizeDigits = (text: string) =>
  text.replaceAll(/[٠-٩۰-۹]/gu, (digit) => {
    const code = digit.codePointAt(0) ?? 0;

    return String(code - (code >= 0x6_f0 ? 0x6_f0 : 0x6_60));
  });

/** Two-digit years map to 1950–2049. */
const expandYear = (token: string) => {
  const year = Number(token);

  if (token.length > 2) {
    return year;
  }

  return year < 50 ? 2000 + year : 1900 + year;
};

/** Builds a local date, rejecting overflow such as February 30. */
const toDate = (year: number, month: number, day: number): Date | undefined => {
  const date = new Date(year, month, day);

  // The Date constructor maps years 0–99 to 1900–1999.
  date.setFullYear(year, month, day);

  return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day
    ? date
    : undefined;
};

const monthIndex = (word: string, locale: string | undefined) =>
  word.length < 3
    ? -1
    : monthNames(locale).findIndex((names) => names.some((name) => name.startsWith(word)));

/**
 * Formats a calendar day with Intl.
 *
 * @param date Day to format.
 * @param locale BCP 47 locale; the user's locale when omitted.
 * @param options Intl options; `dateStyle: "medium"` by default.
 * @returns Formatted day.
 */
const formatDate = (
  date: Date,
  locale?: string,
  options: Intl.DateTimeFormatOptions = defaultFormat,
): string => new Intl.DateTimeFormat(locale, options).format(date);

/**
 * Formats both ends of a range so the result can be parsed back.
 *
 * @param range Range to format.
 * @param locale BCP 47 locale; the user's locale when omitted.
 * @param options Intl options; `dateStyle: "medium"` by default.
 * @returns Formatted range, or an empty string without a start.
 */
const formatDateRange = (
  range: DateRange | undefined,
  locale?: string,
  options: Intl.DateTimeFormatOptions = defaultFormat,
): string => {
  if (!range?.from) {
    return "";
  }

  const from = formatDate(range.from, locale, options);

  return range.to ? `${from} – ${formatDate(range.to, locale, options)}` : from;
};

/**
 * Parses a typed day: ISO (`2026-11-09`), numeric in the locale's order
 * (`11/9/2026` in en-US, `9.11.2026` in de), or with a month name
 * (`Nov 9, 2026`, `9 November 2026`).
 *
 * @param text Typed text.
 * @param locale BCP 47 locale that sets the numeric order and month names.
 * @returns The day, or undefined when the text is not a valid date.
 */
const parseDate = (text: string, locale?: string): Date | undefined => {
  const value = normalizeDigits(text).trim().toLocaleLowerCase();
  const iso = /^(?<year>\d{4})-(?<month>\d{1,2})-(?<day>\d{1,2})$/u.exec(value)?.groups;

  if (iso) {
    return toDate(Number(iso.year), Number(iso.month) - 1, Number(iso.day));
  }

  const numbers = value.match(/\d+/gu) ?? [];
  const words = value.match(/\p{L}+/gu) ?? [];

  if (words.length === 0) {
    if (numbers.length !== 3) {
      return undefined;
    }

    const fields = new Map(numericOrder(locale).map((field, index) => [field, numbers[index]]));
    const year = fields.get("year");
    const month = fields.get("month");
    const day = fields.get("day");

    return year !== undefined && month !== undefined && day !== undefined
      ? toDate(expandYear(year), Number(month) - 1, Number(day))
      : undefined;
  }

  const month = words.map((word) => monthIndex(word, locale)).find((index) => index !== -1);
  const [first, second] = numbers;

  if (month === undefined || first === undefined || second === undefined || numbers.length !== 2) {
    return undefined;
  }

  // The year is the long or out-of-range number; otherwise the day comes first.
  const yearFirst = first.length > 2 || Number(first) > 31;

  return toDate(expandYear(yearFirst ? first : second), month, Number(yearFirst ? second : first));
};

/**
 * Parses a typed range: two days joined by an en dash, a spaced hyphen, or
 * "to". A single day starts an open range.
 *
 * @param text Typed text.
 * @param locale BCP 47 locale that sets the numeric order and month names.
 * @returns The ordered range, or undefined when either end is invalid.
 */
const parseDateRange = (text: string, locale?: string): DateRange | undefined => {
  const parts = text.split(rangeSeparator);

  if (parts.length > 2) {
    return undefined;
  }

  const [start = "", end] = parts;
  const from = parseDate(start, locale);
  const to = end === undefined ? undefined : parseDate(end, locale);

  if (!from || (end !== undefined && !to)) {
    return undefined;
  }

  return to && to < from ? { from: to, to: from } : { from, to };
};

/**
 * Serializes a calendar day as an ISO date (`2026-11-09`) in local time, for
 * form values that must not shift across time zones.
 *
 * @param date Day to serialize.
 * @returns ISO 8601 calendar date.
 */
const toISODate = (date: Date): string =>
  [
    String(date.getFullYear()).padStart(4, "0"),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");

/**
 * Adds whole days to a calendar day.
 *
 * @param date Starting day.
 * @param amount Days to add; negative values go back.
 * @returns New day.
 */
const addDays = (date: Date, amount: number): Date => {
  const next = new Date(date);

  next.setDate(next.getDate() + amount);

  return next;
};

export { addDays, formatDate, formatDateRange, parseDate, parseDateRange, toISODate };
