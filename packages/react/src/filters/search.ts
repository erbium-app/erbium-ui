import {
  filterOperators,
  hasFilterConfig,
  isFilterRule,
  isOptionType,
  isRangeOperator,
} from "./rules";
import type { FilterOperator, FilterRule, FilterState, FilterType, FilterValue } from "./rules";

/*
 * Filters in the URL. Each field with a rule gets one search param, named by the field id, so a
 * filtered view is a link that can be shared or bookmarked:
 *
 *   ?status=todo,in-progress&estimate=between.2,8&title=contains.api
 *
 * The value is the rule's values, comma separated, after `operator.` when the operator is not the
 * field type's default. Range ends may be blank (`between.2,`), a rule still being edited has no
 * values (`?title=`), and commas inside option values are written as `%2C`. Text values are never
 * split, so they keep their commas.
 *
 * The codec is router agnostic. It reads any search object (TanStack Router's parsed search, or
 * the entries of `URLSearchParams`) and writes plain values.
 */

/** The fields whose rules live in the URL, by id: each needs only its type. */
type FilterSearchFields<TKey extends string = string> = Record<TKey, { type: FilterType }>;

/** A search param value a filter can be read from. Routers that parse values as JSON, as TanStack
 * Router does, hand numbers and booleans back as well as strings. */
type ParamText = string | number | boolean;

/**
 * The params of a search object, such as TanStack Router's `Route.useSearch()`. Params of other
 * kinds are ignored at runtime.
 */
type SearchParams<TKey extends string = string> = Readonly<Partial<Record<TKey, ParamText | null>>>;

/**
 * The filter params of a search object. `validateFilterSearch` returns the fields that hold a
 * rule; `toFilterSearch` returns every field, with `undefined` for fields without a rule, so that
 * merging it into the current search removes those params.
 */
type FilterSearch<TKey extends string = string> = Partial<Record<TKey, string | number>>;

const dayKey = /^\d{4}-\d{2}-\d{2}$/u;
const operatorPrefix = /^(?<operator>[A-Za-z]+)\.(?<body>.*)$/su;

const escapeOption = (value: string) => value.replaceAll("%", "%25").replaceAll(",", "%2C");
const unescapeOption = (value: string) => value.replaceAll("%2C", ",").replaceAll("%25", "%");

const encodeValues = (rule: FilterRule) => {
  if (rule.type === "text") {
    return String(rule.values[0] ?? "");
  }

  if (isOptionType(rule.type)) {
    return rule.values
      .flatMap((value) => (value === null ? [] : [escapeOption(String(value))]))
      .join(",");
  }

  // Numbers and dates. A range keeps both ends, so a blank start stays a blank start.
  const values = isRangeOperator(rule.operator) ? rule.values.slice(0, 2) : rule.values.slice(0, 1);

  return values.map((value) => (value === null ? "" : String(value))).join(",");
};

const getOperator = (type: FilterType, name: string): FilterOperator | undefined =>
  filterOperators[type].find((operator) => operator === name);

// `undefined` marks a token that does not fit the type, which drops the whole param.
const decodeValue = (type: FilterType, token: string): FilterValue | undefined => {
  if (token === "") {
    return null;
  }

  if (type === "number") {
    const number = Number(token);

    return Number.isFinite(number) ? number : undefined;
  }

  return type === "date" && !dayKey.test(token) ? undefined : token;
};

const isDecoded = (value: FilterValue | undefined): value is FilterValue => value !== undefined;

const decodeValues = (
  type: FilterType,
  operator: FilterOperator,
  body: string,
): FilterValue[] | undefined => {
  if (body === "") {
    return [];
  }

  if (type === "text") {
    return [body];
  }

  if (isOptionType(type)) {
    return body.split(",").flatMap((token) => (token === "" ? [] : [unescapeOption(token)]));
  }

  const tokens = body.split(",").map((token) => decodeValue(type, token));
  const values = isRangeOperator(operator) ? tokens.slice(0, 2) : tokens.slice(0, 1);

  return values.every(isDecoded) ? values : undefined;
};

const isParamText = (value: unknown): value is ParamText =>
  typeof value === "string" || typeof value === "number" || typeof value === "boolean";

const isFieldId = <TKey extends string>(fields: FilterSearchFields<TKey>, id: string): id is TKey =>
  Object.hasOwn(fields, id);

