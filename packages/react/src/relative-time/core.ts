/*
 * Relative time without React: which unit a moment is away by, how that reads in a language, and
 * when the text will next change. All wording and ordering comes from `Intl`.
 */

/** A `Date`, an ISO 8601 string, or milliseconds since the epoch. */
type RelativeTimeInput = Date | number | string;

type RelativeTimeUnit = "second" | "minute" | "hour" | "day" | "week" | "month" | "year";

type RelativeTimeTense = "past" | "present" | "future";

type RelativeTimeFormat = "relative" | "duration";

type RelativeTimeStyle = "long" | "short" | "narrow";

type RelativeTimeNumeric = "always" | "auto";

type TextDirection = "ltr" | "rtl";

/** Wording that replaces what `Intl` writes. Give every entry in the language of `locale`. */
interface RelativeTimeLabels {
  /** The text within `nowThreshold`. English defaults to "just now", other languages to `Intl`. */
  now?: string | undefined;
  /** Wraps an elapsed duration, such as ``(duration) => `${duration} earlier` ``. */
  past?: ((duration: string) => string) | undefined;
  /** Wraps a remaining duration, such as ``(duration) => `${duration} later` ``. */
  future?: ((duration: string) => string) | undefined;
}

interface DateTimeOptions {
  /** A BCP 47 tag, such as `"fa-IR"`. @default the runtime's locale */
  locale?: string | undefined;
  /** An IANA zone, such as `"Asia/Tehran"`. @default the runtime's zone */
  timeZone?: string | undefined;
  /** @default `{ dateStyle: "medium", timeStyle: "short" }` */
  dateFormat?: Intl.DateTimeFormatOptions | undefined;
}

interface RelativeTimeOptions extends DateTimeOptions {
  /** The moment to measure from. @default the current time */
  now?: RelativeTimeInput | undefined;
  /** `"duration"` writes the distance alone, without "ago" or "in". @default "relative" */
  format?: RelativeTimeFormat | undefined;
  /** @default "long" */
  formatStyle?: RelativeTimeStyle | undefined;
  /** `"auto"` writes one day away as "yesterday" or "tomorrow". @default "auto" */
  numeric?: RelativeTimeNumeric | undefined;
  /**
   * How many units to write, largest first. A relative text with more than one needs
   * `labels.past` and `labels.future` outside English, and uses one unit without them.
   * @default 1
   */
  maxUnits?: number | undefined;
  /** Seconds either side of now that read as "just now". @default 60 */
  nowThreshold?: number | undefined;
  /** Seconds either side of now beyond which the date is written instead. @default never */
  threshold?: number | undefined;
  labels?: RelativeTimeLabels | undefined;
}

interface RelativeTimeResult {
  date: Date;
  text: string;
  tense: RelativeTimeTense;
  /** The largest unit of the distance. */
  unit: RelativeTimeUnit;
  /** How many of `unit`, negative in the past and `0` in the present. */
  value: number;
  /** `text` is the date, because the distance passed `threshold`. */
  absolute: boolean;
  /** The locale the text is written in, for `lang`. */
  locale: string;
  /** The writing direction of `locale`, for `dir`. */
  direction: TextDirection;
  /** When `text` can next change, in milliseconds since the epoch, or `null` if it will not. */
  nextChange: number | null;
}

