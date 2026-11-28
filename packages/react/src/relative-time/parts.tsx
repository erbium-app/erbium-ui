import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { resolveStateProp } from "../internal/resolve";
import type { StateProp } from "../internal/resolve";
import { subscribeClock } from "./clock";
import {
  formatDateTime,
  getRelativeTime,
  getTextDirection,
  getTimeZoneName,
  getTimeZoneOffset,
  parseRelativeTimeDate,
  resolveLocale,
} from "./core";
import type {
  RelativeTimeInput,
  RelativeTimeOptions,
  RelativeTimeResult,
  RelativeTimeTense,
  RelativeTimeUnit,
  TextDirection,
} from "./core";

/** What a `Provider` shares and every part and hook accepts. */
interface RelativeTimeSettings extends Omit<RelativeTimeOptions, "now"> {
  date?: RelativeTimeInput | undefined;
  /**
   * The time the server rendered at. With it, the server's HTML already holds relative text;
   * without it, the server writes the date and the text turns relative after hydration.
   */
  serverNow?: RelativeTimeInput | undefined;
}

interface RelativeTimeLocale {
  /** For `lang`. */
  locale: string;
  /** For `dir`. */
  direction: TextDirection;
}

interface RelativeTimeState extends Record<string, unknown>, RelativeTimeLocale {
  date: Date;
  text: string;
  /** `text` is the date: beyond `threshold`, or rendered by a server without `serverNow`. */
  absolute: boolean;
  /** `null`, like `unit` and `value`, in server HTML rendered without `serverNow`. */
  tense: RelativeTimeTense | null;
  unit: RelativeTimeUnit | null;
  value: number | null;
}

// The server cannot know the viewer's language or zone, so it writes these unless told otherwise.
// The client renders the same while hydrating.
const SERVER_LOCALE = "en";
const SERVER_TIME_ZONE = "UTC";

const SettingsContext = React.createContext<RelativeTimeSettings>({});

/** Settings over the provider's, ignoring the ones left `undefined`. */
const mergeSettings = (
  inherited: RelativeTimeSettings,
  own: RelativeTimeSettings,
): RelativeTimeSettings => ({
  ...inherited,
  ...Object.fromEntries(Object.entries(own).filter(([, value]) => value !== undefined)),
  labels: own.labels ? { ...inherited.labels, ...own.labels } : inherited.labels,
});

const useSettings = (own: RelativeTimeSettings) => mergeSettings(React.use(SettingsContext), own);

type RelativeTimeProviderProps = RelativeTimeSettings & { children?: React.ReactNode };

/**
 * Shares a date, language, zone or wording with the parts and hooks inside it. Nested providers
 * add to the ones around them. Renders no element.
 */
const RelativeTimeProvider = ({
  children,
  date,
  dateFormat,
  format,
  formatStyle,
  labels,
  locale,
  maxUnits,
  nowThreshold,
  numeric,
  serverNow,
  threshold,
  timeZone,
}: RelativeTimeProviderProps) => {
  const inherited = React.use(SettingsContext);

  const settings = React.useMemo(
    () =>
      mergeSettings(inherited, {
        date,
        dateFormat,
        format,
        formatStyle,
        labels,
        locale,
        maxUnits,
        nowThreshold,
        numeric,
        serverNow,
        threshold,
        timeZone,
      }),
    [
      date,
      dateFormat,
      format,
      formatStyle,
      inherited,
      labels,
      locale,
      maxUnits,
      nowThreshold,
      numeric,
      serverNow,
      threshold,
      timeZone,
    ],
  );

  return <SettingsContext value={settings}>{children}</SettingsContext>;
};

const subscribeNever = () => () => {
  // Whether the client has hydrated never changes back.
};

const useHydrated = () =>
  React.useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );

/** The locale and zone to write in now: fixed ones until hydrated, then the viewer's. */
const useViewer = ({ locale, timeZone }: Pick<RelativeTimeSettings, "locale" | "timeZone">) => {
  const hydrated = useHydrated();

  return {
    locale: resolveLocale(locale ?? (hydrated ? undefined : SERVER_LOCALE)),
    timeZone: timeZone ?? (hydrated ? undefined : SERVER_TIME_ZONE),
  };
};

/** The language and direction of the surrounding provider's text, for its container. */
const useRelativeTimeLocale = (locale?: string): RelativeTimeLocale => {
  const settings = useSettings({ locale });
  const viewer = useViewer(settings);

  return { direction: getTextDirection(viewer.locale), locale: viewer.locale };
};

const toTime = (input: RelativeTimeInput | undefined) =>
  parseRelativeTimeDate(input)?.getTime() ?? Number.NaN;

type StoreSettings = Omit<RelativeTimeSettings, "date" | "serverNow">;

/** What of a state can be seen. The rest is fixed for as long as the settings are. */
const visible = ["absolute", "tense", "text", "unit", "value"] as const;

