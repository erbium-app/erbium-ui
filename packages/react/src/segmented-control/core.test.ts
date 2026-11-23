// @vitest-environment node
import { describe, expect, it } from "vite-plus/test";
import { getCssSize, getSegmentOffset, isSameSegmentRect } from "./core";
import type { SegmentGeometry } from "./core";

const geometry = (overrides: Partial<SegmentGeometry> = {}): SegmentGeometry => ({
  controlBorder: { left: 0, top: 0 },
  controlRect: { height: 32, left: 100, top: 400, width: 200 },
  controlScroll: { left: 0, top: 0 },
  controlSize: { height: 32, width: 200 },
  layoutOffset: { left: 60, top: 3 },
  segmentRect: { left: 160.5, top: 403 },
  ...overrides,
});

describe(getSegmentOffset, () => {
  it("measures from the control, wherever the control sits on the page", () => {
    expect(getSegmentOffset(geometry())).toStrictEqual({ left: 60.5, top: 3 });

    // The control moved down the page, as when content above it grows: the offset stays.
    expect(
      getSegmentOffset(
        geometry({
          controlRect: { height: 32, left: 100, top: 520, width: 200 },
          segmentRect: { left: 160.5, top: 523 },
        }),
      ),
    ).toStrictEqual({ left: 60.5, top: 3 });
  });

  it("removes the control's border and adds its scroll", () => {
    expect(
      getSegmentOffset(
        geometry({
          controlBorder: { left: 1, top: 1 },
          controlScroll: { left: 40, top: 0 },
          layoutOffset: { left: 99, top: 2 },
          segmentRect: { left: 160, top: 403 },
        }),
      ),
    ).toStrictEqual({ left: 99, top: 2 });
  });

  it("undoes a scale on the control", () => {
    expect(
      getSegmentOffset(
        geometry({
          controlRect: { height: 64, left: 100, top: 400, width: 400 },
          segmentRect: { left: 220, top: 406 },
        }),
      ),
    ).toStrictEqual({ left: 60, top: 3 });
  });

  it("falls back to the layout offset when a transform distorts the rects", () => {
    expect(getSegmentOffset(geometry({ segmentRect: { left: 140, top: 430 } }))).toStrictEqual({
      left: 60,
      top: 3,
    });
    expect(
      getSegmentOffset(geometry({ controlRect: { height: 0, left: 100, top: 400, width: 0 } })),
    ).toStrictEqual({ left: 60, top: 3 });
  });
});

describe(getCssSize, () => {
  it("keeps the sub-pixel computed size when it rounds to the offset size", () => {
    expect(getCssSize({ height: 26, width: 48.6 }, { height: 26, width: 49 })).toStrictEqual({
      height: 26,
      width: 48.6,
    });
  });

  it("uses the offset size when the computed size is unusable", () => {
    expect(getCssSize({ height: 0, width: 0 }, { height: 26, width: 49 })).toStrictEqual({
      height: 26,
      width: 49,
    });
  });
});

describe(isSameSegmentRect, () => {
  it("compares every edge", () => {
    const rect = { height: 26, left: 3, top: 3, width: 48 };

    expect(isSameSegmentRect(rect, { ...rect })).toBeTruthy();
    expect(isSameSegmentRect(rect, { ...rect, left: 4 })).toBeFalsy();
    expect(isSameSegmentRect(null, null)).toBeTruthy();
    expect(isSameSegmentRect(rect, null)).toBeFalsy();
  });
});
