/* Relative time without React. `Intl` writes all the wording. */

/** A `Date`, an ISO 8601 string, or milliseconds since the epoch. */
type RelativeTimeInput = Date | number | string;

type RelativeTimeUnit = "second" | "minute" | "hour" | "day" | "week" | "month" | "year";

type RelativeTimeTense = "past" | "present" | "future";

type TextDirection = "ltr" | "rtl";

/** Wording in the language of `locale`, in place of what `Intl` writes. */
interface RelativeTimeLabels {
  /** The text within `nowThreshold`. */
  now?: string | undefined;
  /** Wraps an elapsed duration, such as "2 months". */
  past?: ((duration: string) => string) | undefined;
  /** Wraps a remaining duration. */
  future?: ((duration: string) => string) | undefined;
}

interface DateTimeOptions {
  /** A BCP 47 tag, such as `"fa-IR"`. @default the runtime's locale */
  locale?: string | undefined;
  /** An IANA zone, such as `"Asia/Tehran"`. @default the runtime's zone */
  timeZone?: string | undefined;
  dateFormat?: Intl.DateTimeFormatOptions | undefined;
}

interface RelativeTimeOptions extends DateTimeOptions {
  /** The moment to measure from. @default the current time */
  now?: RelativeTimeInput | undefined;
  /** `"duration"` leaves out "ago" and "in". @default "relative" */
  format?: "relative" | "duration" | undefined;
  /** @default "long" */
  formatStyle?: Intl.RelativeTimeFormatStyle | undefined;
  /** `"auto"` writes words such as "yesterday". @default "auto" */
  numeric?: Intl.RelativeTimeFormatNumeric | undefined;
  /** Units to write, largest first. Outside English, relative text needs `labels` for more than one. @default 1 */
  maxUnits?: number | undefined;
  /** Seconds either side of now that read as "just now". @default 60 */
  nowThreshold?: number | undefined;
  /** Seconds either side of now beyond which the date is written. */
  threshold?: number | undefined;
  labels?: RelativeTimeLabels | undefined;
}

interface RelativeTimeResult {
  date: Date;
  text: string;
  tense: RelativeTimeTense;
  /** The largest unit written. */
  unit: RelativeTimeUnit;
  /** How many of `unit`, negative in the past. */
  value: number;
  /** `text` is the date, because the distance passed `threshold`. */
  absolute: boolean;
  /** For `lang`. */
  locale: string;
  /** For `dir`. */
  direction: TextDirection;
  /** When to read the text again, in milliseconds since the epoch, or `null` if it is final. */
  nextChange: number | null;
}

interface DurationPart {
  unit: RelativeTimeUnit;
  value: number;
}

/** Where a distance is counted: the zone its days turn over in, and the locale of its calendar. */
type Place = Required<Pick<DateTimeOptions, "locale">> & Pick<DateTimeOptions, "timeZone">;

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

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
const memoize = <Options, Formatter>(
  Constructor: new (locale: string | undefined, options: Options) => Formatter,
) => {
  const cache = new Map<string, Formatter>();

  return (locale: string | undefined, options: Options): Formatter => {
    const key = JSON.stringify([locale, options]);
    const formatter = cache.get(key) ?? new Constructor(locale, options);
    cache.set(key, formatter);

    return formatter;
  };
};

const dateTimeFormatter = memoize<Intl.DateTimeFormatOptions, Intl.DateTimeFormat>(
  Intl.DateTimeFormat,
);

const listFormatter = memoize<Intl.ListFormatOptions, Intl.ListFormat>(Intl.ListFormat);
const numberFormatter = memoize<Intl.NumberFormatOptions, Intl.NumberFormat>(Intl.NumberFormat);

const relativeFormatter = memoize<Intl.RelativeTimeFormatOptions, Intl.RelativeTimeFormat>(
  Intl.RelativeTimeFormat,
);

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

