// @vitest-environment node
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vite-plus/test";
import { SegmentedControl } from "./index";

describe("SegmentedControl on the server", () => {
  it("renders the indicator hidden until the client measures a segment", () => {
    const html = renderToString(
      <div>
        <button type="button" aria-current="page">
          Overview
        </button>
        <SegmentedControl.Indicator data-testid="indicator" />
      </div>,
    );

    expect(html).toContain('data-testid="indicator"');
    expect(html).toContain("hidden");
    expect(html).not.toContain("--active-segment-left");
    expect(html).not.toContain("data-active");
  });
});
