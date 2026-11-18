import * as React from "react";
import type { CascaderValueChangeDetails } from "../cascader/context";
import type { CascaderNode } from "../cascader/tree";
import { createRule, getFieldActions, isOptionType } from "./rules";
import type { FilterField, FilterOption, Filters } from "./rules";

/** What a field picker row stands for: a field, or one option of an option field. */
interface FieldPickerData<TExtra extends object = object, TOptionExtra extends object = object> {
  field: FilterField<TExtra, TOptionExtra>;
  /** The option the row chooses. Absent on a field row. */
  option?: FilterOption<TOptionExtra>;
  /** How many items have the option under the other active filters, when the field counts them. */
  count?: number;
}

/** What an option picker row stands for. */
interface OptionPickerData<TOptionExtra extends object = object> {
  option: FilterOption<TOptionExtra>;
  /** How many items have the option under the other active filters, when the field counts them. */
  count?: number;
}

/** A cascader node with the picker data available on every row. */
interface PickerNode<TData> extends CascaderNode<TData> {
  children?: PickerNode<TData>[];
  data: TData;
}

/** The part of a cascader change a picker reads. */
type PickerChangeDetails<TData = FieldPickerData> = Pick<
  CascaderValueChangeDetails<PickerNode<TData>>,
  "node"
>;

interface FieldPickerOptions {
  /**
   * Called with a text, number or date field just added, once the picker has closed and returned
   * focus to its trigger, so that field's value editor can open.
   */
  onFieldAdded?: (id: string) => void;
}

/** A field row's value, or an option row's. JSON keeps any field id and option value apart. */
const pickerValue = (id: string, option?: string) =>
  JSON.stringify(option === undefined ? [id] : [id, option]);

const countOf = (field: FilterField, option: FilterOption) =>
  field.counts === undefined || option.children !== undefined
    ? undefined
    : (field.counts.get(option.value) ?? 0);

const toOptionNodes = <TData, TOptionExtra extends object>(
  options: readonly FilterOption<TOptionExtra>[],
  toNode: (option: FilterOption<TOptionExtra>) => { value: string; data: TData },
): PickerNode<TData>[] =>
  options.map((option) => ({
    ...toNode(option),
    children: option.children === undefined ? undefined : toOptionNodes(option.children, toNode),
    disabled: option.disabled,
    keywords: option.keywords,
    label: option.label,
  }));

/** The chosen option values of a field's rule. */
const chosenValues = (field: FilterField) =>
  (field.rule?.values ?? []).flatMap((value) => (value === null ? [] : [String(value)]));

/**
 * Binds an add-filter picker to a cascader. Fields are the top level; an option field opens its
 * option tree, whose rows toggle options, and a text, number or date field is one row, checked
 * while it has a rule. Choosing such a field adds an empty rule and closes the picker.
 */
const useFieldPicker = <TExtra extends object = object, TOptionExtra extends object = object>(
  filters: Filters<TExtra, TOptionExtra>,
  { onFieldAdded }: FieldPickerOptions = {},
) => {
  type Data = FieldPickerData<TExtra, TOptionExtra>;

  const [open, setOpen] = React.useState(false);
  const added = React.useRef<string | null>(null);

  const value: string[] = [];

  const items = filters.fields.map((field): PickerNode<Data> => {
    const fieldValue = pickerValue(field.id);
    const data: Data = { field };

    if (!isOptionType(field.type)) {
      if (field.rule !== undefined) {
        value.push(fieldValue);
      }

      return { data, label: field.label, value: fieldValue };
    }

    for (const chosen of chosenValues(field)) {
      value.push(pickerValue(field.id, chosen));
    }

    return {
      children: toOptionNodes(field.options, (option) => ({
        data: { count: countOf(field, option), field, option },
        value: pickerValue(field.id, option.value),
      })),
      data,
      label: field.label,
      value: fieldValue,
    };
  });

  return {
    items,
    onOpenChange: (next: boolean) => {
      setOpen(next);
    },
    onOpenChangeComplete: (next: boolean) => {
      if (!next && added.current !== null) {
        onFieldAdded?.(added.current);
        added.current = null;
      }
    },
    onValueChange: (values: string[], details: PickerChangeDetails<Data>) => {
      const { node } = details;

      if (node === null) {
        return;
      }

      const checked = values.includes(node.value);
      const { field, option } = node.data;

      if (option !== undefined) {
        getFieldActions(field).toggleOption(option.value, checked);
      } else if (checked) {
        if (field.rule === undefined) {
          field.setRule(createRule(field.type));
        }

        added.current = field.id;
        setOpen(false);
      } else {
        field.setRule(undefined);
      }
    },
    open,
    value,
  };
};

/**
 * Binds an option field's options to a multiple cascader: the rule's values are the selection,
 * and unchecking the last option removes the rule.
 */
const useOptionPicker = <TExtra extends object = object, TOptionExtra extends object = object>(
  field: FilterField<TExtra, TOptionExtra>,
) => ({
  items: toOptionNodes(field.options, (option) => ({
    data: { count: countOf(field, option), option } satisfies OptionPickerData<TOptionExtra>,
    value: option.value,
  })),
  onValueChange: (values: string[]) => {
    if (values.length === 0) {
      field.setRule(undefined);
    } else {
      getFieldActions(field).setValues(values);
    }
  },
  value: chosenValues(field),
});

export { useFieldPicker, useOptionPicker };

export type { FieldPickerData, FieldPickerOptions, OptionPickerData, PickerChangeDetails };
