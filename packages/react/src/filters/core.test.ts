// @vitest-environment node
import { describe, expect, it, vi } from "vite-plus/test";
import {
  changeOperator,
  createFilters,
  createRule,
  filterFn_rule,
  getFieldActions,
  getOperatorLabel,
  getRuleValues,
  operatorLabels,
  matchesRule,
  parseFilterSearch,
  toFilterSearch,
  validateFilterSearch,
} from "@erbium-ui/react/filters";
import type { Filters, FilterRule, FilterState } from "@erbium-ui/react/filters";

const rule = (overrides: Partial<FilterRule> & Pick<FilterRule, "type">): FilterRule => ({
  ...createRule(overrides.type),
  ...overrides,
});

describe(matchesRule, () => {
  it("matches text without case", () => {
    expect(matchesRule("Fix the API", rule({ type: "text", values: ["api"] }))).toBeTruthy();
    expect(
      matchesRule(
        "Fix the API",
        rule({ operator: "doesNotContain", type: "text", values: ["api"] }),
      ),
    ).toBeFalsy();
  });

  it("matches number ranges with open and reversed ends", () => {
    const between = (values: FilterRule["values"]) =>
      rule({ operator: "between", type: "number", values });

    expect(matchesRule(5, between([2, 8]))).toBeTruthy();
    expect(matchesRule(5, between([8, 2]))).toBeTruthy();
    expect(matchesRule(9, between([2, null]))).toBeTruthy();
    expect(
      matchesRule("7", rule({ operator: "lessThan", type: "number", values: [5] })),
    ).toBeFalsy();
  });

  it("matches dates by local day", () => {
    const after = rule({ operator: "onOrAfter", type: "date", values: ["2026-03-01"] });

    expect(matchesRule(new Date(2026, 2, 1, 23), after)).toBeTruthy();
    expect(matchesRule("2026-02-28T10:00:00", after)).toBeFalsy();
  });

  it("matches option sets and lets rows without a value pass only negative operators", () => {
    expect(
      matchesRule(
        ["a", "b"],
        rule({ operator: "includesAllOf", type: "multiOption", values: ["a", "b"] }),
      ),
    ).toBeTruthy();
    expect(matchesRule("c", rule({ type: "option", values: ["a", "b"] }))).toBeFalsy();
    expect(
      matchesRule(undefined, rule({ operator: "isNot", type: "number", values: [1] })),
    ).toBeTruthy();
  });

  it("matches everything while a rule has no values", () => {
    expect(matchesRule("anything", rule({ type: "text", values: [""] }))).toBeTruthy();
  });
});

describe("operators", () => {
  it("keeps the values that still apply", () => {
    const range = rule({ operator: "between", type: "number", values: [1, 9] });

    expect(changeOperator(range, "is").values).toStrictEqual([1]);
    expect(
      changeOperator(rule({ type: "option", values: ["a", "b"] }), "isNoneOf").values,
    ).toStrictEqual(["a", "b"]);
  });

  it("reads option operators as is and is not with one value, and takes replacement words", () => {
    expect(getOperatorLabel("option", "isAnyOf", 1)).toBe("is");
    expect(getOperatorLabel("option", "isNoneOf", 2)).toBe("is none of");
    expect(
      getOperatorLabel("text", "contains", 0, { ...operatorLabels, contains: "enthält" }),
    ).toBe("enthält");
  });
});

describe("table filter function", () => {
  it("reads the row value and treats non-rules as no filter", () => {
    const row = { getValue: (columnId: string) => (columnId === "status" ? "paid" : 3) };

    expect(filterFn_rule(row, "status", rule({ type: "option", values: ["paid"] }))).toBeTruthy();
    expect(filterFn_rule(row, "status", rule({ type: "option", values: ["open"] }))).toBeFalsy();
    expect(filterFn_rule(row, "status", "not a rule")).toBeTruthy();
    expect(filterFn_rule.autoRemove(undefined)).toBeTruthy();
    expect(filterFn_rule.autoRemove(rule({ type: "text" }))).toBeFalsy();
  });
});

