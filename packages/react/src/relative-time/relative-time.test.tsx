import { act, render, screen } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { RelativeTime, useRelativeTime, useTimeZoneMatch } from "./index";
import type { RelativeTimeRootProps } from "./index";

const now = Date.parse("2026-11-28T12:00:00Z");

const advance = async (milliseconds: number) => {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(milliseconds);
  });
};

const Time = (props: RelativeTimeRootProps) => (
  <RelativeTime.Root data-testid="time" locale="en" timeZone="UTC" {...props} />
);

const time = () => screen.getByTestId("time");

const ZoneMatches = () =>
  [
    useTimeZoneMatch(["UTC"], { date: now, timeZone: "Europe/London" }),
    useTimeZoneMatch(["UTC"], { date: now, timeZone: "Asia/Tehran" }),
  ].join(" ");

describe("relative time parts", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(now);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders a machine-readable time with its language, direction and state", () => {
    render(<Time date={now - 3_600_000} />);

    expect({
      dateTime: time().getAttribute("datetime"),
      dir: time().getAttribute("dir"),
      lang: time().getAttribute("lang"),
      tag: time().tagName,
      tense: time().dataset.tense,
      text: time().textContent,
      unit: time().dataset.unit,
    }).toStrictEqual({
      dateTime: "2026-11-28T11:00:00.000Z",
      dir: "ltr",
      lang: "en",
      tag: "TIME",
      tense: "past",
      text: "1 hour ago",
      unit: "hour",
    });
  });

  it("writes right to left for a right-to-left language", () => {
    render(<Time date={now + 2 * 86_400_000} locale="fa" />);

    expect([time().getAttribute("dir"), time().getAttribute("lang")]).toStrictEqual(["rtl", "fa"]);
    expect(time().textContent).toBe("پس‌فردا");
  });

  it("keeps up with the clock", async () => {
    render(<Time date={now} />);

    expect(time().textContent).toBe("just now");

    await advance(60_000);
    expect(time().textContent).toBe("1 minute ago");

    await advance(59 * 60_000);
    expect(time().textContent).toBe("1 hour ago");
  });

  it("counts down to a moment and past it", async () => {
    render(<Time date={now + 3000} format="duration" />);

    expect(time().textContent).toBe("3 seconds");

    await advance(1000);
    expect(time().textContent).toBe("2 seconds");

    await advance(3000);
    expect(time().textContent).toBe("1 second");
  });

  it("shares one timer between every time on the page", async () => {
    const view = render(
      <>
        <Time date={now} />
        <RelativeTime.Root date={now - 30_000} locale="en" />
        <RelativeTime.Root date={now - 90_000} locale="en" />
      </>,
    );

    expect(vi.getTimerCount()).toBe(1);

    await advance(30_000);
    expect(view.container.textContent).toBe("just now1 minute ago2 minutes ago");

    view.unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("re-renders only when the text changes", async () => {
    const renders = vi.fn<() => void>();

    const Probe = () => {
      const state = useRelativeTime(now - 2 * 3_600_000, { locale: "en" });
      renders();

      return state?.text;
    };

    render(<Probe />);
    await advance(30 * 60_000);

    expect(renders).toHaveBeenCalledOnce();

    await advance(30 * 60_000);
    expect(renders).toHaveBeenCalledTimes(2);
  });

  it("needs no timer for a time that will not change", () => {
    render(<Time date={now - 90 * 86_400_000} threshold={3600} />);

    expect(time().dataset.absolute).toBe("");
    expect(time().textContent).toBe("Aug 30, 2026");
    expect(vi.getTimerCount()).toBe(0);
  });

  it("catches up when the page comes back into view", () => {
    render(<Time date={now} />);

    vi.setSystemTime(now + 3_600_000);
    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(time().textContent).toBe("1 hour ago");
  });

  it("takes settings from nested providers, and lets a part override them", () => {
    render(
      <RelativeTime.Provider locale="de" timeZone="UTC">
        <RelativeTime.Provider date={now - 3_600_000}>
          <RelativeTime.Root data-testid="time" />
          <RelativeTime.Root data-testid="own" locale="en" />
          <RelativeTime.Absolute data-testid="absolute" locale="en" timeZone="Asia/Tehran" />
          <RelativeTime.TimeZoneName data-testid="zone" locale="en" timeZone="Asia/Tehran" />
        </RelativeTime.Provider>
      </RelativeTime.Provider>,
    );

    expect(
      ["time", "own", "absolute", "zone"].map((id) => screen.getByTestId(id).textContent),
    ).toStrictEqual(["vor 1 Stunde", "1 hour ago", "Nov 28, 2026, 2:30 PM", "GMT+3:30"]);
  });

  it("takes content, classes and an element from its state", () => {
    render(
      <Time
        date={now + 3_600_000}
        className={(state) => state.tense ?? ""}
        render={<span data-testid="span" />}
      >
        {(state) => `${state.value} ${state.unit}`}
      </Time>,
    );

    const element = screen.getByTestId("span");

    expect([element.tagName, element.className, element.textContent]).toStrictEqual([
      "SPAN",
      "future",
      "1 hour",
    ]);
  });

  it("renders nothing for a date that names no moment", () => {
    const view = render(
      <>
        <RelativeTime.Root date="not a date" />
        <RelativeTime.Absolute date="not a date" />
        <RelativeTime.TimeZoneName />
      </>,
    );

    expect(view.container.childNodes).toHaveLength(0);
  });

  it("tells whether a zone repeats another", () => {
    expect(render(<ZoneMatches />).container.textContent).toBe("true false");
  });

  it("hydrates the server's date without a mismatch, then turns relative", () => {
    const errors = vi.spyOn(console, "error");
    const element = <RelativeTime.Root date={now - 3_600_000} locale="en" />;
    const container = document.createElement("div");
    container.append(document.createRange().createContextualFragment(renderToString(element)));

    expect(container.textContent).toBe("Nov 28, 2026");

    const onRecoverableError = vi.fn<() => void>();

    act(() => {
      hydrateRoot(container, element, { onRecoverableError });
    });

    expect(container.textContent).toBe("1 hour ago");
    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(errors).not.toHaveBeenCalled();
  });
});
