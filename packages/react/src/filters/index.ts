import {
  FiltersClear,
  FiltersField,
  FiltersOperator,
  FiltersOperatorItem,
  FiltersRemove,
  FiltersRoot,
  FiltersValue,
} from "./parts";
import type { Filters as FilterSet } from "./rules";

/**
 * The filter state of a table or list, as filter parts read and change it. The same name holds
 * the parts, so `Filters` is both the model type and the namespace.
 */
// oxlint-disable-next-line eslint/no-redeclare -- TypeScript keeps types and values apart; the namespace and the model it reads share one name, as Base UI's parts and their types do.
type Filters<TExtra extends object = object, TOptionExtra extends object = object> = FilterSet<
  TExtra,
  TOptionExtra
>;

/**
 * A filter builder for lists and tables: one set of filters provided by `Root`, and parts scoped to
 * one field by `Field`. Pickers that add filters and choose options bind to a cascader through
 * `useFieldPicker` and `useOptionPicker`.
 */
const Filters = {
  Clear: FiltersClear,
  Field: FiltersField,
  Operator: FiltersOperator,
  OperatorItem: FiltersOperatorItem,
  Remove: FiltersRemove,
  Root: FiltersRoot,
  Value: FiltersValue,
};

export { Filters };

export { useFilterField, useFilters } from "./parts";

export type {
  FilterFieldState,
  FiltersFieldProps,
  FiltersOperatorItemProps,
  FiltersRootProps,
  FiltersValueProps,
  UseFilterFieldReturnValue,
} from "./parts";

export { useFilterSearch, useListFilters, useTableFilters } from "./adapters";

export type {
  FilterableColumn,
  FilterableTable,
  FilterSearchOptions,
  FilterStateUpdater,
  ListFilterField,
  ListFiltersOptions,
  TableFiltersOptions,
} from "./adapters";

export { useFieldPicker, useOptionPicker } from "./pickers";

export type {
  FieldPickerData,
  FieldPickerOptions,
  OptionPickerData,
  PickerChangeDetails,
} from "./pickers";

export * from "./core";