interface DurationPart {
  unit: RelativeTimeUnit;
  value: number;
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** Every time zone offset is a multiple of this, so calendar days only turn over on one. */
const QUARTER_HOUR = 15 * MINUTE;

/**
 * Months in a year, for the calendars whose own months are counted. Gregorian months are those of
 * the Buddhist, Japanese and Minguo calendars too. The Chinese, Dangi and Hebrew calendars add
 * leap months, and count as Gregorian.
 */
const monthsPerYear = new Map([
  ["coptic", 13],
  ["ethioaa", 13],
  ["ethiopic", 13],
  ["indian", 12],
  ["islamic", 12],
  ["islamic-civil", 12],
  ["islamic-rgsa", 12],
  ["islamic-tbla", 12],
  ["islamic-umalqura", 12],
  ["persian", 12],
]);

/** Scripts written right to left. `Intl.Locale`'s text info is not in every browser. */
const rtlScripts = new Set([
  "Adlm",
  "Arab",
  "Hebr",
  "Mand",
  "Mend",
  "Nkoo",
  "Rohg",
  "Samr",
  "Syrc",
  "Thaa",
  "Yezi",
]);

/** One formatter per locale and options: building one costs far more than using it. */
const memoizeFormatter = <Locale extends string | undefined, Options, Formatter>(
  Constructor: new (locale: Locale, options: Options) => Formatter,
) => {
  const formatters = new Map<string, Formatter>();

  return (locale: Locale, options: Options): Formatter => {
    const key = JSON.stringify([locale, options]);
    const formatter = formatters.get(key) ?? new Constructor(locale, options);
    formatters.set(key, formatter);

    return formatter;
  };
};

const dateTimeFormatter = memoizeFormatter<
  string | undefined,
  Intl.DateTimeFormatOptions,
  Intl.DateTimeFormat
>(Intl.DateTimeFormat);

const listFormatter = memoizeFormatter<string, Intl.ListFormatOptions, Intl.ListFormat>(
  Intl.ListFormat,
);

const numberFormatter = memoizeFormatter<string, Intl.NumberFormatOptions, Intl.NumberFormat>(
  Intl.NumberFormat,
);

const relativeFormatter = memoizeFormatter<
  string,
  Intl.RelativeTimeFormatOptions,
  Intl.RelativeTimeFormat
>(Intl.RelativeTimeFormat);

/**
 * The locale text is written in: `locale` when the runtime has data for it, and its own locale
 * otherwise. Throws a `RangeError` for a malformed tag.
 */
const resolveLocale = (locale?: string): string => {
  const [supported] = locale === undefined ? [] : Intl.DateTimeFormat.supportedLocalesOf(locale);

  return supported ?? dateTimeFormatter(undefined, {}).resolvedOptions().locale;
};

/** The writing direction of a locale's script, for `dir`. */
const getTextDirection = (locale?: string): TextDirection => {
  const { script } = new Intl.Locale(resolveLocale(locale)).maximize();

  return script !== undefined && rtlScripts.has(script) ? "rtl" : "ltr";
};

/** The calendar a locale writes its dates in, such as "persian" for `fa-IR`. */
const getCalendar = (locale: string): string =>
  dateTimeFormatter(locale, {}).resolvedOptions().calendar;

/** The date an input names, or `null` when it names none. */
const parseRelativeTimeDate = (input: RelativeTimeInput | null | undefined): Date | null => {
  if (input === null || input === undefined || input === "") {
    return null;
  }

  const date = new Date(input);

  return Number.isNaN(date.getTime()) ? null : date;
};

const readPart = (parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes) =>
  Number(parts.find((part) => part.type === type)?.value);

/** A zone's wall clock as a UTC timestamp, so calendar arithmetic can use the UTC methods. */
const toWallClock = (date: Date, timeZone: string | undefined): number => {
  if (timeZone === undefined) {
    return date.getTime() - date.getTimezoneOffset() * MINUTE;
  }

  const parts = dateTimeFormatter("en-US", {
    timeZone,
    calendar: "gregory",
    day: "numeric",
    hour: "numeric",
    hourCycle: "h23",
    minute: "numeric",
    month: "numeric",
    numberingSystem: "latn",
    second: "numeric",
    year: "numeric",
  }).formatToParts(date);

  const read = (type: Intl.DateTimeFormatPartTypes) => readPart(parts, type);

  const wall = new Date(0);
  wall.setUTCFullYear(read("year"), read("month") - 1, read("day"));
  wall.setUTCHours(read("hour"), read("minute"), read("second"), date.getUTCMilliseconds());

  return wall.getTime();
};

/** Adds Gregorian months, keeping to the last day of a shorter month. */
const addMonths = (wall: number, count: number): number => {
  const result = new Date(wall);
  const day = result.getUTCDate();

  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + count);

  const end = new Date(result);
  end.setUTCMonth(end.getUTCMonth() + 1, 0);
  result.setUTCDate(Math.min(day, end.getUTCDate()));

  return result.getTime();
};

/** Whole Gregorian months from one wall clock to a later one. */
const countMonths = (from: number, to: number): number => {
  const start = new Date(from);
  const end = new Date(to);

  const months =
    (end.getUTCFullYear() - start.getUTCFullYear()) * 12 + end.getUTCMonth() - start.getUTCMonth();

  return addMonths(from, months) > to ? months - 1 : months;
};

