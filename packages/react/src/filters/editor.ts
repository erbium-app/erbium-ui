import {
  filterOperators,
  formatDayKey,
  getFieldActions,
  getOperatorLabel,
  isNumber,
  isOptionType,
  isRangeOperator,
  isText,
  parseDayKey,
} from "./rules";
import type { FilterField, FilterValue } from "./rules";

interface FilterEditorOptions {
  locale?: Intl.LocalesArgument;
  numberFormat?: Intl.NumberFormatOptions;
  onOpenChange?: (open: boolean) => void;
}

interface FilterDateRange {
  from: Date | undefined;
  to?: Date;
}

const toDay = (value: FilterValue | undefined): Date | undefined => {
  if (value === undefined || !isText(value) || value === "") {
    return undefined;
  }

  const day = parseDayKey(value);

  return Number.isNaN(day.getTime()) ? undefined : day;
};

const dayValue = (date: Date | undefined) => (date === undefined ? null : formatDayKey(date));

/** Bindings for native or custom number and date editors. */
const getFilterEditor = (
  field: FilterField,
  { locale, numberFormat, onOpenChange }: FilterEditorOptions = {},
) => {
  const actions = getFieldActions(field);
  const { rule, type, label } = field;
  const [first, second] = rule?.values ?? [];
  const range = isRangeOperator(rule?.operator ?? filterOperators[type][0]);

  const onEditorOpenChange = (open: boolean) => {
    if (!open && !isOptionType(type)) {
      actions.removeIfEmpty();
    }

    onOpenChange?.(open);
  };

  if (type === "number") {
    const formatter = new Intl.NumberFormat(locale, numberFormat);

    const input = (index: 0 | 1, name: string, bound?: number) => {
      const value = rule?.values[index];

      return {
        label: name,
        value: value !== undefined && isNumber(value) ? value : null,
        min: field.min,
        max: field.max,
        step: field.step,
        locale,
        format: numberFormat,
        placeholder: bound === undefined ? undefined : formatter.format(bound),
        onValueChange: (next: number | null) => {
          actions.setValue(index, next);
        },
      };
    };

    return {
      type,
      start: input(
        0,
        range ? `${label} from` : label,
        range ? (field.min ?? field.range?.[0]) : undefined,
      ),
      end: range ? input(1, `${label} to`, field.max ?? field.range?.[1]) : undefined,
      onOpenChange: onEditorOpenChange,
    };
  }

  if (type === "date") {
    const from = toDay(first);

    if (range) {
      return {
        type,
        calendar: {
          mode: "range" as const,
          defaultMonth: from,
          selected: { from, to: toDay(second) },
          onSelect: (next: FilterDateRange | undefined) => {
            actions.setValues([dayValue(next?.from), dayValue(next?.to)]);
          },
        },
        onOpenChange: onEditorOpenChange,
      };
    }

    return {
      type,
      calendar: {
        mode: "single" as const,
        defaultMonth: from,
        selected: from,
        onSelect: (next: Date | undefined) => {
          actions.setValues(next === undefined ? [] : [formatDayKey(next)]);
        },
      },
      onOpenChange: onEditorOpenChange,
    };
  }

  return { type, onOpenChange: onEditorOpenChange };
};

/** The active operator and its alternatives, with labels resolved for the rule's arity. */
const getFilterOperatorChoices = (field: Pick<FilterField, "rule" | "type">) => {
  const { rule, type } = field;

  if (rule === undefined) {
    return null;
  }

  const count = rule.values.length;
  const label = getOperatorLabel(type, rule.operator, count);

  const items = filterOperators[type].map((operator) => ({
    label: getOperatorLabel(type, operator, count),
    operator,
  }));

  return { items, label };
};

export { getFilterEditor, getFilterOperatorChoices };

export type { FilterEditorOptions, FilterDateRange };