/** The rule a search param value holds for a field of this type, or `undefined` when it does not fit. */
const decodeFilterParam = (type: FilterType, value: ParamText): FilterRule | undefined => {
  const param = String(value);
  const groups = operatorPrefix.exec(param)?.groups;
  const prefixed = getOperator(type, groups?.operator ?? "");
  const operator = prefixed ?? filterOperators[type][0];
  const body = prefixed === undefined ? param : (groups?.body ?? "");

  const values = decodeValues(type, operator, body);

  return values === undefined ? undefined : { operator, type, values };
};

/**
 * The search param value for a rule. Plain numbers are written as numbers, so routers that parse
 * search values as JSON (TanStack Router does) write `?estimate=3` rather than `?estimate=%223%22`.
 */
const encodeFilterParam = (rule: FilterRule): string | number => {
  const body = encodeValues(rule);
  const implicit = rule.operator === filterOperators[rule.type][0];
  // The operator is left out only when the value still reads back as the same rule, so a text
  // value such as `is.done` keeps its `contains.` prefix.
  const decoded = implicit ? decodeFilterParam(rule.type, body) : undefined;

  if (decoded?.operator === rule.operator && encodeValues(decoded) === body) {
    const number = Number(body);

    return body !== "" && String(number) === body ? number : body;
  }

  return `${rule.operator}.${body}`;
};

/**
 * The filter state a search object holds for these fields, in the order the params appear.
 * Params for other fields are ignored, and values that do not fit a field's type are dropped.
 */
const parseFilterSearch = <TKey extends string>(
  search: SearchParams<TKey>,
  fields: FilterSearchFields<TKey>,
): FilterState =>
  Object.entries(search).flatMap(([id, value]) => {
    if (!isFieldId(fields, id) || !isParamText(value)) {
      return [];
    }

    const rule = decodeFilterParam(fields[id].type, value);

    return rule === undefined ? [] : [{ id, value: rule }];
  });

/**
 * The search params for filter state: one per field, `undefined` where a field has no rule.
 * Rules come first, in their order, so a link reopens the chips in the order they were added.
 * Merge the result into the current search so other params are kept.
 */
const toFilterSearch = <TKey extends string>(
  state: FilterState,
  fields: FilterSearchFields<TKey>,
): FilterSearch<TKey> => {
  const search: FilterSearch<TKey> = {};

  for (const { id, value } of state) {
    if (isFieldId(fields, id) && isFilterRule(value) && value.type === fields[id].type) {
      search[id] = encodeFilterParam(value);
    }
  }

  for (const id in fields) {
    if (Object.hasOwn(fields, id) && !Object.hasOwn(search, id)) {
      search[id] = undefined;
    }
  }

  return search;
};

/**
 * Validates the filter params of a search object, for a route's `validateSearch`. Keeps a param
 * for each field that holds a rule, in URL order and written in its normal form, and drops the rest.
 *
 * ```ts
 * validateSearch: (search) => ({ ...validateFilterSearch(search, filterFields), page: … })
 * ```
 */
const validateFilterSearch = <TKey extends string>(
  search: SearchParams<TKey>,
  fields: FilterSearchFields<TKey>,
): FilterSearch<TKey> => {
  const valid: FilterSearch<TKey> = {};

  for (const { id, value } of parseFilterSearch(search, fields)) {
    if (isFieldId(fields, id) && isFilterRule(value)) {
      valid[id] = encodeFilterParam(value);
    }
  }

  return valid;
};

/** The parts of a column definition `getColumnFilterFields` reads. */
interface FilterSearchColumn {
  id?: string;
  /** A key of the row type: TanStack types it from the row, so generic columns need `PropertyKey`. */
  accessorKey?: PropertyKey;
  meta?: unknown;
  columns?: readonly FilterSearchColumn[];
}

/**
 * The filterable fields of column definitions, by column id, for the search codec. Columns made
 * filterable with `filterColumn(…)` are found, including columns inside groups.
 */
const getColumnFilterFields = (columns: readonly FilterSearchColumn[]): FilterSearchFields =>
  Object.fromEntries(
    columns.flatMap(function collect(column): [string, { type: FilterType }][] {
      const nested = column.columns?.flatMap(collect) ?? [];
      // TanStack makes an id from an accessor key, writing nested keys' dots as underscores.
      const id = column.id ?? column.accessorKey?.toString().replaceAll(".", "_");

      return id !== undefined && hasFilterConfig(column.meta)
        ? [...nested, [id, { type: column.meta.filter.type }]]
        : nested;
    }),
  );

export {
  decodeFilterParam,
  encodeFilterParam,
  getColumnFilterFields,
  parseFilterSearch,
  toFilterSearch,
  validateFilterSearch,
};

export type { FilterSearch, FilterSearchColumn, FilterSearchFields, SearchParams };