/** The year, month and day of a wall clock in a calendar. */
const toCalendarDate = (wall: number, calendar: string) => {
  const parts = dateTimeFormatter("en-US", {
    calendar,
    day: "numeric",
    month: "numeric",
    numberingSystem: "latn",
    timeZone: "UTC",
    year: "numeric",
  }).formatToParts(wall);

  return {
    day: readPart(parts, "day"),
    month: readPart(parts, "month"),
    year: readPart(parts, "year"),
  };
};

/**
 * Whole months of a calendar from one wall clock to a later one, and `anchor`, the wall clock that
 * many months after the first. As in `addMonths`, a shorter month ends on its last day.
 */
const measureMonths = (from: number, to: number, calendar: string) => {
  const perYear = monthsPerYear.get(calendar);

  if (perYear === undefined) {
    const months = countMonths(from, to);

    return { months, anchor: addMonths(from, months), perYear: 12 };
  }

  const start = toCalendarDate(from, calendar);
  const end = toCalendarDate(to, calendar);
  const endDay = Math.floor(to / DAY) * DAY;
  const timeOfDay = from - Math.floor(from / DAY) * DAY;
  const months = (end.year - start.year) * perYear + end.month - start.month;
  const lastDay = toCalendarDate(endDay + DAY, calendar).day === 1;
  const day = lastDay ? Math.min(start.day, end.day) : start.day;
  const anchor = endDay + (day - end.day) * DAY + timeOfDay;

  if (anchor <= to) {
    return { anchor, months, perYear };
  }

  // This month's turn has not come, so the last whole month ended in the one before.
  const previousEnd = endDay - end.day * DAY;
  const { day: length } = toCalendarDate(previousEnd, calendar);

  return {
    anchor: previousEnd + (Math.min(start.day, length) - length) * DAY + timeOfDay,
    months: months - 1,
    perYear,
  };
};

/** Where a distance is counted: the zone its days turn over in, and the calendar of its months. */
interface Reckoning {
  timeZone: string | undefined;
  calendar: string;
}

const toDurationParts = (
  from: Date,
  to: Date,
  elapsed: number,
  { calendar, timeZone }: Reckoning,
): DurationPart[] => {
  let rest = elapsed;
  let years = 0;
  let months = 0;

  // From a day on, count on the calendar: months differ in length and some days are not 24 hours.
  if (elapsed >= DAY) {
    const [start = 0, end = 0] = [toWallClock(from, timeZone), toWallClock(to, timeZone)].toSorted(
      (a, b) => a - b,
    );

    // The calendar distance is the elapsed one plus whatever the clocks were moved in between.
    const moved = end - start - Math.abs(to.getTime() - from.getTime());
    const until = start + elapsed + moved;

    const whole = measureMonths(start, until, calendar);

    years = Math.floor(whole.months / whole.perYear);
    months = whole.months % whole.perYear;
    rest = until - whole.anchor;
  }

  const days = Math.floor(rest / DAY);

  return [
    { unit: "year", value: years },
    { unit: "month", value: months },
    { unit: "week", value: Math.floor(days / 7) },
    { unit: "day", value: days % 7 },
    { unit: "hour", value: Math.floor((rest % DAY) / HOUR) },
    { unit: "minute", value: Math.floor((rest % HOUR) / MINUTE) },
    { unit: "second", value: Math.floor((rest % MINUTE) / SECOND) },
  ];
};

/** Past time counts whole seconds that have gone; time still to come counts every started one. */
const roundSpan = (difference: number): number =>
  // The absolute value keeps now itself from becoming `-0`, which `Intl` writes as the future.
  (difference > 0 ? Math.ceil(difference / SECOND) : Math.floor(Math.abs(difference) / SECOND)) *
  SECOND;

/** How often a duration is checked, by the smallest unit it has room for. Others: hourly. */
const steps: Partial<Record<RelativeTimeUnit, number>> = { minute: MINUTE, second: SECOND };

