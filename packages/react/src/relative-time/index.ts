import {
  RelativeTimeAbsolute,
  RelativeTimeProvider,
  RelativeTimeRoot,
  RelativeTimeZoneName,
} from "./parts";

/**
 * Times told by how far they are from now, in any language: `Root` is a live "3 hours ago",
 * `Absolute` the exact date, `TimeZoneName` the zone it is written in, and `Provider` shares a
 * date, language and zone between them.
 */
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
