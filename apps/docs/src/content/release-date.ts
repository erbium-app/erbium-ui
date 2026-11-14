const dateFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Australia/Sydney",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export const releaseDay = (time: number) => Date.parse(dateFormat.format(time));

export const wasRecentlyUpdated = (publishedAt: number | undefined, today: number) =>
  publishedAt !== undefined && today >= publishedAt && today - publishedAt < 7 * 86_400_000;