const measureDuration = (date: Date, now: Date, maxUnits: number, reckoning: Reckoning) => {
  const difference = date.getTime() - now.getTime();
  const future = difference > 0;
  const span = roundSpan(difference);
  const all = toDurationParts(now, date, span, reckoning);
  const first = all.findIndex((part) => part.value > 0);
  const start = first === -1 ? all.length - 1 : first;
  const slots = all.slice(start, start + Math.max(1, Math.floor(maxUnits)));
  const parts = slots.filter((part, index) => index === 0 || part.value > 0);

  // The text changes with the smallest unit it has room for. Days and longer are checked hourly.
  const smallest = slots.at(-1)?.unit;
  const step = (smallest && steps[smallest]) ?? HOUR;

  const nextChange = future
    ? date.getTime() - (Math.floor(span / step) * step - SECOND)
    : date.getTime() + (Math.floor(-difference / step) + 1) * step;

  return { future, nextChange, parts, span };
};

/**
 * The distance between two moments as calendar units, largest first: at most `maxUnits`
 * neighbouring units, without the ones that are zero. Months and years are those of the calendar
 * of `locale`.
 */
const getDurationParts = (
  from: RelativeTimeInput,
  to: RelativeTimeInput,
  {
    locale,
    maxUnits = 7,
    timeZone,
  }: Pick<RelativeTimeOptions, "locale" | "maxUnits" | "timeZone"> = {},
): DurationPart[] => {
  const start = parseRelativeTimeDate(from);
  const end = parseRelativeTimeDate(to);

  if (!start || !end) {
    return [];
  }

  const calendar = getCalendar(resolveLocale(locale));

  return measureDuration(end, start, maxUnits, { calendar, timeZone }).parts;
};

const formatDuration = (parts: DurationPart[], locale: string, style: RelativeTimeStyle) =>
  listFormatter(locale, { style, type: "unit" }).format(
    parts.map(({ unit, value }) =>
      numberFormatter(locale, { unit, style: "unit", unitDisplay: style }).format(Math.abs(value)),
    ),
  );

const isEnglish = (locale: string) => new Intl.Locale(locale).language === "en";

/** The single unit a distance is written in, and how many of it, without a sign. */
const measureUnit = (date: Date, now: Date, { calendar, timeZone }: Reckoning) => {
  const difference = date.getTime() - now.getTime();
  const future = difference > 0;
  const elapsed = Math.abs(difference);
  const seconds = roundSpan(difference) / SECOND;
  const at = date.getTime();

  // Time to come drops to the next count once less than the step below it is left, so a deadline
  // two hours out reads "in 2 hours" while one 61 minutes out reads "in 1 hour".
  if (seconds < 60) {
    return {
      count: seconds,
      nextChange: future ? at - (seconds - 1) * SECOND : at + (seconds + 1) * SECOND,
      unit: "second" as const,
    };
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return {
      count: minutes,
      nextChange: future ? at - (minutes * 60 - 1) * SECOND : at + (minutes + 1) * MINUTE,
      unit: "minute" as const,
    };
  }

  const hours = Math.floor(
    (future ? Math.ceil(elapsed / MINUTE) : Math.floor(elapsed / MINUTE)) / 60,
  );

  // One hour to come is reached from the minutes, which forgive only a second.
  const hourly = {
    count: hours,
    nextChange: future
      ? at - Math.max((hours * 60 - 1) * MINUTE, HOUR - SECOND)
      : at + (hours + 1) * HOUR,
    unit: "hour" as const,
  };

  if (hours < 24) {
    return hourly;
  }

  const [start = 0, end = 0] = [toWallClock(now, timeZone), toWallClock(date, timeZone)]
    .map((wall) => Math.floor(wall / DAY) * DAY)
    .toSorted((a, b) => a - b);

  const days = (end - start) / DAY;

  // A 25 hour day can hold a whole 24 hours, which no calendar unit describes.
  if (days === 0) {
    return hourly;
  }

  const { months, perYear } = measureMonths(start, end, calendar);
  const nextQuarter = (Math.floor(now.getTime() / QUARTER_HOUR) + 1) * QUARTER_HOUR;
  const hoursAgain = at - (24 * 60 - 1) * MINUTE;

  const nextChange =
    future && hoursAgain > now.getTime() ? Math.min(nextQuarter, hoursAgain) : nextQuarter;

  if (months >= perYear) {
    return { nextChange, count: Math.floor(months / perYear), unit: "year" as const };
  }

  if (months >= 1) {
    return { nextChange, count: months, unit: "month" as const };
  }

  return days >= 7
    ? { nextChange, count: Math.floor(days / 7), unit: "week" as const }
    : { nextChange, count: days, unit: "day" as const };
};

