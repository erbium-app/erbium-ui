import {
  createFilters as createCoreFilters,
  filterColumn as coreFilterColumn,
  hasFilterConfig as coreHasFilterConfig,
} from "@erbium-ui/react/filters";
import type * as Core from "@erbium-ui/react/filters";
import type { IconName } from "@erbium/icons";

/*
 * Erbium's filter model: the @erbium-ui/react filter core, with the settings Erbium's filter
 * design reads. Fields take an icon, a text placeholder and a number format; options take an
 * icon. The core owns rules, matching, the table filter function and the URL codec.
 */

interface FilterFieldExtra {
  /** The field's icon in the add-filter menu, chips and facets. */
  icon: IconName;
  /** Text fields: the input placeholder. */
  placeholder: string;
  /** Number fields: how values are written in the filter summary and inputs. */
  format: Intl.NumberFormatOptions;
}

interface FilterOptionExtra {
  icon: IconName;
}

/** One choice of an option field. Options with `children` group the options below them. */
type FilterOption = Core.FilterOption<FilterOptionExtra>;

/** How a field is filtered: its type, its label, and what its editor offers. */
type FilterFieldConfig = Core.FilterFieldConfig<FilterFieldExtra, FilterOptionExtra>;

/** The column meta a filterable column carries. Declare it with `columnMeta: {} as FilterColumnMeta`. */
type FilterColumnMeta = Core.FilterColumnMeta<FilterFieldExtra, FilterOptionExtra>;

/** A field as the filter components see it: its config, its rule, and the counts from the data. */
type FilterField = Core.FilterField<FilterFieldExtra, FilterOptionExtra>;

/** The filter state of a table or list, as the filter components read and change it. */
type Filters = Core.Filters<FilterFieldExtra, FilterOptionExtra>;

type FilterSource = Core.FilterSource<FilterFieldExtra, FilterOptionExtra>;

/**
 * Makes a column filterable in one place: spread it into the column definition to set both its
 * filter function and its `meta.filter` config.
 *
 * ```ts
 * columnHelper.accessor("status", { ...filterColumn({ type: "option", label: "Status", options }) })
 * ```
 */
const filterColumn = (config: FilterFieldConfig) =>
  coreFilterColumn<FilterFieldExtra, FilterOptionExtra>(config);

/** Whether a column's meta holds a filter config, whatever else the meta holds. */
const hasFilterConfig = (meta: unknown): meta is { filter: FilterFieldConfig } =>
  coreHasFilterConfig<FilterFieldExtra, FilterOptionExtra>(meta);

/** Builds the `Filters` the components read from field sources and column filter state. */
const createFilters = (
  sources: FilterSource[],
  state: Core.FilterState,
  setState: (update: Core.FilterStateUpdate) => void,
): Filters => createCoreFilters<FilterFieldExtra, FilterOptionExtra>(sources, state, setState);

export { createFilters, filterColumn, hasFilterConfig };

export {
  changeOperator,
  createRule,
  filterFn_rule,
  filterOperators,
  findOption,
  forEachLeafOption,
  formatDayKey,
  getFieldActions,
  getOperatorLabel,
  getRuleValues,
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
} from "@erbium-ui/react/filters";

export type {
  FilterCell,
  FilterFieldActions,
  FilterOperator,
  FilterRule,
  FilterScalar,
  FilterType,
  FilterValue,
} from "@erbium-ui/react/filters";

export type {
  FilterColumnMeta,
  FilterField,
  FilterFieldConfig,
  FilterFieldExtra,
  FilterOption,
  FilterOptionExtra,
  Filters,
  FilterSource,
};
