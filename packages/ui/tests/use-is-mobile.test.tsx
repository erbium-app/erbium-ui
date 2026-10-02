import { act, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vite-plus/test";
import { MOBILE_QUERY, useIsMobile } from "@erbium/ui/hooks/use-is-mobile";

function stubMatchMedia(initial: boolean) {
  const listeners = new Set<() => void>();
  const queries: string[] = [];
  let matches = initial;
  vi.stubGlobal("matchMedia", (query: string) => {
    queries.push(query);
    return {
      get matches() {
        return matches;
      },
      media: query,
      addEventListener: (_: string, listener: () => void) => listeners.add(listener),
      removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
    };
  });
  return {
    queries,
    setMatches: (next: boolean) => {
      matches = next;
      listeners.forEach((listener) => listener());
    },
  };
}

function Probe() {
  return <span>{useIsMobile({ noSsr: true }) ? "mobile" : "desktop"}</span>;
}

afterEach(() => vi.unstubAllGlobals());

test("useIsMobile works without any provider and asks the shared mobile query", () => {
  const { queries } = stubMatchMedia(false);
  render(<Probe />);
  expect(screen.getByText("desktop")).toBeTruthy();
  expect(queries).toContain(MOBILE_QUERY);
});

test("useIsMobile follows the viewport through matchMedia changes", () => {
  const { setMatches } = stubMatchMedia(false);
  render(<Probe />);
  act(() => setMatches(true));
  expect(screen.getByText("mobile")).toBeTruthy();
});

test("useIsMobile is already mobile on the first render when the viewport is narrow", () => {
  stubMatchMedia(true);
  render(<Probe />);
  expect(screen.getByText("mobile")).toBeTruthy();
});