/** The date and time of a moment in a locale and zone, or `""` for an invalid date. */
const formatDateTime = (
  input: RelativeTimeInput,
  { locale, timeZone, dateFormat }: DateTimeOptions = {},
): string => {
  const date = parseRelativeTimeDate(input);

  if (!date) {
    return "";
  }

  return dateTimeFormatter(resolveLocale(locale), {
    ...(dateFormat ?? { dateStyle: "medium", timeStyle: "short" }),
    timeZone,
  }).format(date);
};

/** The name of a zone at a moment, such as "UTC", "EST" or "GMT+3:30", or `""` when invalid. */
const getTimeZoneName = (
  input: RelativeTimeInput,
  {
    locale,
    timeZone,
    timeZoneName = "short",
  }: Pick<Intl.DateTimeFormatOptions, "timeZoneName"> & Omit<DateTimeOptions, "dateFormat"> = {},
): string => {
  const date = parseRelativeTimeDate(input);

  if (!date) {
    return "";
  }

  const parts = dateTimeFormatter(resolveLocale(locale), {
    hour: "numeric",
    timeZone,
    timeZoneName,
  }).formatToParts(date);

  return parts.find((part) => part.type === "timeZoneName")?.value ?? "";
};

/** Minutes a zone is ahead of UTC at a moment, negative when behind. */
const getTimeZoneOffset = (input: RelativeTimeInput, timeZone?: string): number => {
  const date = parseRelativeTimeDate(input);

  return date ? Math.round((toWallClock(date, timeZone) - date.getTime()) / MINUTE) : Number.NaN;
};

/** The options of one description, with their defaults, and what it is measured between. */
interface Measurement {
  date: Date;
  now: Date;
  locale: string;
  options: RelativeTimeOptions;
  tense: "past" | "future";
}

/** What a description says, apart from the date and language it says it in. */
type Description = Pick<
  RelativeTimeResult,
  "absolute" | "nextChange" | "tense" | "text" | "unit" | "value"
>;

const signed = (count: number, tense: "past" | "future") =>
  // `|| 0` turns `-0` into `0`.
  (tense === "future" ? count : -count) || 0;

const describeDuration = ({ date, now, locale, options, tense }: Measurement): Description => {
  const { formatStyle = "long", maxUnits = 1, timeZone } = options;
  const reckoning = { calendar: getCalendar(locale), timeZone };
  const { nextChange, parts, span } = measureDuration(date, now, maxUnits, reckoning);
  const [first = { unit: "second" as const, value: 0 }] = parts;

  return {
    nextChange,
    absolute: false,
    tense: span === 0 ? "present" : tense,
    text: formatDuration(parts, locale, formatStyle),
    unit: first.unit,
    value: signed(first.value, tense),
  };
};

const describeDate = (
  { date, now, locale, options, tense }: Measurement,
  limit: number,
): Description => {
  const { dateFormat = { dateStyle: "medium" }, timeZone } = options;
  const { count, unit } = measureUnit(date, now, { calendar: getCalendar(locale), timeZone });

  return {
    tense,
    unit,
    absolute: true,
    // A moment to come turns relative once it is near enough. A past one only moves further off.
    nextChange: tense === "future" ? date.getTime() - limit : null,
    text: formatDateTime(date, { dateFormat, locale, timeZone }),
    value: signed(count, tense),
  };
};

const describePresent = ({ date, locale, options }: Measurement): Description => {
  const { formatStyle = "long", labels, nowThreshold = 60, threshold } = options;
  const leaves = date.getTime() + nowThreshold * SECOND;

  const word = () =>
    isEnglish(locale)
      ? "just now"
      : relativeFormatter(locale, { numeric: "auto", style: formatStyle }).format(0, "second");

  return {
    absolute: false,
    nextChange:
      threshold === undefined ? leaves : Math.min(leaves, date.getTime() + threshold * SECOND + 1),
    tense: "present",
    text: labels?.now ?? word(),
    unit: "second",
    value: 0,
  };
};