/** The date an input names, or `null` when it names none. */
const parseRelativeTimeDate = (input: RelativeTimeInput | null | undefined): Date | null => {
  if (input === null || input === undefined || input === "") {
    return null;
  }

  const date = new Date(input);

  return Number.isNaN(date.getTime()) ? null : date;
};

/** Reads the numbers of a moment's date and time in a calendar and zone. */
const readDate = (time: number | Date, options: Intl.DateTimeFormatOptions) => {
  const parts = dateTimeFormatter("en-US", {
    day: "numeric",
    month: "numeric",
    numberingSystem: "latn",
    year: "numeric",
    ...options,
  }).formatToParts(time);

  return (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);
};

/** A zone's wall clock as a UTC timestamp, so days can be counted by dividing. */
const toWallClock = (date: Date, timeZone: string | undefined): number => {
  const read = readDate(date, {
    calendar: "gregory",
    hour: "numeric",
    hourCycle: "h23",
    minute: "numeric",
    second: "numeric",
    timeZone,
  });

  return Date.UTC(
    read("year"),
    read("month") - 1,
    read("day"),
    read("hour"),
    read("minute"),
    read("second"),
    date.getUTCMilliseconds(),
  );
};

/** The calendar whose months a locale counts. Calendars with leap months count Gregorian ones. */
const getMonthCalendar = (locale: string) => {
  const { calendar } = dateTimeFormatter(locale, {}).resolvedOptions();

  if (/^(?:coptic|ethio)/u.test(calendar)) {
    return { calendar, monthsPerYear: 13 };
  }

  return {
    calendar: /^(?:indian|islamic|persian)/u.test(calendar) ? calendar : "gregory",
    monthsPerYear: 12,
  };
};

/**
 * Whole months from one wall clock to a later one, and `anchor`, the wall clock the last of them
 * ends on. A month too short for the starting day ends on its last day.
 */
const countMonths = (from: number, to: number, locale: string) => {
  const { calendar, monthsPerYear } = getMonthCalendar(locale);
  const read = (wall: number) => readDate(wall, { calendar, timeZone: "UTC" });
  const start = read(from);
  const end = read(to);
  const midnight = Math.floor(to / DAY) * DAY;
  const timeOfDay = from - Math.floor(from / DAY) * DAY;
  const endsMonth = read(midnight + DAY)("day") === 1;
  const day = endsMonth ? Math.min(start("day"), end("day")) : start("day");

  let months = (end("year") - start("year")) * monthsPerYear + end("month") - start("month");
  let anchor = midnight + (day - end("day")) * DAY + timeOfDay;

  // This month's turn has not come, so the last whole month ended in the one before.
  if (anchor > to) {
    const previous = midnight - end("day") * DAY;
    const length = read(previous)("day");

    months -= 1;
    anchor = previous + (Math.min(start("day"), length) - length) * DAY + timeOfDay;
  }

  return { anchor, months, monthsPerYear };
};

/** Past time counts the whole seconds that have gone, time to come every started one. */
const toWholeSeconds = (difference: number): number =>
  // The absolute value keeps now itself from becoming `-0`.
  (difference > 0 ? Math.ceil(difference / SECOND) : Math.floor(Math.abs(difference) / SECOND)) *
  SECOND;

/** At most `maxUnits` neighbouring calendar units from the largest, without the zero ones. */
const measureDuration = (
  date: Date,
  now: Date,
  maxUnits: number,
  { locale, timeZone }: Place,
): DurationPart[] => {
  const span = toWholeSeconds(date.getTime() - now.getTime());
  let rest = span;
  let years = 0;
  let months = 0;

  // From a day on, count on the calendar: months differ in length and some days are not 24 hours.
  if (span >= DAY) {
    const [start = 0, end = 0] = [toWallClock(now, timeZone), toWallClock(date, timeZone)].toSorted(
      (a, b) => a - b,
    );

    // The calendar distance is the elapsed one plus whatever the clocks were moved in between.
    const until = end + span - Math.abs(date.getTime() - now.getTime());
    const whole = countMonths(start, until, locale);

    years = Math.floor(whole.months / whole.monthsPerYear);
    months = whole.months % whole.monthsPerYear;
    rest = until - whole.anchor;
  }

  const days = Math.floor(rest / DAY);

  const units: DurationPart[] = [
    { unit: "year", value: years },
    { unit: "month", value: months },
    { unit: "week", value: Math.floor(days / 7) },
    { unit: "day", value: days % 7 },
    { unit: "hour", value: Math.floor((rest % DAY) / HOUR) },
    { unit: "minute", value: Math.floor((rest % HOUR) / MINUTE) },
    { unit: "second", value: Math.floor((rest % MINUTE) / SECOND) },
  ];

  return (
    units
      // With nothing above zero, the index is -1, which keeps the seconds.
      .slice(units.findIndex((part) => part.value > 0))
      .slice(0, Math.max(1, Math.floor(maxUnits)))
      .filter((part, index) => index === 0 || part.value > 0)
  );
};

