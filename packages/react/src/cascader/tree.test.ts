import { describe, expect, it } from "vite-plus/test";
import {
  countSelectedBelow,
  createCascaderIndex,
  createMatch,
  getLevelOf,
  getLevelRows,
  getPathTo,
} from "./tree";
import type { CascaderNode } from "./tree";

const tree: CascaderNode[] = [
  {
    children: [
      {
        children: [
          { label: "Berlin", value: "berlin" },
          { keywords: ["München"], label: "Munich", value: "munich" },
        ],
        label: "Germany",
        value: "germany",
      },
      { children: [{ label: "Paris", value: "paris" }], label: "France", value: "france" },
    ],
    label: "Europe",
    value: "europe",
  },
  { label: "Antarctica", value: "antarctica" },
];

const index = createCascaderIndex(tree);
const contains = (text: string, query: string) => text.toLowerCase().includes(query.toLowerCase());
const match = createMatch(contains);

describe("createCascaderIndex", () => {
  it("indexes every node with its path from the top", () => {
    expect(index.get("munich")?.path.map((node) => node.value)).toEqual([
      "europe",
      "germany",
      "munich",
    ]);
    expect(index.get("antarctica")?.path).toHaveLength(1);
    expect(index.size).toBe(7);
  });

  it("keeps the first node when two share a value", () => {
    const duplicated = createCascaderIndex([
      { label: "First", value: "same" },
      { label: "Second", value: "same" },
    ]);

    expect(duplicated.get("same")?.node.label).toBe("First");
  });
});

describe("getLevelRows", () => {
  it("lists the level's nodes without a query", () => {
    const rows = getLevelRows(tree, "", match);

    expect(rows.map((row) => [row.node.value, row.kind, row.trail.length])).toEqual([
      ["europe", "branch", 0],
      ["antarctica", "leaf", 0],
    ]);
  });

  it("finds matches at any depth with the trail that leads to them", () => {
    const rows = getLevelRows(tree, "mün", match);

    expect(rows).toHaveLength(1);
    expect(rows[0]?.node.value).toBe("munich");
    expect(rows[0]?.trail.map((node) => node.value)).toEqual(["europe", "germany"]);
  });

  it("matches branches as well as leaves", () => {
    expect(getLevelRows(tree, "an", match).map((row) => row.node.value)).toEqual([
      "germany",
      "france",
      "antarctica",
    ]);
  });
});

describe("selection helpers", () => {
  it("counts selected leaves below each branch", () => {
    const counts = countSelectedBelow(index, ["berlin", "munich", "paris"]);

    expect(Object.fromEntries(counts)).toEqual({ europe: 3, france: 1, germany: 2 });
  });

  it("finds the level that holds a value and the path that opens a branch", () => {
    expect(getLevelOf(index, "berlin")).toEqual(["europe", "germany"]);
    expect(getLevelOf(index, "antarctica")).toEqual([]);
    expect(getLevelOf(index, undefined)).toEqual([]);
    expect(getPathTo(index, "germany")).toEqual(["europe", "germany"]);
  });
});
