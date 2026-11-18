/*
 * The filter core. It knows nothing about React or how filters are drawn: it describes fields,
 * the rules people build on them, and how a rule matches a value. Tables and lists share it, and
 * it is safe to import on a server.
 *
 * Rules are kept as `FilterState`, the same shape as TanStack Table's `ColumnFiltersState`:
 * `[{ id: "status", value: { type: "option", operator: "isAnyOf", values: ["paid"] } }]`.
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

/** The filter state: one entry per field with a rule. TanStack Table's `ColumnFiltersState`. */
type FilterState = { id: string; value: unknown }[];

/** Changes filter state from its latest value. */
type FilterStateUpdate = (last: FilterState) => FilterState;

/**
 * One choice of an option field. An option with `children` groups the options below it: the
 * option menu opens it as a level, and only options without children are chosen and matched.
 * `TExtra` adds the fields a design reads, such as an icon; they are always optional.
 */
type FilterOption<TExtra extends object = object> = FilterOptionBase<TExtra> & Partial<TExtra>;

interface FilterOptionBase<TExtra extends object> {
  value: string;
  label: string;
  /** Options of the next level. Values must be unique across the whole tree. */
  children?: FilterOption<TExtra>[];
  /** Extra terms the option search matches, such as abbreviations or other spellings. */
  keywords?: string[];
}

/**
 * How a field is filtered: its type, its label, and what its editor offers. `TExtra` adds the
 * field settings a design reads (an icon, a placeholder, a number format) and `TOptionExtra` those
 * of its options; both are always optional.
 */
type FilterFieldConfig<
  TExtra extends object = object,
  TOptionExtra extends object = object,
> = FilterFieldConfigBase<TOptionExtra> & Partial<TExtra>;

interface FilterFieldConfigBase<TOptionExtra extends object> {
  type: FilterType;
  label: string;
  /**
   * Option fields: the choices, as a list or a tree. Left out, they are read from the values in
   * the data.
   */
  options?: FilterOption<TOptionExtra>[];
  /** Number fields: the bounds and step of the inputs. Left out, the bounds come from the data. */
  min?: number;
  max?: number;
  step?: number;
}

/** The column meta a filterable column carries. */
interface FilterColumnMeta<TExtra extends object = object, TOptionExtra extends object = object> {
  filter?: FilterFieldConfig<TExtra, TOptionExtra>;
}

/** A field as the filter UI sees it: its config, its rule, and the counts from the data. */
type FilterField<TExtra extends object = object, TOptionExtra extends object = object> = Omit<
  FilterFieldConfig<TExtra, TOptionExtra>,
  "options"
> & {
  id: string;
  options: FilterOption<TOptionExtra>[];
  /** Option fields: how many items have each option under the other active filters. */
  counts?: Map<string, number>;
  /** Number fields: the smallest and largest value in the data. */
  range?: [number, number];
  rule?: FilterRule;
  /** Sets the field's rule, or removes it with `undefined`. */
  setRule: (rule: FilterRule | undefined) => void;
};

