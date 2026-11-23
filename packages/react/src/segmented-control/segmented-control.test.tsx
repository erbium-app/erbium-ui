import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeAll, describe, expect, it, vi } from "vite-plus/test";
import { SegmentedControl } from "./index";

// jsdom has no layout. Each element carries its box in `data-box` as "left top width height",
// relative to its parent, and the control itself sits at (100, 400) on the page.
const CONTROL = { left: 100, top: 400 };

const boxOf = (element: HTMLElement) => {
  const [left = 0, top = 0, width = 0, height = 0] = (element.dataset.box ?? "")
    .split(" ")
    .map(Number);

  return { height, left, top, width };
};

const pageRectOf = (element: HTMLElement) => {
  const box = boxOf(element);
  const isControl = element.dataset.control !== undefined;

  return DOMRect.fromRect({
    height: box.height,
    width: box.width,
    x: isControl ? CONTROL.left : CONTROL.left + box.left,
    y: isControl ? CONTROL.top : CONTROL.top + box.top,
  });
};

class ResizeObserverStub {
  disconnect = vi.fn<() => void>();
  observe = vi.fn<(target: Element) => void>();
  unobserve = vi.fn<(target: Element) => void>();
}

const stubLayout = () => {
  vi.spyOn(HTMLElement.prototype, "offsetLeft", "get").mockImplementation(function offsetLeft(
    this: HTMLElement,
  ) {
    return boxOf(this).left;
  });
  vi.spyOn(HTMLElement.prototype, "offsetTop", "get").mockImplementation(function offsetTop(
    this: HTMLElement,
  ) {
    return boxOf(this).top;
  });
  vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(function offsetWidth(
    this: HTMLElement,
  ) {
    return boxOf(this).width;
  });
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(function offsetHeight(
    this: HTMLElement,
  ) {
    return boxOf(this).height;
  });
  vi.spyOn(HTMLElement.prototype, "offsetParent", "get").mockImplementation(function offsetParent(
    this: HTMLElement,
  ) {
    return this.parentElement;
  });
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    function getBoundingClientRect(this: HTMLElement) {
      return pageRectOf(this);
    },
  );
  vi.stubGlobal("ResizeObserver", ResizeObserverStub);
};

const indicatorOf = (container: HTMLElement) => {
  const indicator = container.querySelector<HTMLElement>("[data-testid=indicator]");

  if (indicator === null) {
    throw new Error("No indicator rendered.");
  }

  return indicator;
};

const position = (indicator: HTMLElement) => ({
  height: indicator.style.getPropertyValue("--active-segment-height"),
  left: indicator.style.getPropertyValue("--active-segment-left"),
  top: indicator.style.getPropertyValue("--active-segment-top"),
  width: indicator.style.getPropertyValue("--active-segment-width"),
});

describe("SegmentedControl.Indicator", () => {
  beforeAll(stubLayout);

  afterAll(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("follows the checked radio of a Base UI radio group", async () => {
    const user = userEvent.setup();

    const { container } = render(
      <RadioGroup aria-label="Billing" defaultValue="monthly" data-control="" data-box="0 0 200 32">
        <Radio.Root value="monthly" data-box="3 3 80 26">
          Monthly
        </Radio.Root>
        <Radio.Root value="yearly" data-box="83 3 70 26">
          Yearly
        </Radio.Root>
        <SegmentedControl.Indicator data-testid="indicator" />
      </RadioGroup>,
    );

    const indicator = indicatorOf(container);

    await waitFor(() => {
      expect(position(indicator)).toStrictEqual({
        height: "26px",
        left: "3px",
        top: "3px",
        width: "80px",
      });
    });
    expect(indicator.hidden).toBeFalsy();
    expect(Object.hasOwn(indicator.dataset, "active")).toBeTruthy();
    expect(indicator.getAttribute("aria-hidden")).toBe("true");

    await user.click(screen.getByRole("radio", { name: "Yearly" }));

    await waitFor(() => {
      expect(position(indicator)).toStrictEqual({
        height: "26px",
        left: "83px",
        top: "3px",
        width: "70px",
      });
    });
  });

  it("follows a pressed toggle and the current link", async () => {
    const { container, rerender } = render(
      <nav data-control="" data-box="0 0 200 32">
        <a href="#one" aria-current="page" data-box="3 3 60 26">
          One
        </a>
        <a href="#two" data-box="63 3 60 26">
          Two
        </a>
        <SegmentedControl.Indicator data-testid="indicator" />
      </nav>,
    );

    const indicator = indicatorOf(container);

    await waitFor(() => {
      expect(position(indicator).left).toBe("3px");
    });

    rerender(
      <nav data-control="" data-box="0 0 200 32">
        <a href="#one" data-box="3 3 60 26">
          One
        </a>
        <a href="#two" data-pressed="" data-box="63 3 60 26">
          Two
        </a>
        <SegmentedControl.Indicator data-testid="indicator" />
      </nav>,
    );

    await waitFor(() => {
      expect(position(indicator).left).toBe("63px");
    });
  });

  it("hides when no segment is active", async () => {
    const { container } = render(
      <div data-control="" data-box="0 0 200 32">
        <button type="button" data-box="3 3 60 26">
          One
        </button>
        <SegmentedControl.Indicator data-testid="indicator" />
      </div>,
    );

    await waitFor(() => {
      expect(indicatorOf(container).hidden).toBeTruthy();
    });
    expect(Object.hasOwn(indicatorOf(container).dataset, "active")).toBeFalsy();
  });
});
