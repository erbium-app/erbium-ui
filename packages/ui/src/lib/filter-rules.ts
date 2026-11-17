import { constructFilterFn } from "@tanstack/react-table";
import type { ColumnFiltersState, Updater } from "@tanstack/react-table";
import type { IconName } from "@erbium/icons";

/*
 * The filter core. It knows nothing about React or how filters are drawn: it describes fields,
 * the rules people build on them, and how a rule matches a value. Tables and lists share it.
 *
 * A rule is stored as the value of a TanStack `ColumnFilter`, so `ColumnFiltersState` is the one
 * state shape for both: `[{ id: "status", value: { type: "option", operator: "isAnyOf", values: ["paid"] } }]`.
 * Rules are plain JSON, so the same state can be sent to a server or kept in the URL.
 */

/** The kind of value a field holds, which decides its operators and value editor. */
type FilterType = "text" | "number" | "date" | "option" | "multiOption";

const filterOperators = {
  date: ["is", "isNot", "before", "onOrBefore", "after", "onOrAfter", "between", "notBetween"],
  multiOption: ["includesAnyOf", "includesAllOf", "excludesAnyOf", "excludesAllOf"],
  number: [
    "is",
    "isNot",
    "lessThan",
    "lessThanOrEqual",
    "greaterThan",
    "greaterThanOrEqual",
    "between",
    "notBetween",
  ],
  option: ["isAnyOf", "isNoneOf"],
  text: ["contains", "doesNotContain", "is", "isNot"],
} as const satisfies Record<FilterType, readonly string[]>;

type FilterOperator = (typeof filterOperators)[FilterType][number];

/**
 * A rule value: an option id, a number, a date as `YYYY-MM-DD`, or text. `null` leaves one end of
 * a range open.
 */
type FilterValue = string | number | null;

/**
 * One condition on one field. `values` holds one value for most operators, a start and an end for
 * ranges, and any number of option ids for option fields. A rule with no values is a filter being
 * edited and matches everything.
 */
interface FilterRule {
  type: FilterType;
  operator: FilterOperator;
  values: FilterValue[];
}

/** A value read from a row or item, once decoded. Anything else is treated as no value. */
type FilterScalar = string | number | boolean | Date;

type FilterCell = FilterScalar | readonly FilterScalar[] | null | undefined;

interface FilterOption {
  value: string;
  label: string;
  icon?: IconName;
}

/** How a field is filtered: its type, its label, and what its editor offers. */
interface FilterFieldConfig {
  type: FilterType;
  label: string;
  icon?: IconName;
  /** Option fields: the choices. Left out, they are read from the values in the data. */
  options?: FilterOption[];
  /** Text fields: the input placeholder. */
  placeholder?: string;
  /** Number fields: the bounds and step of the inputs. Left out, the bounds come from the data. */
  min?: number;
  max?: number;
  step?: number;
  /** Number fields: how values are written in the filter summary and inputs. */
  format?: Intl.NumberFormatOptions;
}

/** The column meta a filterable column carries. Declare it with `columnMeta: {} as FilterColumnMeta`. */
interface FilterColumnMeta {
  filter?: FilterFieldConfig;
}

/** A field as the filter UI sees it: its config, its rule, and the counts from the data. */
interface FilterField extends Omit<FilterFieldConfig, "options"> {
  id: string;
  options: FilterOption[];
  /** Option fields: how many items have each option under the other active filters. */
  counts?: Map<string, number>;
  /** Number fields: the smallest and largest value in the data. */
  range?: [number, number];
  rule?: FilterRule;
  /** Sets the field's rule, or removes it with `undefined`. */
  setRule: (rule: FilterRule | undefined) => void;
}

/** The filter state of a table or list, as the filter components read and change it. */
interface Filters {
  fields: FilterField[];
  /** Fields with a rule, in the order the rules were added. */
  active: FilterField[];
  /** Removes every rule this filter owns. */
  clear: () => void;
}

// Decoding. Values enter from rows, column meta and stored state; these guards are the boundary.

const filterTypes = new Set<string>(Object.keys(filterOperators));
const allOperators = new Set<string>(Object.values(filterOperators).flat());

const isText = (value: FilterCell | FilterValue): value is string => typeof value === "string";

const isNumber = (value: FilterCell | FilterValue): value is number =>
  typeof value === "number" && !Number.isNaN(value);

const isFilterScalar = (value: unknown): value is FilterScalar =>
  typeof value === "string" ||
  typeof value === "number" ||
  typeof value === "boolean" ||
  value instanceof Date;

