import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import {
  ACTIVE_SEGMENT_ATTRIBUTES,
  ACTIVE_SEGMENT_SELECTOR,
  getCssSize,
  getSegmentOffset,
  isSameSegmentRect,
} from "./core";
import type { SegmentRect } from "./core";

interface SegmentedControlIndicatorState extends Record<string, unknown> {
  /** Whether a segment is active and measured, so the indicator is shown. */
  active: boolean;
}

type SegmentedControlIndicatorProps = useRender.ComponentProps<
  "span",
  SegmentedControlIndicatorState
>;

type IndicatorStyle = React.CSSProperties &
  Record<
    | "--active-segment-height"
    | "--active-segment-left"
    | "--active-segment-top"
    | "--active-segment-width",
    string
  >;

/** A computed length in pixels. Rendered boxes compute to `px`; anything else counts as unknown. */
const pixels = (value: string) => (value.endsWith("px") ? Number(value.slice(0, -2)) : 0);

const cssSizeOf = (element: HTMLElement) => {
  const style = getComputedStyle(element);

  return getCssSize(
    { height: pixels(style.height), width: pixels(style.width) },
    { height: element.offsetHeight, width: element.offsetWidth },
  );
};

/** The segment's layout offset from the control's padding box, whether or not it is positioned. */
const layoutOffsetOf = (segment: HTMLElement, control: HTMLElement) =>
  segment.offsetParent === control
    ? { left: segment.offsetLeft, top: segment.offsetTop }
    : {
        left: segment.offsetLeft - control.offsetLeft - control.clientLeft,
        top: segment.offsetTop - control.offsetTop - control.clientTop,
      };

const measure = (control: HTMLElement): SegmentRect | null => {
  const segment = control.querySelector<HTMLElement>(ACTIVE_SEGMENT_SELECTOR);

  if (segment === null) {
    return null;
  }

  const size = cssSizeOf(segment);

  if (size.width <= 0 || size.height <= 0) {
    return null;
  }

  const offset = getSegmentOffset({
    controlBorder: { left: control.clientLeft, top: control.clientTop },
    controlRect: control.getBoundingClientRect(),
    controlScroll: { left: control.scrollLeft, top: control.scrollTop },
    controlSize: cssSizeOf(control),
    layoutOffset: layoutOffsetOf(segment, control),
    segmentRect: segment.getBoundingClientRect(),
  });

  return { ...offset, ...size };
};

/**
 * Measures the control's active segment now and whenever a segment's state or any box changes.
 * Returns the function that stops observing.
 */
const observeActiveSegment = (
  control: HTMLElement,
  onMeasure: (rect: SegmentRect | null) => void,
) => {
  const update = () => {
    onMeasure(measure(control));
  };

  const resizeObserver = new ResizeObserver(update);

  const observeBoxes = () => {
    resizeObserver.disconnect();
    resizeObserver.observe(control);

    for (const child of control.children) {
      resizeObserver.observe(child);
    }
  };

  const mutationObserver = new MutationObserver((records) => {
    if (records.some((record) => record.type === "childList")) {
      observeBoxes();
    }

    update();
  });

  mutationObserver.observe(control, {
    attributeFilter: [...ACTIVE_SEGMENT_ATTRIBUTES],
    attributes: true,
    childList: true,
    subtree: true,
  });
  observeBoxes();
  update();

  return () => {
    resizeObserver.disconnect();
    mutationObserver.disconnect();
  };
};

/**
 * Follows the active segment of its parent element: the child with `data-checked` (Base UI
 * Radio), `data-pressed` (Base UI Toggle) or `aria-current="page"` (a link). Base UI's
 * `Tabs.Indicator` does the same for tabs, but it reads the Tabs contexts, so it cannot follow a
 * radio group, a toggle group or links.
 *
 * Place it as the last child of a positioned control. It sets `--active-segment-left`,
 * `--active-segment-top`, `--active-segment-width` and `--active-segment-height`, measured from
 * the control's padding box, so the control moving on the page never moves it. It stays `hidden`
 * until a segment is active and measured. Transition `translate`, `width` and `height` to slide.
 */
const SegmentedControlIndicator = ({ render, ...props }: SegmentedControlIndicatorProps) => {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [rect, setRect] = React.useState<SegmentRect | null>(null);

  React.useLayoutEffect(() => {
    const control = ref.current?.parentElement;

    return control
      ? observeActiveSegment(control, (next) => {
          setRect((previous) => (isSameSegmentRect(previous, next) ? previous : next));
        })
      : undefined;
  }, []);

  const style: IndicatorStyle | undefined =
    rect === null
      ? undefined
      : {
          "--active-segment-height": `${rect.height}px`,
          "--active-segment-left": `${rect.left}px`,
          "--active-segment-top": `${rect.top}px`,
          "--active-segment-width": `${rect.width}px`,
        };

  const state: SegmentedControlIndicatorState = { active: rect !== null };

  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      { "aria-hidden": true, hidden: rect === null, role: "presentation", style },
      props,
    ),
    ref,
    render,
    state,
  });
};

export { SegmentedControlIndicator };

export type { SegmentedControlIndicatorProps, SegmentedControlIndicatorState };
