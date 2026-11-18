import * as React from "react";
import type { CascaderNode } from "../cascader/tree";
import { createRule, forEachLeafOption, getFieldActions, isOptionType } from "./rules";
import type { FilterField, FilterOption, Filters } from "./rules";

/*
 * Bindings from filters to a cascader. Each hook returns props for a multiple cascader root: the
 * headless `Cascader.Root` takes them as they are, and a styled cascader can map `items` to its
 * own node shape first, since node values are kept.
 */

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

/** The change details a picker reads: which row was toggled. A cascader passes more. */
interface PickerChangeDetails {
  node: { value: string } | null;
}

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
): CascaderNode<TData>[] =>
  options.map((option) => ({
    ...toNode(option),
    children: option.children === undefined ? undefined : toOptionNodes(option.children, toNode),
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

  const targets = new Map<string, Data>();
  const value: string[] = [];

  const items = filters.fields.map((field): CascaderNode<Data> => {
    const fieldValue = pickerValue(field.id);
    const data: Data = { field };

    targets.set(fieldValue, data);

    if (!isOptionType(field.type)) {
      if (field.rule !== undefined) {
        value.push(fieldValue);
      }

      return { data, label: field.label, value: fieldValue };
    }

    forEachLeafOption(field.options, (option) => {
      targets.set(pickerValue(field.id, option.value), {
        count: countOf(field, option),
        field,
        option,
      });
    });

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
    onValueChange: (values: string[], details: PickerChangeDetails) => {
      const target = details.node === null ? undefined : targets.get(details.node.value);

      if (details.node === null || target === undefined) {
        return;
      }

      const checked = values.includes(details.node.value);
      const { field, option } = target;

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