const withoutSchedule = (result: RelativeTimeResult | null): RelativeTimeState | null => {
  if (!result) {
    return null;
  }

  const { nextChange: _nextChange, ...state } = result;

  return state;
};

/** The server's state without its time: the date, in a language and zone both sides agree on. */
const describeDate = (date: number, settings: StoreSettings): RelativeTimeState | null => {
  const parsed = parseRelativeTimeDate(date);

  if (!parsed) {
    return null;
  }

  const locale = resolveLocale(settings.locale);
  const { dateFormat = { dateStyle: "medium" }, timeZone } = settings;

  return {
    locale,
    absolute: true,
    date: parsed,
    direction: getTextDirection(locale),
    tense: null,
    text: formatDateTime(parsed, { dateFormat, locale, timeZone }),
    unit: null,
    value: null,
  };
};

/** Snapshots for `useSyncExternalStore`: the same object for as long as nothing visible differs. */
const createStore = (date: number, serverNow: number, settings: StoreSettings) => {
  let client: RelativeTimeState | null = null;
  let server: { state: RelativeTimeState | null } | null = null;

  const read = (now: number) => getRelativeTime(date, { ...settings, now });

  const renderServer = () => {
    const options = {
      ...settings,
      locale: settings.locale ?? SERVER_LOCALE,
      timeZone: settings.timeZone ?? SERVER_TIME_ZONE,
    };

    return Number.isNaN(serverNow)
      ? describeDate(date, options)
      : withoutSchedule(getRelativeTime(date, { ...options, now: serverNow }));
  };

  return {
    getServerSnapshot: () => {
      server ??= { state: renderServer() };

      return server.state;
    },
    getSnapshot: () => {
      const next = withoutSchedule(read(Date.now()));

      if (!next) {
        return null;
      }

      if (!client || visible.some((key) => client?.[key] !== next[key])) {
        client = next;
      }

      return client;
    },
    subscribe: (notify: () => void) =>
      subscribeClock(() => read(Date.now())?.nextChange ?? null, notify),
  };
};

/**
 * The live description of how far a date is from now, in the settings of the surrounding
 * provider. Re-renders only when it reads differently. `null` without a valid date.
 */
const useRelativeTime = (
  date?: RelativeTimeInput,
  options: Omit<RelativeTimeSettings, "date"> = {},
): RelativeTimeState | null => {
  const {
    date: dateInput,
    serverNow: serverNowInput,
    dateFormat,
    format,
    formatStyle,
    labels,
    locale,
    maxUnits,
    nowThreshold,
    numeric,
    threshold,
    timeZone,
  } = useSettings({ ...options, date });

  // Times rather than objects, so a `new Date()` written inline does not restart anything.
  const time = toTime(dateInput);
  const serverTime = toTime(serverNowInput);

  const store = React.useMemo(
    () =>
      createStore(time, serverTime, {
        dateFormat,
        format,
        formatStyle,
        labels,
        locale,
        maxUnits,
        nowThreshold,
        numeric,
        threshold,
        timeZone,
      }),
    [
      dateFormat,
      format,
      formatStyle,
      labels,
      locale,
      maxUnits,
      nowThreshold,
      numeric,
      serverTime,
      threshold,
      time,
      timeZone,
    ],
  );

  return React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
};

/** `render`, plus `className` and `style` as values or functions of the part's state. */
type PartProps<Tag extends React.ElementType, State> = Omit<
  useRender.ComponentProps<Tag, State>,
  "className" | "style" | "children"
> & {
  className?: StateProp<string | undefined, State>;
  style?: StateProp<React.CSSProperties | undefined, State>;
};

// Root

type RelativeTimeRootProps = Omit<PartProps<"time", RelativeTimeState>, "dateTime"> &
  RelativeTimeSettings & {
    /** Replaces the text: content, or a function of the state. */
    children?: StateProp<React.ReactNode, RelativeTimeState>;
  };

/** State that styling reads. The rest would only put noise in the DOM. */
const rootAttributes = {
  date: () => null,
  direction: () => null,
  locale: () => null,
  text: () => null,
  value: () => null,
};

/**
 * A live `<time>`, such as "3 hours ago". It sets `lang` and `dir` for the language it writes.
 * Renders nothing without a valid date.
 *
 * State: `data-tense`, `data-unit` and `data-absolute`.
 */
const RelativeTimeRoot = ({
  date,
  serverNow,
  dateFormat,
  format,
  formatStyle,
  labels,
  locale,
  maxUnits,
  nowThreshold,
  numeric,
  threshold,
  timeZone,
  render,
  className,
  style,
  children,
  ...props
}: RelativeTimeRootProps) => {
  const state = useRelativeTime(date, {
    dateFormat,
    format,
    formatStyle,
    labels,
    locale,
    maxUnits,
    nowThreshold,
    numeric,
    serverNow,
    threshold,
    timeZone,
  });

  return useRender({
    render,
    defaultTagName: "time",
    enabled: state !== null,
    props:
      state === null
        ? undefined
        : mergeProps<"time">(
            {
              dateTime: state.date.toISOString(),
              dir: state.direction,
              lang: state.locale,
              // A server's `Intl` data can punctuate a date differently from the browser's.
              suppressHydrationWarning: true,
            },
            props,
            {
              children: children === undefined ? state.text : resolveStateProp(children, state),
              className: resolveStateProp(className, state),
              style: resolveStateProp(style, state),
            },
          ),
    state: state ?? undefined,
    stateAttributesMapping: rootAttributes,
  });
};

