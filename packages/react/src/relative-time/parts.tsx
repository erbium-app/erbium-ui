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
  /** The time of the server render. With it, the server's HTML holds relative text, not the date. */
  serverNow?: RelativeTimeInput | undefined;
}

interface RelativeTimeLocale {
  /** For `lang`. */
  locale: string;
  /** For `dir`. */
  direction: TextDirection;
}

interface RelativeTimeAbsoluteState extends Record<string, unknown>, RelativeTimeLocale {
  date: Date;
  text: string;
}

interface RelativeTimeState extends RelativeTimeAbsoluteState {
  /** `text` is the date: beyond `threshold`, or from a server without `serverNow`. */
  absolute: boolean;
  /** `null`, like `unit` and `value`, in server HTML rendered without `serverNow`. */
  tense: RelativeTimeTense | null;
  unit: RelativeTimeUnit | null;
  value: number | null;
}

// A server cannot know the viewer's language or zone. The client renders these while hydrating.
const SERVER_LOCALE = "en";
const SERVER_TIME_ZONE = "UTC";

const SettingsContext = React.createContext<RelativeTimeSettings>({});

/** A part's own settings over the provider's, ignoring those left `undefined`. */
const mergeSettings = (
  inherited: RelativeTimeSettings,
  own: RelativeTimeSettings,
): RelativeTimeSettings => ({
  ...inherited,
  ...Object.fromEntries(
    Object.entries(own)
      .filter(([, value]) => value !== undefined)
      // By its time, so a `new Date()` written inline changes nothing.
      .map(([key, value]) => [key, value instanceof Date ? value.getTime() : value]),
  ),
  labels:
    inherited.labels && own.labels
      ? { ...inherited.labels, ...own.labels }
      : (own.labels ?? inherited.labels),
});

