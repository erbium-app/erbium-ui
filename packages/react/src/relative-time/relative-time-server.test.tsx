// @vitest-environment node
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vite-plus/test";
import { RelativeTime } from "./index";

const date = "2026-11-28T09:00:00Z";

describe("relative time on the server", () => {
  it("writes the date in English and UTC when it knows neither the time nor the viewer", () => {
    const markup = renderToString(<RelativeTime.Root date={date} />);

    expect([
      markup.includes("Nov 28, 2026"),
      markup.includes('lang="en"'),
      markup.includes('dir="ltr"'),
      markup.includes('data-absolute=""'),
      markup.includes("data-tense"),
    ]).toStrictEqual([true, true, true, true, false]);
  });

  it("writes relative text in the given language when told the time", () => {
    const markup = renderToString(
      <RelativeTime.Root date={date} locale="fa" serverNow="2026-11-28T12:00:00Z" />,
    );

    expect([
      markup.includes("۳ ساعت پیش"),
      markup.includes('dir="rtl"'),
      markup.includes('data-tense="past"'),
    ]).toStrictEqual([true, true, true]);
  });

  it("writes the exact time and zone", () => {
    const markup = renderToString(
      <RelativeTime.Provider date={date}>
        <RelativeTime.Absolute />
        <RelativeTime.TimeZoneName />
      </RelativeTime.Provider>,
    );

    expect([markup.includes("9:00"), markup.includes(">UTC<")]).toStrictEqual([true, true]);
  });
});
