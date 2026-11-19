// @vitest-environment node
import { describe, expect, it } from "vite-plus/test";
import { getPagination } from "./core";
import type { PaginationItem } from "./core";

const labels = (items: PaginationItem[]) =>
  items.map((item) => (item.type === "page" ? String(item.page) : "…"));

describe(getPagination, () => {
  it("shows every page when they fit", () => {
    expect(labels(getPagination({ page: 2, pageCount: 5 }).items)).toStrictEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
    ]);
  });

  it("keeps the item count constant as the page moves", () => {
    const counts = Array.from(
      { length: 20 },
      (_, index) => getPagination({ page: index + 1, pageCount: 20 }).items.length,
    );

    expect(new Set(counts)).toStrictEqual(new Set([7]));
  });

  it("places gaps around the sibling window", () => {
    expect(labels(getPagination({ page: 10, pageCount: 20 }).items)).toStrictEqual([
      "1",
      "…",
      "9",
      "10",
      "11",
      "…",
      "20",
    ]);
    expect(labels(getPagination({ page: 1, pageCount: 20 }).items)).toStrictEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
      "…",
      "20",
    ]);
  });

  it("shows a single hidden page instead of a gap", () => {
    expect(labels(getPagination({ page: 4, pageCount: 9 }).items)).toStrictEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
      "…",
      "9",
    ]);
  });

  it("honours sibling and boundary counts", () => {
    expect(
      labels(getPagination({ boundaryCount: 2, page: 10, pageCount: 20, siblingCount: 0 }).items),
    ).toStrictEqual(["1", "2", "…", "10", "…", "19", "20"]);
  });

  it("clamps the page and the page count", () => {
    const layout = getPagination({ page: 99, pageCount: 0 });

    expect(layout.page).toBe(1);
    expect(layout.pageCount).toBe(1);
    expect(layout.previousPage).toBeUndefined();
    expect(layout.nextPage).toBeUndefined();
    expect(getPagination({ page: 99, pageCount: 4 }).page).toBe(4);
  });

  it("marks the current page and the steps", () => {
    const layout = getPagination({ page: 3, pageCount: 5 });

    expect(layout.items.find((item) => item.type === "page" && item.current)).toStrictEqual({
      current: true,
      page: 3,
      type: "page",
    });
    expect([layout.previousPage, layout.nextPage]).toStrictEqual([2, 4]);
  });
});
