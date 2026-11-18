import {
  findOption,
  isNumber,
  isOptionType,
  isRangeOperator,
  isRuleEmpty,
  isText,
  parseDayKey,
} from "./rules";
import type { FilterField, FilterValue } from "./rules";

interface FilterSummaryOptions {
  locale?: Intl.LocalesArgument;
  numberFormat?: Intl.NumberFormatOptions;
  dateFormat?: Intl.DateTimeFormatOptions;
  /** How many option labels to show before using the selection count. */
  maxOptionLabels?: number;
  formatCount?: (count: number) => string;
  formatText?: (text: string) => string;
  formatRange?: (start: string | null, end: string | null) => string;
}

interface FilterSummary {
  text: string | null;
  /** All selected options in rule order, even when the display is collapsed. */
  options: readonly { value: string; label: string }[];
  collapsed: boolean;
}

/** Resolves labels and formats a field's rule without changing its stored values. */
const getFilterSummary = (
  field: Pick<FilterField, "rule" | "type" | "options">,
  {
    locale,
    numberFormat,
    dateFormat,
    maxOptionLabels = Infinity,
    formatCount = (count) => `${count} selected`,
    formatText = (text) => text,
    formatRange = (start, end) => `${start ?? "…"} – ${end ?? "…"}`,
  }: FilterSummaryOptions = {},
): FilterSummary => {
  const { rule, type } = field;

  if (rule === undefined || isRuleEmpty(rule)) {
    return { collapsed: false, options: [], text: null };
  }

  if (isOptionType(type)) {
    const options = rule.values.flatMap((value) => {
      if (value === null || value === "") {
        return [];
      }

      const id = String(value);

      return [{ label: findOption(field.options, id)?.label ?? id, value: id }];
    });

    const collapsed = options.length > maxOptionLabels;

    return {
      collapsed,
      options,
      text: collapsed ? formatCount(options.length) : options.map(({ label }) => label).join(", "),
    };
  }

  const number = type === "number" ? new Intl.NumberFormat(locale, numberFormat) : undefined;

  const date =
    type === "date"
      ? new Intl.DateTimeFormat(locale, dateFormat ?? { dateStyle: "medium" })
      : undefined;

  const format = (value: FilterValue | undefined): string | null => {
    if (value === undefined || value === null || value === "") {
      return null;
    }

    if (number !== undefined && isNumber(value)) {
      return number.format(value);
    }

    if (date !== undefined && isText(value)) {
      const day = parseDayKey(value);

      return Number.isNaN(day.getTime()) ? value : date.format(day);
    }

    return String(value);
  };

  const [first, second] = rule.values;
  const start = format(first);
  let text = start;

  if (isRangeOperator(rule.operator)) {
    text = formatRange(start, format(second));
  } else if (type === "text" && start !== null) {
    text = formatText(start);
  }

  return { collapsed: false, options: [], text };
};

export { getFilterSummary };

export type { FilterSummary, FilterSummaryOptions };