const isFilterCell = (value: unknown): value is FilterCell =>
  value === null ||
  value === undefined ||
  isFilterScalar(value) ||
  (Array.isArray(value) && value.every(isFilterScalar));

const isFilterType = (value: unknown): value is FilterType =>
  typeof value === "string" && filterTypes.has(value);

const isFilterOperator = (value: unknown): value is FilterOperator =>
  typeof value === "string" && allOperators.has(value);

const isFilterValue = (value: unknown): value is FilterValue =>
  value === null || typeof value === "string" || typeof value === "number";

const isObject = (value: unknown): value is object =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Whether a stored filter value is a rule, as rules read back from a URL or a server must be. */
const isFilterRule = (value: unknown): value is FilterRule =>
  isObject(value) &&
  "type" in value &&
  isFilterType(value.type) &&
  "operator" in value &&
  isFilterOperator(value.operator) &&
  "values" in value &&
  Array.isArray(value.values) &&
  value.values.every(isFilterValue);

const isFilterFieldConfig = (value: unknown): value is FilterFieldConfig =>
  isObject(value) &&
  "type" in value &&
  isFilterType(value.type) &&
  "label" in value &&
  typeof value.label === "string";

/** Whether a column's meta holds a filter config, whatever else the meta holds. */
const hasFilterConfig = (meta: unknown): meta is { filter: FilterFieldConfig } =>
  isObject(meta) && "filter" in meta && isFilterFieldConfig(meta.filter);

// Operators

const operatorLabels = new Map<string, string>([
  ["after", "is after"],
  ["before", "is before"],
  ["between", "is between"],
  ["contains", "contains"],
  ["doesNotContain", "does not contain"],
  ["excludesAllOf", "excludes all of"],
  ["excludesAnyOf", "excludes any of"],
  ["greaterThan", "is greater than"],
  ["greaterThanOrEqual", "is at least"],
  ["includesAllOf", "includes all of"],
  ["includesAnyOf", "includes any of"],
  ["is", "is"],
  ["isAnyOf", "is any of"],
  ["isNoneOf", "is none of"],
  ["isNot", "is not"],
  ["lessThan", "is less than"],
  ["lessThanOrEqual", "is at most"],
  ["notBetween", "is not between"],
  ["onOrAfter", "is on or after"],
  ["onOrBefore", "is on or before"],
]);

// Option operators read as "is" and "is not" while one value is chosen.
const singleOptionLabels = new Map<string, string>([
  ["isAnyOf", "is"],
  ["isNoneOf", "is not"],
]);

/** The words an operator reads as in a filter, given how many values the rule holds. */
const getOperatorLabel = (type: FilterType, operator: FilterOperator, valueCount = 0) =>
  (type === "option" && valueCount <= 1 ? singleOptionLabels.get(operator) : undefined) ??
  operatorLabels.get(operator) ??
  operator;

const rangeOperators = new Set<FilterOperator>(["between", "notBetween"]);

/** Range operators take a start and an end; the others take one value, or a set for options. */
const isRangeOperator = (operator: FilterOperator) => rangeOperators.has(operator);

/** Option and multi-option fields hold a set of chosen options rather than one typed value. */
const isOptionType = (type: FilterType) => type === "option" || type === "multiOption";

/** A new rule for a field, with its default operator and no values yet. */
const createRule = (type: FilterType, values: FilterValue[] = []): FilterRule => ({
  operator: filterOperators[type][0],
  type,
  values,
});

/**
 * Changes a rule's operator, keeping the values that still apply: ranges and option sets keep
 * them all, and a single-value operator keeps the first.
 */
const changeOperator = (rule: FilterRule, operator: FilterOperator): FilterRule => ({
  ...rule,
  operator,
  values:
    isRangeOperator(operator) || isOptionType(rule.type) ? rule.values : rule.values.slice(0, 1),
});

/** A rule that constrains nothing yet: it has no values, or only blank ones. */
const isRuleEmpty = (rule: FilterRule) =>
  rule.values.every((value) => value === null || value === "");

// Matching

