/**
 * The segments the indicator follows: a checked radio, a pressed toggle, or the current link.
 * Only direct children of the control count, so nested content never moves the indicator.
 */
const ACTIVE_SEGMENT_SELECTOR =
  ':scope > [data-checked], :scope > [data-pressed], :scope > [aria-current="page"]';

/** The attributes that mark a segment active. The indicator re-measures when one changes. */
const ACTIVE_SEGMENT_ATTRIBUTES: readonly string[] = [
  "data-checked",
  "data-pressed",
  "aria-current",
];

// `offsetLeft` and `offsetTop` are rounded to whole pixels, and the error can compound across
// the offset parent chain.
const MAX_LAYOUT_ROUNDING_ERROR = 2;

interface Point {
  left: number;
  top: number;
}

interface Size {
  width: number;
  height: number;
}

/** Where the active segment sits inside the control, in the control's own CSS pixels. */
interface SegmentRect extends Point, Size {}

/** What `getSegmentOffset` reads from the DOM. Plain numbers, so it runs without a document. */
interface SegmentGeometry {
  /** The segment's `getBoundingClientRect()` position. */
  segmentRect: Point;
  /** The control's `getBoundingClientRect()` box. */
  controlRect: Point & Size;
  /** The control's CSS size, before transforms. */
  controlSize: Size;
  /** The control's `clientLeft` and `clientTop`: its border widths. */
  controlBorder: Point;
  /** The control's `scrollLeft` and `scrollTop`. */
  controlScroll: Point;
  /** The segment's layout offset from the control's padding box. */
  layoutOffset: Point;
}

const scaleOf = (projected: number, css: number) => (css > 0 ? projected / css : 1);

/**
 * The segment's offset from the control's padding box. Same approach as Base UI's
 * `Tabs.Indicator`: the viewport rects keep sub-pixel precision and are unscaled by the control's
 * transform, and the layout offset is used instead whenever a rotation, skew or 3D transform
 * makes the two disagree.
 */
const getSegmentOffset = ({
  segmentRect,
  controlRect,
  controlSize,
  controlBorder,
  controlScroll,
  layoutOffset,
}: SegmentGeometry): Point => {
  const left =
    (segmentRect.left - controlRect.left) / scaleOf(controlRect.width, controlSize.width) -
    controlBorder.left +
    controlScroll.left;

  const top =
    (segmentRect.top - controlRect.top) / scaleOf(controlRect.height, controlSize.height) -
    controlBorder.top +
    controlScroll.top;

  // A control scaled to zero yields NaN or Infinity, which fails this check too.
  const undistorted =
    Math.abs(left - layoutOffset.left) <= MAX_LAYOUT_ROUNDING_ERROR &&
    Math.abs(top - layoutOffset.top) <= MAX_LAYOUT_ROUNDING_ERROR;

  return undistorted ? { left, top } : layoutOffset;
};

/**
 * An element's CSS size. The computed size keeps sub-pixel precision, but it is `auto` or off for
 * inline and some replaced elements, so the rounded offset size wins when they disagree.
 */
const getCssSize = (computed: Size, offset: Size): Size =>
  Math.round(computed.width) === offset.width && Math.round(computed.height) === offset.height
    ? computed
    : offset;

/** Whether two measurements match, so an unchanged layout skips a render. */
const isSameSegmentRect = (a: SegmentRect | null, b: SegmentRect | null) => {
  if (a === null || b === null) {
    return a === b;
  }

  return a.left === b.left && a.top === b.top && a.width === b.width && a.height === b.height;
};

export {
  ACTIVE_SEGMENT_ATTRIBUTES,
  ACTIVE_SEGMENT_SELECTOR,
  getCssSize,
  getSegmentOffset,
  isSameSegmentRect,
};

export type { SegmentGeometry, SegmentRect };
