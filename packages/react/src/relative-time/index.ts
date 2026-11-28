import {
  RelativeTimeAbsolute,
  RelativeTimeProvider,
  RelativeTimeRoot,
  RelativeTimeZoneName,
} from "./parts";

/** `Root` is a live "3 hours ago" and `Absolute` the exact date. `Provider` shares their settings. */
const RelativeTime = {
  Absolute: RelativeTimeAbsolute,
  Provider: RelativeTimeProvider,
  Root: RelativeTimeRoot,
  TimeZoneName: RelativeTimeZoneName,
};

export { RelativeTime };

export { useRelativeTime, useRelativeTimeLocale, useTimeZoneMatch } from "./parts";

export type {
  RelativeTimeAbsoluteProps,
  RelativeTimeAbsoluteState,
  RelativeTimeLocale,
  RelativeTimeProviderProps,
  RelativeTimeRootProps,
  RelativeTimeSettings,
  RelativeTimeState,
  RelativeTimeZoneNameProps,
} from "./parts";

export * from "./core";