/** A local date as the `YYYY-MM-DD` key date rules store. Keys sort in date order. */
const formatDayKey = (date: Date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");

/** The local date a `YYYY-MM-DD` key stands for. */
const parseDayKey = (key: string) => {
  const [year = 0, month = 1, day = 1] = key.split("-").map(Number);

  return new Date(year, month - 1, day);
};

const dayKeyPattern = /^\d{4}-\d{2}-\d{2}/u;

const toDayKey = (cell: FilterCell): string | null => {
  if (cell instanceof Date) {
    return Number.isNaN(cell.getTime()) ? null : formatDayKey(cell);
  }

  if (isText(cell) && dayKeyPattern.test(cell)) {
    return cell.slice(0, 10);
  }

  if (isText(cell) || isNumber(cell)) {
    const date = new Date(cell);

    return Number.isNaN(date.getTime()) ? null : formatDayKey(date);
  }

  return null;
};

const toNumber = (cell: FilterCell) => {
  if (isNumber(cell)) {
    return cell;
  }

  return isText(cell) && cell.trim() !== "" ? Number(cell) : Number.NaN;
};

// Array.isArray does not narrow a readonly array out of a union.
const isScalarList = (cell: FilterCell): cell is readonly FilterScalar[] => Array.isArray(cell);

const scalarText = (scalar: FilterScalar) =>
  scalar instanceof Date ? scalar.toISOString() : String(scalar);

const toOptionValues = (cell: FilterCell): string[] => {
  if (cell === null || cell === undefined) {
    return [];
  }

  return isScalarList(cell) ? cell.map(scalarText) : [scalarText(cell)];
};

const toText = (cell: FilterCell) => toOptionValues(cell).join(" ").toLocaleLowerCase();

type Ordered = number | string;

type OrderedTest = (value: Ordered, first: Ordered, second: Ordered) => boolean;

// Reversed range ends are swapped, so 900–100 means 100–900.
const isWithin: OrderedTest = (value, first, second) =>
  first <= second ? value >= first && value <= second : value >= second && value <= first;

const orderedTests = new Map<string, OrderedTest>([
  ["after", (value, first) => value > first],
  ["before", (value, first) => value < first],
  ["between", isWithin],
  ["greaterThan", (value, first) => value > first],
  ["greaterThanOrEqual", (value, first) => value >= first],
  ["is", (value, first) => value === first],
  ["isNot", (value, first) => value !== first],
  ["lessThan", (value, first) => value < first],
  ["lessThanOrEqual", (value, first) => value <= first],
  ["notBetween", (value, first, second) => !isWithin(value, first, second)],
  ["onOrAfter", (value, first) => value >= first],
  ["onOrBefore", (value, first) => value <= first],
]);

// Numbers and day keys. A range with one end open compares against the other end only.
const matchesOrdered = (value: Ordered | null, rule: FilterRule, values: (Ordered | null)[]) => {
  const [first = null, second = null] = values;
  const missing = rule.operator === "isNot" || rule.operator === "notBetween";

  if (value === null) {
    return missing;
  }

  if (isRangeOperator(rule.operator) && (first === null || second === null)) {
    const bound = first ?? second;
    const inside = bound === null || (first === null ? value <= bound : value >= bound);

    return rule.operator === "between" ? inside : !inside;
  }

  const test = orderedTests.get(rule.operator);

  return first === null || test === undefined || test(value, first, second ?? first);
};

type TextTest = (text: string, query: string) => boolean;

const textTests = new Map<string, TextTest>([
  ["contains", (text, query) => text.includes(query)],
  ["doesNotContain", (text, query) => !text.includes(query)],
  ["is", (text, query) => text === query],
  ["isNot", (text, query) => text !== query],
]);

type OptionTest = (options: Set<string>, chosen: string[]) => boolean;

const hasAny: OptionTest = (options, chosen) => chosen.some((option) => options.has(option));
const hasAll: OptionTest = (options, chosen) => chosen.every((option) => options.has(option));

const optionTests = new Map<string, OptionTest>([
  ["excludesAllOf", (options, chosen) => !hasAll(options, chosen)],
  ["excludesAnyOf", (options, chosen) => !hasAny(options, chosen)],
  ["includesAllOf", hasAll],
  ["includesAnyOf", hasAny],
  ["isAnyOf", hasAny],
  ["isNoneOf", (options, chosen) => !hasAny(options, chosen)],
]);

/** Whether a value passes a rule. A rule with no values yet matches everything. */
const matchesRule = (cell: FilterCell, rule: FilterRule): boolean => {
  if (isRuleEmpty(rule)) {
    return true;
  }

  if (rule.type === "number") {
    const number = toNumber(cell);

    return matchesOrdered(
      Number.isNaN(number) ? null : number,
      rule,
      rule.values.map((value) => (isNumber(value) ? value : null)),
    );
  }

  if (rule.type === "date") {
    return matchesOrdered(
      toDayKey(cell),
      rule,
      rule.values.map((value) => (isText(value) ? value : null)),
    );
  }

  if (rule.type === "text") {
    const test = textTests.get(rule.operator);

    return (
      test === undefined || test(toText(cell), String(rule.values[0] ?? "").toLocaleLowerCase())
    );
  }

  const test = optionTests.get(rule.operator);
  const chosen = rule.values.flatMap((value) => (value === null ? [] : [String(value)]));

  return test === undefined || test(new Set(toOptionValues(cell)), chosen);
};

/**
 * The TanStack filter function for rules. A rule being edited stays in `columnFilters` (so its
 * chip stays on screen) and matches every row; only an `undefined` value removes the filter.
 */
const filterFn_rule = constructFilterFn({
  autoRemove: (value) => value === undefined || value === null,
  filter: (dataValue, rule) =>
    !isFilterRule(rule) || matchesRule(isFilterCell(dataValue) ? dataValue : undefined, rule),
});

/**
 * Makes a column filterable in one place: spread it into the column definition to set both its
 * filter function and its `meta.filter` config.
 *
 * ```ts
 * columnHelper.accessor("status", { ...filterColumn({ type: "option", label: "Status", options }) })
 * ```
 */
const filterColumn = (config: FilterFieldConfig) => ({
  filterFn: filterFn_rule,
  meta: { filter: config } satisfies FilterColumnMeta,
});

// Building the filters

/** Facet counts by option value. Array cells count once for each option they hold. */
const toOptionCounts = (facets: Map<FilterCell, number>) => {
  const counts = new Map<string, number>();

  for (const [cell, count] of facets) {
    for (const option of toOptionValues(cell)) {
      counts.set(option, (counts.get(option) ?? 0) + count);
    }
  }

  return counts;
};

/** The options of a field: its configured ones, or the values seen in the data, in order. */
const resolveOptions = (config: FilterFieldConfig, counts: Map<string, number> | undefined) =>
  config.options ??
  [...(counts?.keys() ?? [])]
    .toSorted((a, b) => a.localeCompare(b))
    .map((value) => ({ label: value, value }));

/** One field as an adapter describes it: its config and what the data says about it. */
interface FilterSource {
  id: string;
  config: FilterFieldConfig;
  /** How many rows hold each value, under the other active filters. */
  facets?: Map<FilterCell, number>;
  range?: [number, number];
}

/**
 * Builds the `Filters` the components read from field sources and `ColumnFiltersState`. Both
 * adapters call it: a table passes its columns and facets, a list its fields and its own counts.
 */
const createFilters = (
  sources: FilterSource[],
  state: ColumnFiltersState,
  setState: (updater: Updater<ColumnFiltersState>) => void,
): Filters => {
  const ids = new Set(sources.map((source) => source.id));

  const fields = sources.map(({ id, config, facets, range }): FilterField => {
    const value = state.find((filter) => filter.id === id)?.value;

    const counts =
      isOptionType(config.type) && facets !== undefined ? toOptionCounts(facets) : undefined;

    return {
      ...config,
      counts,
      id,
      options: resolveOptions(config, counts),
      range,
      rule: isFilterRule(value) ? value : undefined,
      setRule: (rule) => {
        setState((last) => {
          if (rule === undefined) {
            return last.filter((filter) => filter.id !== id);
          }

          // A changed rule keeps its place, so its chip does not jump to the end.
          return last.some((filter) => filter.id === id)
            ? last.map((filter) => (filter.id === id ? { id, value: rule } : filter))
            : [...last, { id, value: rule }];
        });
      },
    };
  });

  const byId = new Map(fields.map((field) => [field.id, field]));

  return {
    active: state.flatMap((filter) => {
      const field = byId.get(filter.id);

      return field?.rule === undefined ? [] : [field];
    }),
    clear: () => {
      setState((last) => last.filter((filter) => !ids.has(filter.id)));
    },
    fields,
  };
};

export {
  changeOperator,
  createFilters,
  createRule,
  filterColumn,
  filterFn_rule,
  filterOperators,
  formatDayKey,
  getOperatorLabel,
  hasFilterConfig,
  isFilterCell,
  isFilterOperator,
  isFilterRule,
  isNumber,
  isOptionType,
  isRangeOperator,
  isObject,
  isRuleEmpty,
  isText,
  matchesRule,
  parseDayKey,
};

export type {
  FilterCell,
  FilterColumnMeta,
  FilterField,
  FilterFieldConfig,
  FilterOperator,
  FilterOption,
  FilterRule,
  FilterScalar,
  FilterSource,
  FilterType,
  FilterValue,
  Filters,
};