/** The filter state of a table or list, as filter components read and change it. */
interface Filters<TExtra extends object = object, TOptionExtra extends object = object> {
  fields: FilterField<TExtra, TOptionExtra>[];
  /** Fields with a rule, in the order the rules were added. */
  active: FilterField<TExtra, TOptionExtra>[];
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

/** A value read from data as a cell, or no value when it is of another kind. */
// oxlint-disable-next-line anti-slop/no-unknown-parameters -- this parses a value read from a row or item, the boundary where data enters the filter core.
const toFilterCell = (value: unknown): FilterCell => (isFilterCell(value) ? value : undefined);

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

const isFilterFieldConfig = (value: unknown): value is FilterFieldConfigBase<object> =>
  isObject(value) &&
  "type" in value &&
  isFilterType(value.type) &&
  "label" in value &&
  typeof value.label === "string";

/**
 * Whether a column's meta holds a filter config, whatever else the meta holds. It checks the type
 * and label; the extra settings a design adds are typed by the caller and not checked here.
 */
const hasFilterConfig = <TExtra extends object = object, TOptionExtra extends object = object>(
  meta: unknown,
): meta is { filter: FilterFieldConfig<TExtra, TOptionExtra> } =>
  isObject(meta) && "filter" in meta && isFilterFieldConfig(meta.filter);

// Operators

/** The default English words for each operator. Pass a replacement to `getOperatorLabel`. */
const operatorLabels: Record<FilterOperator, string> = {
  after: "is after",
  before: "is before",
  between: "is between",
  contains: "contains",
  doesNotContain: "does not contain",
  excludesAllOf: "excludes all of",
  excludesAnyOf: "excludes any of",
  greaterThan: "is greater than",
  greaterThanOrEqual: "is at least",
  includesAllOf: "includes all of",
  includesAnyOf: "includes any of",
  is: "is",
  isAnyOf: "is any of",
  isNoneOf: "is none of",
  isNot: "is not",
  lessThan: "is less than",
  lessThanOrEqual: "is at most",
  notBetween: "is not between",
  onOrAfter: "is on or after",
  onOrBefore: "is on or before",
};

/**
 * The words an operator reads as in a filter, given how many values the rule holds. Option
 * operators read as "is" and "is not" while one value is chosen.
 */
const getOperatorLabel = (
  type: FilterType,
  operator: FilterOperator,
  valueCount = 0,
  labels: Record<FilterOperator, string> = operatorLabels,
) => {
  if (type === "option" && valueCount <= 1) {
    return operator === "isNoneOf" ? labels.isNot : labels.is;
  }

  return labels[operator];
};

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

/** The operators of some field types. */
type OperatorOf<TType extends FilterType> = (typeof filterOperators)[TType][number];

const isOperatorOf = <TType extends FilterType>(
  types: readonly TType[],
  operator: FilterOperator,
): operator is OperatorOf<TType> =>
  types.some((type) => filterOperators[type].some((candidate) => candidate === operator));

// A start and an end, either of which may be open (`null`). Reversed ends are swapped, so 900–100
// means 100–900.
const isWithin = (value: Ordered, first: Ordered | null, second: Ordered | null) => {
  const [low, high] =
    first !== null && second !== null && first > second ? [second, first] : [first, second];

  return (low === null || value >= low) && (high === null || value <= high);
};

type OrderedTest = (value: Ordered, first: Ordered | null, second: Ordered | null) => boolean;

// A single-value test passes everything until its value is set.
const against =
  (test: (value: Ordered, first: Ordered) => boolean): OrderedTest =>
  (value, first) =>
    first === null || test(value, first);

const orderedTests: Record<OperatorOf<"number" | "date">, OrderedTest> = {
  after: against((value, first) => value > first),
  before: against((value, first) => value < first),
  between: isWithin,
  greaterThan: against((value, first) => value > first),
  greaterThanOrEqual: against((value, first) => value >= first),
  is: against((value, first) => value === first),
  isNot: against((value, first) => value !== first),
  lessThan: against((value, first) => value < first),
  lessThanOrEqual: against((value, first) => value <= first),
  notBetween: (value, first, second) => !isWithin(value, first, second),
  onOrAfter: against((value, first) => value >= first),
  onOrBefore: against((value, first) => value <= first),
};

const textTests: Record<OperatorOf<"text">, (text: string, query: string) => boolean> = {
  contains: (text, query) => text.includes(query),
  doesNotContain: (text, query) => !text.includes(query),
  is: (text, query) => text === query,
  isNot: (text, query) => text !== query,
};

type OptionTest = (options: Set<string>, chosen: string[]) => boolean;

const hasAny: OptionTest = (options, chosen) => chosen.some((option) => options.has(option));
const hasAll: OptionTest = (options, chosen) => chosen.every((option) => options.has(option));

const optionTests: Record<OperatorOf<"option" | "multiOption">, OptionTest> = {
  excludesAllOf: (options, chosen) => !hasAll(options, chosen),
  excludesAnyOf: (options, chosen) => !hasAny(options, chosen),
  includesAllOf: hasAll,
  includesAnyOf: hasAny,
  isAnyOf: hasAny,
  isNoneOf: (options, chosen) => !hasAny(options, chosen),
};

/** Numbers and day keys. A row without a value passes only the negative operators. */
const matchesOrdered = (
  value: Ordered | null,
  operator: FilterOperator,
  values: (Ordered | null)[],
) => {
  const [first = null, second = null] = values;

  if (value === null) {
    return operator === "isNot" || operator === "notBetween";
  }

  return (
    !isOperatorOf(["number", "date"], operator) || orderedTests[operator](value, first, second)
  );
};

/** Whether a value passes a rule. A rule with no values yet matches everything. */
const matchesRule = (cell: FilterCell, rule: FilterRule): boolean => {
  const { type, operator, values } = rule;

  if (isRuleEmpty(rule)) {
    return true;
  }

  if (type === "number") {
    const number = toNumber(cell);

    return matchesOrdered(
      Number.isNaN(number) ? null : number,
      operator,
      values.map((value) => (isNumber(value) ? value : null)),
    );
  }

  if (type === "date") {
    return matchesOrdered(
      toDayKey(cell),
      operator,
      values.map((value) => (isText(value) ? value : null)),
    );
  }

  if (type === "text") {
    return (
      !isOperatorOf(["text"], operator) ||
      textTests[operator](toText(cell), String(values[0] ?? "").toLocaleLowerCase())
    );
  }

  const chosen = values.flatMap((value) => (value === null ? [] : [String(value)]));

  return (
    !isOperatorOf(["option", "multiOption"], operator) ||
    optionTests[operator](new Set(toOptionValues(cell)), chosen)
  );
};

/** The parts of a table row the filter function reads. TanStack Table's `Row` has them. */
interface FilterRow {
  // oxlint-disable-next-line anti-slop/no-unknown-returns -- rows hold any data; the filter function parses each value with toFilterCell.
  getValue: (columnId: string) => unknown;
}

/**
 * The table filter function for rules, in TanStack Table's `FilterFn` shape: set it as a column's
 * `filterFn`. A rule being edited stays in the filter state (so its chip stays on screen) and
 * matches every row; only an `undefined` value removes the filter.
 */
const filterFn_rule = Object.assign(
  // oxlint-disable-next-line anti-slop/no-unknown-parameters -- the table hands over the stored filter value untyped; isFilterRule parses it here.
  (row: FilterRow, columnId: string, rule: unknown) =>
    !isFilterRule(rule) || matchesRule(toFilterCell(row.getValue(columnId)), rule),
  // oxlint-disable-next-line anti-slop/no-unknown-parameters -- the table asks about any stored filter value; only a missing one is removed.
  { autoRemove: (value: unknown) => value === undefined || value === null },
);

/**
 * Makes a column filterable in one place: spread it into the column definition to set both its
 * filter function and its `meta.filter` config.
 *
 * ```ts
 * columnHelper.accessor("status", { ...filterColumn({ type: "option", label: "Status", options }) })
 * ```
 */
const filterColumn = <TExtra extends object = object, TOptionExtra extends object = object>(
  config: FilterFieldConfig<NoInfer<TExtra>, NoInfer<TOptionExtra>>,
) => ({
  filterFn: filterFn_rule,
  meta: { filter: config } satisfies FilterColumnMeta<TExtra, TOptionExtra>,
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

/** Finds an option at any depth of an option tree. */
const findOption = <TOption extends { value: string; children?: TOption[] }>(
  options: readonly TOption[],
  value: string,
): TOption | undefined => {
  for (const option of options) {
    if (option.value === value) {
      return option;
    }

    const found = option.children === undefined ? undefined : findOption(option.children, value);

    if (found !== undefined) {
      return found;
    }
  }

  return undefined;
};

/** Calls `visit` with every option that has no children, at any depth, in tree order. */
const forEachLeafOption = <TOption extends { children?: TOption[] }>(
  options: readonly TOption[],
  visit: (option: TOption) => void,
) => {
  for (const option of options) {
    if (option.children === undefined) {
      visit(option);
    } else {
      forEachLeafOption(option.children, visit);
    }
  }
};

/** The options of a field: its configured ones, or the values seen in the data, in order. */
const resolveOptions = <TOptionExtra extends object>(
  options: FilterOption<TOptionExtra>[] | undefined,
  counts: Map<string, number> | undefined,
): FilterOption<TOptionExtra>[] => {
  if (options !== undefined) {
    return options;
  }

  // A seen value has none of the extra settings, which are all optional.
  const none: Partial<TOptionExtra> = {};

  return [...(counts?.keys() ?? [])]
    .toSorted((a, b) => a.localeCompare(b))
    .map((value) => ({ ...none, label: value, value }));
};

/**
 * A rule's values as text: option ids resolve to their labels, and blank values are left out. For
 * a design's summary, such as "Status is Paid, Open".
 */
const getRuleValues = (field: Pick<FilterField, "options" | "rule">): string[] =>
  (field.rule?.values ?? []).flatMap((value) => {
    if (value === null || value === "") {
      return [];
    }

    return [
      isOptionType(field.rule?.type ?? "text")
        ? (findOption(field.options, String(value))?.label ?? String(value))
        : String(value),
    ];
  });

/** The changes a filter editor makes to one field's rule. */
interface FilterFieldActions {
  /** Replaces the rule's values, adding the rule when the field has none. */
  setValues: (values: FilterValue[]) => void;
  /** Sets one value, such as the start (0) or end (1) of a range. */
  setValue: (index: number, value: FilterValue) => void;
  /** Changes the operator, keeping the values that still apply. */
  setOperator: (operator: FilterOperator) => void;
  /** Checks or unchecks an option. Unchecking the last option removes the rule. */
  toggleOption: (value: string, checked: boolean) => void;
  remove: () => void;
  /** Removes a rule left without values, as when its editor closes. */
  removeIfEmpty: () => void;
}

/** The changes a filter editor makes to one field's rule. */
const getFieldActions = (
  field: Pick<FilterField, "type" | "rule" | "setRule">,
): FilterFieldActions => {
  const setValues = (values: FilterValue[]) => {
    field.setRule({ ...(field.rule ?? createRule(field.type)), values });
  };

  return {
    remove: () => {
      field.setRule(undefined);
    },
    removeIfEmpty: () => {
      if (field.rule !== undefined && isRuleEmpty(field.rule)) {
        field.setRule(undefined);
      }
    },
    setOperator: (operator) => {
      field.setRule(changeOperator(field.rule ?? createRule(field.type), operator));
    },
    setValue: (index, value) => {
      const values = Array.from(
        { length: Math.max(index + 1, field.rule?.values.length ?? 0) },
        (_, position) => (position === index ? value : (field.rule?.values[position] ?? null)),
      );

      setValues(values);
    },
    setValues,
    toggleOption: (value, checked) => {
      const rest = (field.rule?.values ?? []).filter((current) => current !== value);
      const next = checked ? [...rest, value] : rest;

      if (next.length === 0) {
        field.setRule(undefined);
      } else {
        setValues(next);
      }
    },
  };
};

/** One field as an adapter describes it: its config and what the data says about it. */
interface FilterSource<TExtra extends object = object, TOptionExtra extends object = object> {
  id: string;
  config: FilterFieldConfig<TExtra, TOptionExtra>;
  /** How many rows hold each value, under the other active filters. */
  facets?: Map<FilterCell, number>;
  range?: [number, number];
}

/**
 * Builds the `Filters` that filter components read, from field sources and filter state. Adapters
 * call it: a table passes its columns and facets, a list its fields and its own counts.
 */
const createFilters = <TExtra extends object = object, TOptionExtra extends object = object>(
  sources: FilterSource<NoInfer<TExtra>, NoInfer<TOptionExtra>>[],
  state: FilterState,
  setState: (update: FilterStateUpdate) => void,
): Filters<TExtra, TOptionExtra> => {
  const ids = new Set(sources.map((source) => source.id));

  const fields = sources.map(({ id, config, facets, range }): FilterField<TExtra, TOptionExtra> => {
    const value = state.find((filter) => filter.id === id)?.value;

    const counts =
      isOptionType(config.type) && facets !== undefined ? toOptionCounts(facets) : undefined;

    return {
      ...config,
      counts,
      id,
      options: resolveOptions(config.options, counts),
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
  findOption,
  forEachLeafOption,
  getFieldActions,
  formatDayKey,
  getOperatorLabel,
  getRuleValues,
  hasFilterConfig,
  isFilterCell,
  isFilterOperator,
  isFilterRule,
  isNumber,
  isOptionType,
  isRangeOperator,
  isRuleEmpty,
  isText,
  matchesRule,
  operatorLabels,
  parseDayKey,
  toFilterCell,
};

export type {
  FilterCell,
  FilterColumnMeta,
  FilterField,
  FilterFieldActions,
  FilterFieldConfig,
  FilterOperator,
  FilterOption,
  FilterRow,
  FilterRule,
  FilterScalar,
  FilterSource,
  FilterState,
  FilterStateUpdate,
  FilterType,
  FilterValue,
  Filters,
};