/** The merged settings, as the same object until one of them changes. */
const useSettings = (own: RelativeTimeSettings): RelativeTimeSettings => {
  const {
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
  } = mergeSettings(React.use(SettingsContext), own);

  return React.useMemo(
    () => ({
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
};

type RelativeTimeProviderProps = RelativeTimeSettings & { children?: React.ReactNode };

/** Shares settings with the parts and hooks inside it. Nested providers add up. No element. */
const RelativeTimeProvider = ({ children, ...own }: RelativeTimeProviderProps) => {
  const settings = useSettings(own);

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

/** The language and zone to write in: fixed ones until hydrated, then the viewer's. */
const useViewer = ({ locale, timeZone }: RelativeTimeSettings) => {
  const hydrated = useHydrated();
  const resolved = resolveLocale(locale ?? (hydrated ? undefined : SERVER_LOCALE));

  return {
    direction: getTextDirection(resolved),
    locale: resolved,
    timeZone: timeZone ?? (hydrated ? undefined : SERVER_TIME_ZONE),
  };
};

/** The language and direction of the surrounding provider's text, for its container. */
const useRelativeTimeLocale = (locale?: string): RelativeTimeLocale => {
  const viewer = useViewer(useSettings({ locale }));

  return { direction: viewer.direction, locale: viewer.locale };
};

const toState = ({ nextChange: _nextChange, ...state }: RelativeTimeResult): RelativeTimeState =>
  state;

/** What a server renders: relative text if told its time, the date otherwise. */
const readServer = ({
  date = "",
  serverNow,
  ...options
}: RelativeTimeSettings): RelativeTimeState | null => {
  const now = parseRelativeTimeDate(serverNow);

  const shared = {
    ...options,
    locale: options.locale ?? SERVER_LOCALE,
    timeZone: options.timeZone ?? SERVER_TIME_ZONE,
  };

  const result = getRelativeTime(date, { ...shared, now: now ?? undefined });

  if (!result) {
    return null;
  }

  if (now) {
    return toState(result);
  }

  const { dateFormat = { dateStyle: "medium" } } = shared;

  return {
    ...toState(result),
    absolute: true,
    tense: null,
    text: formatDateTime(result.date, { ...shared, dateFormat }),
    unit: null,
    value: null,
  };
};

/** The state a change of which re-renders. The rest is fixed by the settings. */
const visible = ["absolute", "tense", "text", "unit", "value"] as const;

/** The arguments of `useSyncExternalStore`, with the same snapshot while nothing visible differs. */
const createStore = (settings: RelativeTimeSettings) => {
  const { date = "", serverNow: _serverNow, ...options } = settings;
  const read = () => getRelativeTime(date, options);
  let client: RelativeTimeState | null = null;
  let server: RelativeTimeState | null = null;

  return {
    getServerSnapshot: () => (server ??= readServer(settings)),
    getSnapshot: () => {
      const result = read();

      if (!result) {
        return null;
      }

      if (!client || visible.some((key) => client?.[key] !== result[key])) {
        client = toState(result);
      }

      return client;
    },
    subscribe: (notify: () => void) => subscribeClock(() => read()?.nextChange ?? null, notify),
  };
};

/**
 * The live description of how far a date is from now. Re-renders only when it reads differently.
 * `null` without a valid date.
 */
const useRelativeTime = (
  date?: RelativeTimeInput,
  options: Omit<RelativeTimeSettings, "date"> = {},
): RelativeTimeState | null => {
  const settings = useSettings({ ...options, date });
  const store = React.useMemo(() => createStore(settings), [settings]);

  return React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
};

/** `render`, plus `className`, `style` and `children` as values or functions of the state. */
type TimePartProps<State extends Record<string, unknown>> = Omit<
  useRender.ComponentProps<"time", State>,
  "children" | "className" | "dateTime" | "style"
> & {
  children?: StateProp<React.ReactNode, State>;
  className?: StateProp<string | undefined, State>;
  style?: StateProp<React.CSSProperties | undefined, State>;
};

/** Keeps out of `data-*` what styling has no use for. */
const hiddenState = {
  date: () => null,
  direction: () => null,
  locale: () => null,
  text: () => null,
  value: () => null,
};

/** The `<time>` of a state, in its language and direction. Nothing without a state. */
const useTimeElement = <State extends RelativeTimeAbsoluteState>(
  state: State | null,
  { render, className, style, children, ...props }: TimePartProps<State>,
) =>
  useRender({
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
    stateAttributesMapping: hiddenState,
  });

// Root

type RelativeTimeRootProps = TimePartProps<RelativeTimeState> & RelativeTimeSettings;

/**
 * A live `<time>`, such as "3 hours ago". Renders nothing without a valid date.
 *
 * State: `data-tense`, `data-unit` and `data-absolute`.
 */
const RelativeTimeRoot = ({
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

  return useTimeElement(state, props);
};

// Absolute

type RelativeTimeAbsoluteProps = TimePartProps<RelativeTimeAbsoluteState> &
  Pick<RelativeTimeSettings, "date" | "dateFormat" | "locale" | "timeZone">;

/** The exact date and time as a `<time>`. The provider's `dateFormat` does not apply to it. */
const RelativeTimeAbsolute = ({
  date,
  dateFormat,
  locale,
  timeZone,
  ...props
}: RelativeTimeAbsoluteProps) => {
  const settings = useSettings({ date, locale, timeZone });
  const viewer = useViewer(settings);
  const parsed = parseRelativeTimeDate(settings.date);

  const state = parsed && {
    date: parsed,
    direction: viewer.direction,
    locale: viewer.locale,
    text: formatDateTime(parsed, { ...viewer, dateFormat }),
  };

  return useTimeElement(state, props);
};

// Time zone name

type RelativeTimeZoneNameProps = useRender.ComponentProps<"bdi"> &
  Pick<RelativeTimeSettings, "date" | "locale" | "timeZone"> &
  Pick<Intl.DateTimeFormatOptions, "timeZoneName">;

/** A zone's name at the date, in a `<bdi>` so "GMT+3:30" keeps its order in either direction. */
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
 * Whether a zone, by default the viewer's, is as far from UTC at the date as one of `others`.
 * `false` until hydrated.
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