const fieldAt = (filters: Filters, position: number) => {
  const field = filters.fields[position];

  if (field === undefined) {
    throw new Error(`No field at ${position}`);
  }

  return field;
};

const setup = (initial: FilterState) => {
  let state = initial;

  const setState = vi.fn<(update: (last: FilterState) => FilterState) => void>((update) => {
    state = update(state);
  });

  const build = () =>
    createFilters(
      [
        {
          config: {
            label: "Status",
            options: [
              { label: "Paid", value: "paid" },
              { label: "Open", value: "open" },
            ],
            type: "option",
          },
          id: "status",
        },
        { config: { label: "Title", type: "text" }, id: "title" },
        {
          config: { label: "Tag", type: "option" },
          facets: new Map([
            ["b", 2],
            ["a", 1],
          ]),
          id: "tag",
        },
      ],
      state,
      setState,
    );

  return { build, state: () => state };
};

describe("createFilters and field actions", () => {
  it("lists active fields in rule order and derives options from the data", () => {
    const { build } = setup([
      { id: "title", value: rule({ type: "text", values: ["x"] }) },
      { id: "status", value: rule({ type: "option", values: ["paid"] }) },
      { id: "unknown", value: rule({ type: "text" }) },
    ]);

    const filters = build();

    expect(filters.active.map((field) => field.id)).toStrictEqual(["title", "status"]);
    expect(filters.fields[2]?.options.map((option) => option.value)).toStrictEqual(["a", "b"]);
    expect(filters.fields[2]?.counts?.get("b")).toBe(2);
  });

  it("toggles options and removes the rule with the last one", () => {
    const { build, state } = setup([]);
    const status = () => fieldAt(build(), 0);

    getFieldActions(status()).toggleOption("paid", true);
    getFieldActions(status()).toggleOption("open", true);
    expect(getRuleValues(status())).toStrictEqual(["Paid", "Open"]);

    getFieldActions(status()).toggleOption("paid", false);
    getFieldActions(status()).toggleOption("open", false);
    expect(state()).toStrictEqual([]);
  });

  it("sets one value of a range, keeps a changed rule in place, and clears its own rules", () => {
    const { build, state } = setup([
      { id: "status", value: rule({ type: "option", values: ["paid"] }) },
      { id: "other", value: 1 },
    ]);

    getFieldActions(fieldAt(build(), 1)).setValue(1, "end");
    expect(state()[2]?.value).toStrictEqual(rule({ type: "text", values: [null, "end"] }));

    getFieldActions(fieldAt(build(), 0)).setOperator("isNoneOf");
    expect(state()[0]?.id).toBe("status");

    getFieldActions(fieldAt(build(), 1)).setValues([""]);
    getFieldActions(fieldAt(build(), 1)).removeIfEmpty();
    build().clear();
    expect(state()).toStrictEqual([{ id: "other", value: 1 }]);
  });
});

describe("URL codec", () => {
  const fields = {
    estimate: { type: "number" as const },
    status: { type: "option" as const },
    title: { type: "text" as const },
  };

  it("round-trips rules, writing default operators without a prefix", () => {
    const state: FilterState = [
      { id: "status", value: rule({ type: "option", values: ["to,do", "done"] }) },
      { id: "estimate", value: rule({ operator: "between", type: "number", values: [2, null] }) },
      { id: "title", value: rule({ type: "text", values: ["is.done"] }) },
    ];

    const search = toFilterSearch(state, fields);

    expect(search).toStrictEqual({
      estimate: "between.2,",
      status: "to%2Cdo,done",
      title: "contains.is.done",
    });
    expect(parseFilterSearch(search, fields)).toStrictEqual(state);
  });

  it("drops values that do not fit and writes numbers as numbers", () => {
    expect(
      validateFilterSearch({ estimate: "lots", status: "paid", title: 3 }, fields),
    ).toStrictEqual({
      status: "paid",
      title: 3,
    });
  });
});