// Absolute

interface RelativeTimeAbsoluteState extends Record<string, unknown>, RelativeTimeLocale {
  date: Date;
  text: string;
}

type RelativeTimeAbsoluteProps = Omit<PartProps<"time", RelativeTimeAbsoluteState>, "dateTime"> &
  Pick<RelativeTimeSettings, "date" | "dateFormat" | "locale" | "timeZone"> & {
    /** Replaces the text: content, or a function of the state. */
    children?: StateProp<React.ReactNode, RelativeTimeAbsoluteState>;
  };

const textAttributes = {
  date: () => null,
  direction: () => null,
  locale: () => null,
  text: () => null,
};

/**
 * The exact moment as a `<time>`, with its date and time by default. Its `dateFormat` is its own:
 * the provider's only applies to `Root` beyond `threshold`.
 */
const RelativeTimeAbsolute = ({
  date: dateProp,
  dateFormat,
  locale: localeProp,
  timeZone: timeZoneProp,
  render,
  className,
  style,
  children,
  ...props
}: RelativeTimeAbsoluteProps) => {
  const settings = useSettings({ date: dateProp, locale: localeProp, timeZone: timeZoneProp });
  const viewer = useViewer(settings);
  const date = parseRelativeTimeDate(settings.date);

  const state: RelativeTimeAbsoluteState | null = date && {
    date,
    direction: getTextDirection(viewer.locale),
    locale: viewer.locale,
    text: formatDateTime(date, { ...viewer, dateFormat }),
  };

  return useRender({
    render,
    defaultTagName: "time",
    enabled: state !== null,
    props:
      state === null
        ? undefined
        : mergeProps<"time">(
            {
              dateTime: state.date.toISOString(),
              dir: state.direction,
              lang: state.locale,
              suppressHydrationWarning: true,
            },
            props,
            {
              children: children === undefined ? state.text : resolveStateProp(children, state),
              className: resolveStateProp(className, state),
              style: resolveStateProp(style, state),
            },
          ),
    state: state ?? undefined,
    stateAttributesMapping: textAttributes,
  });
};

// Time zone name

type RelativeTimeZoneNameProps = useRender.ComponentProps<"bdi"> &
  Pick<RelativeTimeSettings, "date" | "locale" | "timeZone"> &
  Pick<Intl.DateTimeFormatOptions, "timeZoneName">;

/**
 * The name of a zone at the date, such as "UTC" or "GMT+3:30", in a `<bdi>` so its signs and
 * digits keep their order in either direction. Renders nothing without a valid date.
 */
const RelativeTimeZoneName = ({
  date: dateProp,
  locale: localeProp,
  timeZone: timeZoneProp,
  timeZoneName,
  render,
  ...props
}: RelativeTimeZoneNameProps) => {
  const settings = useSettings({ date: dateProp, locale: localeProp, timeZone: timeZoneProp });
  const viewer = useViewer(settings);
  const date = parseRelativeTimeDate(settings.date);

  return useRender({
    defaultTagName: "bdi",
    enabled: date !== null,
    props: mergeProps<"bdi">(
      {
        children: date ? getTimeZoneName(date, { ...viewer, timeZoneName }) : null,
        lang: viewer.locale,
        suppressHydrationWarning: true,
      },
      props,
    ),
    render,
  });
};

/**
 * Whether a zone, by default the viewer's, is as far from UTC at the date as any of `others`, so
 * a list of zones can leave out a repeat. `false` until hydrated.
 */
const useTimeZoneMatch = (
  others: readonly string[],
  options: Pick<RelativeTimeSettings, "date" | "timeZone"> = {},
): boolean => {
  const { date, timeZone } = useSettings(options);
  const hydrated = useHydrated();
  const parsed = parseRelativeTimeDate(date);

  if (!hydrated || !parsed) {
    return false;
  }

  const offset = getTimeZoneOffset(parsed, timeZone);

  return others.some((other) => getTimeZoneOffset(parsed, other) === offset);
};

export {
  RelativeTimeAbsolute,
  RelativeTimeProvider,
  RelativeTimeRoot,
  RelativeTimeZoneName,
  useRelativeTime,
  useRelativeTimeLocale,
  useTimeZoneMatch,
};

export type {
  RelativeTimeAbsoluteProps,
  RelativeTimeAbsoluteState,
  RelativeTimeLocale,
  RelativeTimeProviderProps,
  RelativeTimeRootProps,
  RelativeTimeSettings,
  RelativeTimeState,
  RelativeTimeZoneNameProps,
};