/** The wrapping around a duration: the caller's, or English's own for several units. */
const getTemplate = ({ locale, options, tense }: Measurement) => {
  const own = options.labels?.[tense];

  if (own || (options.maxUnits ?? 1) <= 1 || !isEnglish(locale)) {
    return own;
  }

  return (duration: string) => (tense === "future" ? `in ${duration}` : `${duration} ago`);
};

/** The count a relative text is written from, in one unit or several. */
const measureText = (measurement: Measurement) => {
  const { date, now, locale, options, tense } = measurement;
  const { formatStyle = "long", maxUnits = 1, numeric = "auto", timeZone } = options;
  const template = getTemplate(measurement);
  const reckoning = { calendar: getCalendar(locale), timeZone };

  if (template && maxUnits > 1) {
    const { nextChange, parts } = measureDuration(date, now, maxUnits, reckoning);
    const [first = { unit: "second" as const, value: 0 }] = parts;

    return {
      nextChange,
      count: first.value,
      text: template(formatDuration(parts, locale, formatStyle)),
      unit: first.unit,
    };
  }

  const { count, nextChange, unit } = measureUnit(date, now, reckoning);

  const words = () =>
    relativeFormatter(locale, {
      // Only days are counted on the calendar, so only they may claim "yesterday". "Last year"
      // for a distance of one year would often be wrong.
      numeric: unit === "day" ? numeric : "always",
      style: formatStyle,
    }).format(tense === "future" ? count : -count, unit);

  return {
    count,
    nextChange,
    unit,
    text: template
      ? template(formatDuration([{ unit, value: count }], locale, formatStyle))
      : words(),
  };
};

const describeRelative = (measurement: Measurement): Description => {
  const { date, now, options, tense } = measurement;
  const { nowThreshold = 60, threshold } = options;
  const { count, nextChange, text, unit } = measureText(measurement);
  const boundaries = [nextChange];

  // A moment to come turns into "just now" before it arrives; a past one crosses `threshold`.
  if (tense === "future") {
    boundaries.push(date.getTime() - nowThreshold * SECOND + 1);
  } else if (threshold !== undefined) {
    boundaries.push(date.getTime() + threshold * SECOND + 1);
  }

  return {
    tense,
    text,
    unit,
    absolute: false,
    nextChange: Math.min(...boundaries.filter((time) => time > now.getTime())),
    value: signed(count, tense),
  };
};

const describe = (measurement: Measurement): Description => {
  const { date, now, options } = measurement;
  const { format, nowThreshold = 60, threshold } = options;
  const elapsed = Math.abs(date.getTime() - now.getTime());

  if (format === "duration") {
    return describeDuration(measurement);
  }

  if (threshold !== undefined && elapsed > threshold * SECOND) {
    return describeDate(measurement, threshold * SECOND);
  }

  return elapsed < nowThreshold * SECOND
    ? describePresent(measurement)
    : describeRelative(measurement);
};

/**
 * Describes how far a moment is from now, in the words of a locale. Returns `null` for an invalid
 * date.
 */
const getRelativeTime = (
  input: RelativeTimeInput,
  options: RelativeTimeOptions = {},
): RelativeTimeResult | null => {
  const date = parseRelativeTimeDate(input);
  const now = parseRelativeTimeDate(options.now ?? Date.now());

  if (!date || !now) {
    return null;
  }

  const locale = resolveLocale(options.locale);
  const tense = date.getTime() > now.getTime() ? "future" : "past";

  return {
    ...describe({ date, locale, now, options, tense }),
    date,
    direction: getTextDirection(locale),
    locale,
  };
};

/** The text of `getRelativeTime`, or `""` for an invalid date. */
const formatRelativeTime = (input: RelativeTimeInput, options?: RelativeTimeOptions): string =>
  getRelativeTime(input, options)?.text ?? "";

export {
  formatDateTime,
  formatRelativeTime,
  getDurationParts,
  getRelativeTime,
  getTextDirection,
  getTimeZoneName,
  getTimeZoneOffset,
  parseRelativeTimeDate,
  resolveLocale,
};

export type {
  DateTimeOptions,
  DurationPart,
  RelativeTimeFormat,
  RelativeTimeInput,
  RelativeTimeLabels,
  RelativeTimeNumeric,
  RelativeTimeOptions,
  RelativeTimeResult,
  RelativeTimeStyle,
  RelativeTimeTense,
  RelativeTimeUnit,
  TextDirection,
};