/** The one unit relative text is written in, and how many of it. */
const measureUnit = (date: Date, now: Date, { locale, timeZone }: Place): DurationPart => {
  const difference = date.getTime() - now.getTime();
  const seconds = toWholeSeconds(difference) / SECOND;

  if (seconds < 60) {
    return { unit: "second", value: seconds };
  }

  if (seconds < 3600) {
    return { unit: "minute", value: Math.floor(seconds / 60) };
  }

  // From an hour, time to come counts every started minute, so "in 2 hours" holds for a minute.
  const round = difference > 0 ? Math.ceil : Math.floor;
  const hours = Math.floor(round(Math.abs(difference) / MINUTE) / 60);

  if (hours < 24) {
    return { unit: "hour", value: hours };
  }

  const [start = 0, end = 0] = [toWallClock(now, timeZone), toWallClock(date, timeZone)]
    .map((wall) => Math.floor(wall / DAY) * DAY)
    .toSorted((a, b) => a - b);

  const days = (end - start) / DAY;

  // A 25 hour day can hold 24 hours and no calendar day.
  if (days === 0) {
    return { unit: "hour", value: hours };
  }

  const { months, monthsPerYear } = countMonths(start, end, locale);

  if (months >= monthsPerYear) {
    return { unit: "year", value: Math.floor(months / monthsPerYear) };
  }

  if (months >= 1) {
    return { unit: "month", value: months };
  }

  return days >= 7 ? { unit: "week", value: Math.floor(days / 7) } : { unit: "day", value: days };
};

/**
 * The distance between two moments as calendar units, largest first. Months and years are those of
 * the calendar of `locale`.
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

  return start && end
    ? measureDuration(end, start, maxUnits, { locale: resolveLocale(locale), timeZone })
    : [];
};

/** A moment's date and time, by default a medium date and a short time. `""` when invalid. */
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

const isEnglish = (locale: string) => new Intl.Locale(locale).language === "en";

const formatDuration = (
  parts: DurationPart[],
  locale: string,
  style: Intl.RelativeTimeFormatStyle,
) =>
  listFormatter(locale, { style, type: "unit" }).format(
    parts.map(({ unit, value }) =>
      numberFormatter(locale, { unit, style: "unit", unitDisplay: style }).format(value),
    ),
  );

/** One description to make, with the locale resolved. */
interface Task {
  date: Date;
  now: Date;
  locale: string;
  options: RelativeTimeOptions;
}

const nothing: DurationPart = { unit: "second", value: 0 };

const getTense = ({ date, now }: Task) => (date > now ? "future" : "past");

const toDescription = (
  task: Task,
  text: string,
  { unit, value }: DurationPart,
  tense: RelativeTimeTense = getTense(task),
) => ({
  text,
  unit,
  tense,
  absolute: false,
  // `|| 0` turns `-0` into `0`.
  value: (getTense(task) === "future" ? value : -value) || 0,
});

const describeDuration = (task: Task) => {
  const { date, now, locale, options } = task;
  const { formatStyle = "long", maxUnits = 1, timeZone } = options;
  const parts = measureDuration(date, now, maxUnits, { locale, timeZone });
  const [first = nothing] = parts;
  const text = formatDuration(parts, locale, formatStyle);

  return toDescription(task, text, first, first.value === 0 ? "present" : getTense(task));
};

