/*
 * The filter core, without React: the rule model, matching, the table filter function and the URL
 * codec. Safe to import on a server, such as a route loader that validates filter params.
 */

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
} from "./rules";

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
} from "./rules";

export {
  decodeFilterParam,
  encodeFilterParam,
  getColumnFilterFields,
  parseFilterSearch,
  toFilterSearch,
  validateFilterSearch,
} from "./search";

export type { FilterSearch, FilterSearchColumn, FilterSearchFields, SearchParams } from "./search";

export { getFilterEditor, getFilterOperatorChoices } from "./editor";

export type { FilterDateRange, FilterEditorOptions } from "./editor";

export { getFilterSummary } from "./presentation";

export type { FilterSummary, FilterSummaryOptions } from "./presentation";