const describeDate = (task: Task) => {
  const { date, now, locale, options } = task;
  const { dateFormat = { dateStyle: "medium" }, timeZone } = options;
  const text = formatDateTime(date, { dateFormat, locale, timeZone });
  const unit = measureUnit(date, now, { locale, timeZone });

  return { ...toDescription(task, text, unit), absolute: true };
};

const describePresent = (task: Task) => {
  const { locale, options } = task;
  const { formatStyle = "long", labels } = options;

  const word = () =>
    isEnglish(locale)
      ? "just now"
      : relativeFormatter(locale, { numeric: "auto", style: formatStyle }).format(0, "second");

  return toDescription(task, labels?.now ?? word(), nothing, "present");
};

const describeRelative = (task: Task) => {
  const { date, now, locale, options } = task;
  const { formatStyle = "long", labels, maxUnits = 1, numeric = "auto", timeZone } = options;
  const place = { locale, timeZone };
  const tense = getTense(task);

  const wrapEnglish = (duration: string) =>
    tense === "future" ? `in ${duration}` : `${duration} ago`;

  // `Intl` words one unit by itself. Several need wrapping, which only English has by default.
  const wrap = labels?.[tense] ?? (maxUnits > 1 && isEnglish(locale) ? wrapEnglish : undefined);

  const parts =
    wrap && maxUnits > 1
      ? measureDuration(date, now, maxUnits, place)
      : [measureUnit(date, now, place)];

  const [first = nothing] = parts;

  const text = wrap
    ? wrap(formatDuration(parts, locale, formatStyle))
    : relativeFormatter(locale, {
        // Only days are counted on the calendar, so only they may claim "yesterday".
        numeric: first.unit === "day" ? numeric : "always",
        style: formatStyle,
      }).format(tense === "future" ? first.value : -first.value, first.unit);

  return toDescription(task, text, first);
};

const describe = (task: Task) => {
  const { date, now, options } = task;
  const { format, nowThreshold = 60, threshold } = options;
  const distance = Math.abs(date.getTime() - now.getTime());

  if (format === "duration") {
    return describeDuration(task);
  }

  if (threshold !== undefined && distance > threshold * SECOND) {
    return describeDate(task);
  }

  return distance < nowThreshold * SECOND ? describePresent(task) : describeRelative(task);
};

/**
 * When to read the text again: each second for durations, several units and dates within an hour,
 * and each minute otherwise. Counts change in step with the date, and days with the wall clock.
 */
const getNextCheck = (difference: number, now: number, options: RelativeTimeOptions) => {
  const { format, maxUnits = 1, nowThreshold = 60, threshold = Number.NaN } = options;

  const everySecond =
    format === "duration" || maxUnits > 1 || Math.abs(difference) <= HOUR + MINUTE;

  const step = everySecond ? SECOND : MINUTE;
  const steps = [difference, -now].map((offset) => ((offset % step) + step) % step || step);
  // Just after a step: a moment to come turns "just now", and a past one crosses `threshold`.
  const edges = [difference - nowThreshold * SECOND + 1, difference + threshold * SECOND + 1];

  return now + Math.min(...steps, ...edges.filter((wait) => wait > 0));
};

/** How far a moment is from now, in the words of a locale. `null` for an invalid date. */
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
  const description = describe({ date, locale, now, options });
  // A past moment written as its date stays that way.
  const final = description.absolute && date <= now;

  return {
    ...description,
    date,
    direction: getTextDirection(locale),
    locale,
    nextChange: final ? null : getNextCheck(date.getTime() - now.getTime(), now.getTime(), options),
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
  RelativeTimeInput,
  RelativeTimeLabels,
  RelativeTimeOptions,
  RelativeTimeResult,
  RelativeTimeTense,
  RelativeTimeUnit,
  TextDirection,
};
